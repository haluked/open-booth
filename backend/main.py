import asyncio
import hashlib
import hmac
import html
import json
import re
import secrets
import time
from collections import defaultdict, deque
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.exceptions import HTTPException as StarletteHTTPException

# Base directory paths
BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

# Regex patterns & constants
ROOM_CODE_REGEX = re.compile(r"^[A-Z0-9_-]{3,16}$")
SAFE_PREFIXES = ["BOOTH", "Y2K", "NEO", "RETRO", "PIXEL", "CHROME", "CYBER", "AERO", "FLASH", "SIGNAL"]
# Disambiguated characters (excluding 0, O, 1, I)
SAFE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
RATE_LIMIT_WINDOW = 60.0  # seconds
RATE_LIMIT_MAX_REQUESTS = 300  # requests per window
DISCONNECT_GRACE_PERIOD = 45.0  # seconds
MAX_WS_MESSAGE_BYTES = 65536  # 64 KB maximum signaling frame
ALLOWED_WS_TYPES = {"offer", "answer", "ice-candidate", "action_start_shoot", "update_nick"}


# ---------------------------------------------------------------------------
# Rate Limiter with Stale IP Pruning
# ---------------------------------------------------------------------------
class SlidingWindowRateLimiter:
    """Sliding-window in-memory rate limiter per client IP with bounded memory."""
    def __init__(self, limit: int = RATE_LIMIT_MAX_REQUESTS, window: float = RATE_LIMIT_WINDOW):
        self.limit = limit
        self.window = window
        self.requests: Dict[str, deque] = {}
        self._lock = asyncio.Lock()
        self._last_cleanup = time.time()

    async def is_allowed(self, client_ip: str) -> bool:
        async with self._lock:
            now = time.time()
            cutoff = now - self.window

            # Periodic cleanup of all stale IPs every 60 seconds
            if now - self._last_cleanup > 60.0:
                self._last_cleanup = now
                stale_ips = [ip for ip, reqs in self.requests.items() if not reqs or reqs[-1] <= cutoff]
                for ip in stale_ips:
                    del self.requests[ip]

            reqs = self.requests.get(client_ip)
            if reqs is None:
                reqs = deque()
                self.requests[client_ip] = reqs

            # Prune expired entries from the front
            while reqs and reqs[0] <= cutoff:
                reqs.popleft()

            if not reqs:
                self.requests.pop(client_ip, None)
                reqs = deque()
                self.requests[client_ip] = reqs

            if len(reqs) < self.limit:
                reqs.append(now)
                return True
            return False


rate_limiter = SlidingWindowRateLimiter()

# Per-room failed password verification tracker (mitigates brute-forcing)
room_failed_verifications: Dict[str, List[float]] = defaultdict(list)
verification_lock = asyncio.Lock()
last_verification_cleanup: float = time.time()

TRUSTED_PROXIES = {"127.0.0.1", "::1"}


def get_client_ip(request_or_ws: Request | WebSocket) -> str:
    """Extract real client IP considering forwarded proxies only from trusted local proxy."""
    peer_ip = request_or_ws.client.host if (request_or_ws.client and request_or_ws.client.host) else "127.0.0.1"
    if peer_ip in TRUSTED_PROXIES:
        forwarded = request_or_ws.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return peer_ip


def sanitize_nickname(nick: Optional[str]) -> str:
    """Sanitize nickname, strip tags and control chars, escape entities, max 24 chars."""
    if not nick:
        return "Guest"
    # Strip HTML tags
    cleaned = re.sub(r"<[^>]*>", "", nick)
    # Strip control and unprintable characters
    cleaned = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", cleaned)
    # Escape HTML
    cleaned = html.escape(cleaned.strip())
    cleaned = cleaned[:24].strip()
    return cleaned if cleaned else "Guest"


def sanitize_room_code(code: str) -> str:
    """Validate and normalize room code."""
    cleaned = code.strip().upper()
    if not ROOM_CODE_REGEX.match(cleaned):
        raise HTTPException(
            status_code=400,
            detail="Invalid room code format. Must be 3-16 characters consisting of uppercase letters, numbers, hyphens, or underscores."
        )
    return cleaned


def generate_room_code() -> str:
    """Generate a high-entropy cryptographically secure human-friendly code (32^5 = 33.5M combinations)."""
    prefix = secrets.choice(SAFE_PREFIXES)
    suffix = "".join(secrets.choice(SAFE_CHARS) for _ in range(5))
    return f"{prefix}-{suffix}"


# ---------------------------------------------------------------------------
# Room Model & In-Memory Store
# ---------------------------------------------------------------------------
class Room:
    def __init__(self, room_id: str, password: Optional[str] = None):
        self.room_id: str = room_id.upper()
        self.created_at: float = time.time()
        self.last_activity: float = time.time()
        self.peers: Dict[WebSocket, dict] = {}  # WebSocket -> {"nick": str, "joined_at": float}
        self.disconnect_timers: Dict[str, asyncio.Task] = {}
        self.lock: asyncio.Lock = asyncio.Lock()

        if password:
            self.salt: Optional[str] = secrets.token_hex(16)
            self.password_hash: Optional[str] = self._hash_password(password, self.salt)
        else:
            self.salt = None
            self.password_hash = None

    @staticmethod
    def _hash_password(password: str, salt: str) -> str:
        return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()

    def verify_password(self, password: Optional[str]) -> bool:
        if not self.password_hash:
            return True
        if not password or not self.salt:
            return False
        computed = self._hash_password(password, self.salt)
        return hmac.compare_digest(computed, self.password_hash)

    @property
    def is_protected(self) -> bool:
        return self.password_hash is not None

    @property
    def is_full(self) -> bool:
        return len(self.peers) >= 2

    def cancel_disconnect_timer(self):
        timer = self.disconnect_timers.pop("grace_timer", None)
        if timer and not timer.done():
            timer.cancel()

    def set_disconnect_timer(self, task: asyncio.Task):
        self.cancel_disconnect_timer()
        self.disconnect_timers["grace_timer"] = task


# In-memory store and global lock
rooms: Dict[str, Room] = {}
rooms_lock = asyncio.Lock()


async def schedule_room_cleanup(room_id: str, delay: float = DISCONNECT_GRACE_PERIOD):
    """Grace period timer before pruning an empty room."""
    try:
        await asyncio.sleep(delay)
        async with rooms_lock:
            if room_id in rooms:
                room = rooms[room_id]
                async with room.lock:
                    if len(room.peers) == 0:
                        rooms.pop(room_id, None)
                        async with verification_lock:
                            room_failed_verifications.pop(room_id, None)
    except asyncio.CancelledError:
        pass


# ---------------------------------------------------------------------------
# FastAPI App & Middleware
# ---------------------------------------------------------------------------
app = FastAPI(
    title="OpenBooth Signaling & Web Server",
    description="Synchronized WebRTC Photobooth with Y2K Aesthetic",
    version="2.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Security Response Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    # Apply rate limiting to /api/ endpoints
    if request.url.path.startswith("/api/"):
        client_ip = get_client_ip(request)
        if not await rate_limiter.is_allowed(client_ip):
            resp = JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Limit is {RATE_LIMIT_MAX_REQUESTS} requests per minute."
                },
                headers={"Retry-After": str(int(RATE_LIMIT_WINDOW))}
            )
            resp.headers["X-Content-Type-Options"] = "nosniff"
            resp.headers["X-Frame-Options"] = "DENY"
            return resp

    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com http://localhost:8400; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' data: https://fonts.gstatic.com; "
        "img-src 'self' data: blob:; "
        "connect-src 'self' ws: wss: http://localhost:8400 ws://localhost:8400; "
        "media-src 'self' blob:; "
        "frame-ancestors 'none';"
    )
    # Cache-Control for static assets
    if request.url.path.startswith(('/fonts/', '/assets/', '/static/')):
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    elif request.url.path in ("/robots.txt", "/sitemap.xml"):
        response.headers["Cache-Control"] = "public, max-age=86400"
    return response


# ---------------------------------------------------------------------------
# Custom 404 & Error Handler
# ---------------------------------------------------------------------------
THEMED_404_HTML = """<!DOCTYPE html>
<html lang="en" class="h-full bg-[#030712] text-[#f1f5f9]">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 // SIGNAL LOST — OPEN BOOTH</title>
  <style>
    body {
      margin: 0;
      background: radial-gradient(circle at 50% 30%, #0b1528 0%, #030712 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #f1f5f9;
      text-align: center;
      padding: 1.5rem;
    }
    .card {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(0, 240, 255, 0.3);
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05);
      border-radius: 1rem;
      padding: 2.5rem 2rem;
      max-width: 480px;
      width: 100%;
      backdrop-filter: blur(12px);
    }
    .tag {
      display: inline-block;
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    h1 {
      font-size: 4rem;
      margin: 0;
      letter-spacing: -0.05em;
      background: linear-gradient(135deg, #00f0ff 0%, #a855f7 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 1.25rem 0 2rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #00f0ff;
      color: #030712;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      text-decoration: none;
      padding: 0.85rem 1.75rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
    }
    .btn:hover {
      background: #38bdf8;
      box-shadow: 0 0 25px rgba(0, 240, 255, 0.7);
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">TERMINAL 404 // SIGNAL LOST</div>
    <h1>404</h1>
    <p>The photobooth terminal or room route you are trying to reach does not exist or the frequency has faded.</p>
    <a href="/" class="btn">RETURN TO PHOTOBOOTH</a>
  </div>
</body>
</html>
"""


@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        # Return JSON for API routes
        if request.url.path.startswith("/api/"):
            return JSONResponse(
                status_code=404,
                content={"error": "Not Found", "message": exc.detail or "Resource not found"}
            )
        # Return Themed 404 HTML for browser navigation
        page_404 = FRONTEND_DIR / "404.html"
        if page_404.exists():
            return FileResponse(page_404, status_code=404)
        return HTMLResponse(content=THEMED_404_HTML, status_code=404)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


# ---------------------------------------------------------------------------
# Static Files & SEO Routes
# ---------------------------------------------------------------------------
@app.get("/robots.txt", include_in_schema=False)
async def get_robots():
    robots_path = FRONTEND_DIR / "robots.txt"
    if robots_path.exists():
        return FileResponse(robots_path, media_type="text/plain")
    return Response(
        content="User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /ws/\nSitemap: /sitemap.xml\n",
        media_type="text/plain"
    )


@app.get("/sitemap.xml", include_in_schema=False)
async def get_sitemap():
    sitemap_path = FRONTEND_DIR / "sitemap.xml"
    if sitemap_path.exists():
        return FileResponse(sitemap_path, media_type="application/xml")
    return Response(
        content='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://openbooth.app/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>',
        media_type="application/xml"
    )


@app.get("/favicon.ico", include_in_schema=False)
async def get_favicon():
    favicon_path = FRONTEND_DIR / "favicon.ico"
    if favicon_path.exists():
        return FileResponse(favicon_path, media_type="image/x-icon")
    raise HTTPException(status_code=404, detail="Favicon not found")


# Landing page
@app.get("/", response_class=FileResponse)
async def serve_index():
    index_file = FRONTEND_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Frontend index.html not found")
    return FileResponse(index_file)


# Direct link sharing route
@app.get("/room/{room_code}", response_class=FileResponse)
async def serve_room_page(room_code: str):
    clean_code = sanitize_room_code(room_code)
    index_file = FRONTEND_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Frontend index.html not found")
    return FileResponse(index_file)


# Legal pages
@app.get("/privacy", response_class=FileResponse)
async def serve_privacy():
    index_file = FRONTEND_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Frontend index.html not found")
    return FileResponse(index_file)


@app.get("/terms", response_class=FileResponse)
async def serve_terms():
    index_file = FRONTEND_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Frontend index.html not found")
    return FileResponse(index_file)


# ---------------------------------------------------------------------------
# REST Endpoints
# ---------------------------------------------------------------------------
class CreateRoomRequest(BaseModel):
    room_code: Optional[str] = Field(None, description="Optional custom room code")
    password: Optional[str] = Field(None, description="Optional room protection password")
    creator_nick: Optional[str] = Field("Host", description="Nickname of creator")


class VerifyRoomRequest(BaseModel):
    room_id: str = Field(..., description="Room identifier")
    password: Optional[str] = Field(None, description="Password to test")


@app.post("/api/rooms/create")
async def create_room(req: CreateRoomRequest):
    async with rooms_lock:
        if req.room_code and req.room_code.strip():
            room_id = sanitize_room_code(req.room_code)
            if room_id in rooms:
                existing_room = rooms[room_id]
                async with existing_room.lock:
                    if len(existing_room.peers) > 0:
                        raise HTTPException(status_code=409, detail="Room code is currently occupied and active.")
                    # Disallow unauthorized room recreation while active grace period is running
                    if existing_room.is_protected:
                        if not req.password or not existing_room.verify_password(req.password):
                            raise HTTPException(
                                status_code=409,
                                detail="Room is currently held in disconnect grace period. Valid password required to reclaim."
                            )
                    else:
                        raise HTTPException(
                            status_code=409,
                            detail="Room code is currently held in disconnect grace period."
                        )
                    existing_room.cancel_disconnect_timer()
        else:
            # Generate non-colliding human-friendly room code
            for _ in range(20):
                candidate = generate_room_code()
                if candidate not in rooms:
                    room_id = candidate
                    break
            else:
                room_id = f"BOOTH-{secrets.token_hex(2).upper()}"

        # Create room and save to memory store
        room = Room(room_id=room_id, password=req.password)
        # Start a 5-minute cleanup timer so abandoned created rooms don't linger forever
        room.set_disconnect_timer(
            asyncio.create_task(schedule_room_cleanup(room_id, 300.0))
        )
        rooms[room_id] = room

    return {
        "success": True,
        "room_id": room_id,
        "roomId": room_id,
        "is_protected": room.is_protected
    }


@app.post("/api/rooms/verify")
async def verify_room(req: VerifyRoomRequest):
    global last_verification_cleanup
    try:
        clean_room_id = sanitize_room_code(req.room_id)
    except HTTPException:
        return {
            "exists": False,
            "room_id": req.room_id.upper() if req.room_id else "",
            "is_full": False,
            "password_required": False,
            "is_protected": False,
            "valid": False,
            "count": 0
        }

    async with rooms_lock:
        if clean_room_id not in rooms:
            return {
                "exists": False,
                "room_id": clean_room_id,
                "is_full": False,
                "password_required": False,
                "is_protected": False,
                "valid": False,
                "count": 0
            }
        room = rooms[clean_room_id]

    now = time.time()
    cutoff = now - 60.0

    async with verification_lock:
        # Periodic cleanup of stale verification entries every 60 seconds
        if now - last_verification_cleanup > 60.0:
            last_verification_cleanup = now
            stale_rooms = [r for r, fails in room_failed_verifications.items() if not fails or fails[-1] <= cutoff]
            for r in stale_rooms:
                room_failed_verifications.pop(r, None)

        recent_failures = [t for t in room_failed_verifications.get(clean_room_id, []) if t > cutoff]
        if recent_failures:
            room_failed_verifications[clean_room_id] = recent_failures
        else:
            room_failed_verifications.pop(clean_room_id, None)

        if len(recent_failures) >= 5:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too many failed attempts. Room locked temporarily.",
                    "valid": False
                },
                headers={"Retry-After": "60"}
            )

    async with room.lock:
        is_protected = room.is_protected
        if is_protected:
            valid = room.verify_password(req.password)
            if not valid and req.password is not None:
                async with verification_lock:
                    room_failed_verifications[clean_room_id].append(now)
        else:
            valid = True

        is_full = room.is_full
        count = len(room.peers)

    return {
        "exists": True,
        "room_id": clean_room_id,
        "roomId": clean_room_id,
        "is_full": is_full,
        "password_required": is_protected,
        "is_protected": is_protected,
        "valid": valid,
        "count": count
    }


@app.get("/api/rooms/{room_id}/status")
@app.get("/rooms/{room_id}/status")  # Backwards compatibility
async def get_room_status(room_id: str):
    try:
        clean_room_id = sanitize_room_code(room_id)
    except HTTPException:
        return {
            "exists": False,
            "room_id": room_id.upper(),
            "roomId": room_id.upper(),
            "count": 0,
            "max": 2,
            "is_protected": False,
            "protected": False,
            "formatted": "0/2"
        }

    async with rooms_lock:
        if clean_room_id not in rooms:
            return {
                "exists": False,
                "room_id": clean_room_id,
                "roomId": clean_room_id,
                "count": 0,
                "max": 2,
                "is_protected": False,
                "protected": False,
                "formatted": "0/2"
            }
        room = rooms[clean_room_id]

    async with room.lock:
        count = len(room.peers)
        is_protected = room.is_protected

    return {
        "exists": True,
        "room_id": clean_room_id,
        "roomId": clean_room_id,
        "count": count,
        "max": 2,
        "is_protected": is_protected,
        "protected": is_protected,
        "formatted": f"{count}/2"
    }


# ---------------------------------------------------------------------------
# WebSocket Signaling (`/ws/{room_id}`)
# ---------------------------------------------------------------------------
async def broadcast_room_status(room: Room):
    """Broadcast participant count and nicknames to all members."""
    nicks = [p["nick"] for p in room.peers.values()]
    msg = {
        "type": "room_status",
        "roomId": room.room_id,
        "count": len(room.peers),
        "max": 2,
        "nicks": nicks
    }
    for client in list(room.peers.keys()):
        try:
            await client.send_json(msg)
        except Exception:
            pass


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    nick: Optional[str] = Query(None),
    pwd: Optional[str] = Query(None)
):
    # Rate limit check for WebSocket handshake
    client_ip = get_client_ip(websocket)
    if not await rate_limiter.is_allowed(client_ip):
        await websocket.close(code=1008, reason="Rate limit exceeded")
        return

    # Validate room code syntax
    try:
        clean_room_id = sanitize_room_code(room_id)
    except HTTPException:
        await websocket.close(code=4000, reason="Invalid room code format")
        return

    # Sanitize nickname
    clean_nick = sanitize_nickname(nick)

    # Fetch room under rooms_lock - must exist
    async with rooms_lock:
        if clean_room_id not in rooms:
            await websocket.accept()
            await websocket.send_json({
                "type": "error",
                "message": "Room not found or session expired",
                "code": "ROOM_NOT_FOUND"
            })
            await websocket.close(code=4004)
            return
        room = rooms[clean_room_id]

    # Password validation for protected rooms
    if room.is_protected:
        if not pwd:
            await websocket.accept()
            await websocket.send_json({
                "type": "error",
                "message": "Password is required for protected room",
                "code": "PASSWORD_REQUIRED"
            })
            await websocket.close(code=4001)
            return
        async with room.lock:
            valid_pw = room.verify_password(pwd)
        if not valid_pw:
            await websocket.accept()
            await websocket.send_json({
                "type": "error",
                "message": "Invalid password for protected room",
                "code": "INVALID_PASSWORD"
            })
            await websocket.close(code=4003)
            return

    # Strict capacity check & admission inside atomic room lock
    negotiation_pair = None
    async with room.lock:
        if room.is_full:
            await websocket.accept()
            await websocket.send_json({
                "type": "error",
                "message": "Room is full (maximum 2 participants)",
                "code": "ROOM_FULL"
            })
            await websocket.close(code=4002)
            return

        # Accept connection & register peer
        await websocket.accept()
        room.peers[websocket] = {
            "nick": clean_nick,
            "joined_at": time.time()
        }
        room.last_activity = time.time()
        room.cancel_disconnect_timer()

        # Capture negotiation pair atomically under room.lock to eliminate IndexError
        if len(room.peers) == 2:
            clients = list(room.peers.keys())
            c0, c1 = clients[0], clients[1]
            nick0 = room.peers[c0]["nick"]
            nick1 = room.peers[c1]["nick"]
            negotiation_pair = (c0, nick0, c1, nick1)

    # Broadcast updated room status
    await broadcast_room_status(room)

    # When 2 people are connected, initiate WebRTC negotiation with peer nicknames
    if negotiation_pair:
        c0, nick0, c1, nick1 = negotiation_pair
        try:
            await c0.send_json({
                "type": "peer_joined",
                "isInitiator": True,
                "remoteNick": nick1
            })
            await c1.send_json({
                "type": "peer_joined",
                "isInitiator": False,
                "remoteNick": nick0
            })
        except Exception:
            pass

    ws_msg_timestamps: List[float] = []

    # Message relay loop
    try:
        while True:
            raw_text = await websocket.receive_text()

            # Fast size validation: character count lower bound + conditional byte check
            if len(raw_text) > MAX_WS_MESSAGE_BYTES or (
                any(ord(c) > 127 for c in raw_text) and len(raw_text.encode("utf-8")) > MAX_WS_MESSAGE_BYTES
            ):
                await websocket.close(code=1009, reason="Message too big")
                break

            # In-session message rate limiting per connection (max 60 msgs / min)
            now = time.time()
            ws_msg_timestamps = [t for t in ws_msg_timestamps if t > now - 60.0]
            if len(ws_msg_timestamps) >= 60:
                await websocket.close(code=1008, reason="Message rate limit exceeded")
                break
            ws_msg_timestamps.append(now)

            # Parse JSON safely. If invalid JSON or not a dict, ignore/drop.
            try:
                msg = json.loads(raw_text)
            except Exception:
                continue

            if not isinstance(msg, dict):
                continue

            # Validate message type
            msg_type = msg.get("type")
            if msg_type not in ALLOWED_WS_TYPES:
                continue

            room.last_activity = time.time()

            if msg_type == "update_nick":
                new_nick = sanitize_nickname(msg.get("nick", "Guest"))
                room.peers[websocket]["nick"] = new_nick
                await broadcast_room_status(room)

            # Relay validated messages to partner peer
            for client in list(room.peers.keys()):
                if client != websocket:
                    try:
                        await client.send_text(raw_text)
                    except Exception:
                        pass
    except (WebSocketDisconnect, Exception):
        pass
    finally:
        # Peer disconnected - cleanly update under room lock
        room_ref = None
        async with rooms_lock:
            if clean_room_id in rooms:
                room_ref = rooms[clean_room_id]
        if room_ref:
            async with room_ref.lock:
                if websocket in room_ref.peers:
                    departed_info = room_ref.peers.pop(websocket, None)
                    departed_nick = departed_info.get("nick") if departed_info else "Peer"
                    room_ref.last_activity = time.time()

                    remaining_peers = list(room_ref.peers.keys())
                    if len(remaining_peers) > 0:
                        for client in remaining_peers:
                            try:
                                await client.send_json({
                                    "type": "peer_left",
                                    "nick": departed_nick
                                })
                            except Exception:
                                pass
                        nicks = [p["nick"] for p in room_ref.peers.values()]
                        status_msg = {
                            "type": "room_status",
                            "roomId": room_ref.room_id,
                            "count": len(room_ref.peers),
                            "max": 2,
                            "nicks": nicks
                        }
                        for client in remaining_peers:
                            try:
                                await client.send_json(status_msg)
                            except Exception:
                                pass
                    else:
                        # Room is now empty -> start 45-second grace period before pruning
                        room_ref.set_disconnect_timer(
                            asyncio.create_task(
                                schedule_room_cleanup(clean_room_id, DISCONNECT_GRACE_PERIOD)
                            )
                        )


# ---------------------------------------------------------------------------
# Mount Static Files (Placed AFTER specific routes)
# ---------------------------------------------------------------------------
# Mount frontend directory for direct asset access
if FRONTEND_DIR.exists():
    app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend_dir")
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static_dir")
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=False), name="frontend_root")


# ---------------------------------------------------------------------------
# Server Startup
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, app_dir=str(BASE_DIR))
