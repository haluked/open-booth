import asyncio
import json
import os
import secrets
import urllib.request
import websockets

BASE_URL = os.getenv("OPENBOOTH_BASE_URL", "http://127.0.0.1:8000")
WS_URL = os.getenv("OPENBOOTH_WS_URL", "ws://127.0.0.1:8000")


async def test_concurrency():
    room_code = f"RACE-{secrets.token_hex(2).upper()}"
    print(f"[CONCURRENCY TEST] Running race test with room: {room_code}...")

    # 1. Create room
    req = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_code, "creator_nick": "Host"}).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode())
        assert data["success"] is True, f"Failed to create test room: {data}"

    # 2. Peer 1 connects
    async with websockets.connect(f"{WS_URL}/ws/{room_code}?nick=User1", open_timeout=5) as ws1:
        await asyncio.wait_for(ws1.recv(), timeout=5.0)  # room_status count 1

        # 3. User2 and User3 attempt to connect at the exact same moment
        async def connect_peer(name):
            try:
                async with websockets.connect(f"{WS_URL}/ws/{room_code}?nick={name}", open_timeout=5) as ws:
                    raw = await asyncio.wait_for(ws.recv(), timeout=5.0)
                    msg = json.loads(raw)
                    return (name, msg.get("type"), msg.get("code"))
            except websockets.exceptions.ConnectionClosed as cc:
                return (name, "closed", getattr(cc, "code", None))
            except Exception as e:
                return (name, "exception", str(e))

        results = await asyncio.gather(connect_peer("User2"), connect_peer("User3"))
        print("Concurrent connect results:", results)

        # One must succeed and the other must be rejected with ROOM_FULL
        codes = [r[2] for r in results]
        assert "ROOM_FULL" in codes or 4002 in codes, f"Expected ROOM_FULL or code 4002 in {codes}"
        print("Concurrency race test: PASSED (atomic 2-peer cap enforced successfully)")


if __name__ == "__main__":
    asyncio.run(test_concurrency())
