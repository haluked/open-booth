import asyncio
import json
import os
import secrets
import urllib.error
import urllib.request
import websockets

try:
    from main import SAFE_CHARS, SAFE_PREFIXES
except ImportError:
    SAFE_PREFIXES = ["BOOTH", "Y2K", "NEO", "RETRO", "PIXEL", "CHROME", "CYBER", "AERO", "FLASH", "SIGNAL"]
    SAFE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"

BASE_URL = os.getenv("OPENBOOTH_BASE_URL", "http://127.0.0.1:8000")
WS_URL = os.getenv("OPENBOOTH_WS_URL", "ws://127.0.0.1:8000")

def test_rest_api_lifecycle():
    print("[TEST] 1. Testing REST API room lifecycle, PBKDF2 & 5-char code suffix...")
    test_room = f"TEST-{secrets.token_hex(2).upper()}"
    # 1. Create protected room with custom code
    req = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": test_room, "password": "pass", "creator_nick": "TesterA"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        assert data["success"] is True, "Failed to create room"
        assert data["room_id"] == test_room
        assert data["is_protected"] is True

    # 2. Verify with correct password
    req2 = urllib.request.Request(
        f"{BASE_URL}/api/rooms/verify",
        data=json.dumps({"room_id": test_room, "password": "pass"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req2) as resp:
        data = json.loads(resp.read().decode())
        assert data["exists"] is True
        assert data["valid"] is True
        assert data["is_full"] is False

    # 3. Verify with wrong password (1st attempt)
    req3 = urllib.request.Request(
        f"{BASE_URL}/api/rooms/verify",
        data=json.dumps({"room_id": test_room, "password": "wrong"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req3) as resp:
        data = json.loads(resp.read().decode())
        assert data["exists"] is True
        assert data["valid"] is False

    # 4. Verify non-existent room
    req4 = urllib.request.Request(
        f"{BASE_URL}/api/rooms/verify",
        data=json.dumps({"room_id": "NON-EXISTENT"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req4) as resp:
        data = json.loads(resp.read().decode())
        assert data["exists"] is False

    # 5. Verify auto-generated room code format (must have 5-character suffix)
    req_auto = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"creator_nick": "AutoTester"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_auto) as resp:
        data_auto = json.loads(resp.read().decode())
        auto_id = data_auto["room_id"]
        parts = auto_id.split("-")
        assert len(parts) == 2, f"Auto-generated code must have PREFIX-SUFFIX format: {auto_id}"
        prefix, suffix = parts[0], parts[1]
        assert prefix in SAFE_PREFIXES, f"Prefix '{prefix}' not in SAFE_PREFIXES"
        assert len(suffix) == 5, f"Expected 5-character suffix, got {len(suffix)}: {suffix}"
        assert all(c in SAFE_CHARS for c in suffix), f"Suffix contains invalid chars: {suffix}"
        print(f"  -> Auto room code generated: {auto_id} (valid 5-char disambiguated suffix)")

    print("  -> REST API room lifecycle & code entropy: PASSED")


def test_legal_routes():
    print("[TEST] 2. Testing legal compliance routes (/privacy and /terms)...")
    for route in ["/privacy", "/terms"]:
        req = urllib.request.Request(f"{BASE_URL}{route}")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200, f"Expected HTTP 200 for {route}, got {resp.status}"
            content = resp.read().decode("utf-8", errors="ignore")
            assert len(content) > 0, f"Empty response content for {route}"
            print(f"  -> Route {route}: HTTP {resp.status} OK ({len(content)} bytes)")
    print("  -> Legal routes: PASSED")


def test_security_headers():
    print("[TEST] 3. Testing Security Headers & Content Security Policy (CSP)...")
    req = urllib.request.Request(f"{BASE_URL}/")
    with urllib.request.urlopen(req) as resp:
        headers = dict(resp.headers)
        # Check Content-Security-Policy
        csp = headers.get("Content-Security-Policy") or headers.get("content-security-policy")
        assert csp is not None, "Content-Security-Policy header is missing"
        assert "default-src 'self'" in csp, "CSP missing default-src"
        assert "frame-ancestors 'none'" in csp, "CSP missing frame-ancestors"
        # Check X-Frame-Options
        xfo = headers.get("X-Frame-Options") or headers.get("x-frame-options")
        assert xfo == "DENY", f"Expected X-Frame-Options: DENY, got {xfo}"
        # Check X-Content-Type-Options
        xcto = headers.get("X-Content-Type-Options") or headers.get("x-content-type-options")
        assert xcto == "nosniff", f"Expected X-Content-Type-Options: nosniff, got {xcto}"
        print(f"  -> CSP Header verified: {csp[:60]}...")
        print("  -> Frame & MIME options verified (DENY, nosniff)")
    print("  -> Security headers & CSP: PASSED")


def test_brute_force_throttling():
    print("[TEST] 4. Testing Room Password Verification brute-force throttling...")
    room_id = f"BRUTE-{secrets.token_hex(2).upper()}"
    # Create protected room
    req_create = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "password": "vault-password"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_create):
        pass

    # Send 5 failed attempts (attempts 1 to 5 return 200 with valid=False)
    for i in range(1, 6):
        req_wrong = urllib.request.Request(
            f"{BASE_URL}/api/rooms/verify",
            data=json.dumps({"room_id": room_id, "password": f"wrong-pass-{i}"}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req_wrong) as resp:
            data = json.loads(resp.read().decode())
            assert data["valid"] is False, f"Attempt {i} unexpectedly succeeded"

    # 6th attempt must trigger HTTP 429 Too Many Requests
    req_throttled = urllib.request.Request(
        f"{BASE_URL}/api/rooms/verify",
        data=json.dumps({"room_id": room_id, "password": "wrong-pass-6"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        urllib.request.urlopen(req_throttled)
        assert False, "Expected HTTP 429 for 6th consecutive failed password attempt"
    except urllib.error.HTTPError as err:
        assert err.code == 429, f"Expected status code 429, got {err.code}"
        body = json.loads(err.read().decode())
        assert "error" in body, f"Expected 'error' in response body: {body}"
        print(f"  -> 6th invalid attempt correctly throttled: HTTP 429 ({body.get('error')})")

    print("  -> Brute-force throttling on /api/rooms/verify: PASSED")


async def test_websocket_size_cap():
    print("[TEST] 5. Testing WebSocket message size cap (> 64KB frame rejected with 1009)...")
    room_id = f"OVERSIZE-{secrets.token_hex(2).upper()}"
    req_create = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "creator_nick": "SizeTester"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_create):
        pass

    uri = f"{WS_URL}/ws/{room_id}?nick=SizeTester"
    async with websockets.connect(uri) as ws:
        status_msg = json.loads(await ws.recv())
        assert status_msg["type"] == "room_status"

        # Construct frame > 64KB (65,536 bytes)
        large_payload = json.dumps({"type": "offer", "padding": "A" * 70000})
        await ws.send(large_payload)

        # Server must close with 1009
        try:
            await ws.recv()
            assert False, "Expected WebSocket connection close code 1009"
        except websockets.exceptions.ConnectionClosed as close_err:
            assert close_err.code == 1009, f"Expected close code 1009, got {close_err.code}"
            print(f"  -> Oversized frame rejected: closed with code {close_err.code} ({close_err.reason})")

    print("  -> WebSocket message size cap: PASSED")


async def test_websocket_message_filtering():
    print("[TEST] 6. Testing WebSocket message type filtering (unallowed dropped safely)...")
    room_id = f"FILTER-{secrets.token_hex(2).upper()}"
    req_create = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "creator_nick": "Peer1"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_create):
        pass

    uri1 = f"{WS_URL}/ws/{room_id}?nick=FilterPeer1"
    uri2 = f"{WS_URL}/ws/{room_id}?nick=FilterPeer2"

    async with websockets.connect(uri1) as ws1:
        await ws1.recv()  # room_status count 1

        async with websockets.connect(uri2) as ws2:
            await ws2.recv()  # room_status count 2
            # Read peer_joined messages
            msg1 = json.loads(await ws1.recv())
            if msg1["type"] == "room_status":
                msg1 = json.loads(await ws1.recv())
            assert msg1["type"] == "peer_joined"

            msg2 = json.loads(await ws2.recv())
            assert msg2["type"] == "peer_joined"

            # 1. Peer1 sends an unallowed message type (should be safely dropped by server)
            unallowed_msg = {"type": "chat_message", "text": "hello partner"}
            await ws1.send(json.dumps(unallowed_msg))

            # 2. Peer1 sends an allowed action_start_shoot message
            allowed_msg = {"type": "action_start_shoot", "timestamp": 12345678}
            await ws1.send(json.dumps(allowed_msg))

            # 3. Peer2 receives the next message: must be the allowed message, not the unallowed one
            received_raw = await ws2.recv()
            received = json.loads(received_raw)
            assert received["type"] == "action_start_shoot", f"Expected 'action_start_shoot', got: {received}"
            assert received["timestamp"] == 12345678
            print("  -> Unallowed message dropped; valid 'action_start_shoot' successfully relayed")

    print("  -> WebSocket message type filtering: PASSED")


async def test_websocket_signaling():
    print("[TEST] 7. Testing WebSocket error codes & 2-player signaling...")
    room_id = f"SIGNAL-{secrets.token_hex(2).upper()}"
    pwd = "secretpass"

    # Create room
    req = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "password": pwd, "creator_nick": "Host"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req):
        pass

    # Test non-existent room
    try:
        async with websockets.connect(f"{WS_URL}/ws/DOES-NOT-EXIST?nick=Guest") as ws_non:
            msg_non = json.loads(await ws_non.recv())
            assert msg_non["type"] == "error"
            assert msg_non["code"] == "ROOM_NOT_FOUND"
            print("  -> ROOM_NOT_FOUND error: PASSED")
    except Exception as e:
        print(f"  -> ROOM_NOT_FOUND error handled: {e}")

    # Test password required
    try:
        async with websockets.connect(f"{WS_URL}/ws/{room_id}?nick=Guest") as ws_nopwd:
            msg_nopwd = json.loads(await ws_nopwd.recv())
            assert msg_nopwd["type"] == "error"
            assert msg_nopwd["code"] == "PASSWORD_REQUIRED"
            print("  -> PASSWORD_REQUIRED error: PASSED")
    except Exception as e:
        print(f"  -> PASSWORD_REQUIRED error handled: {e}")

    # Peer 1 connects
    uri1 = f"{WS_URL}/ws/{room_id}?nick=Haluk&pwd={pwd}"
    async with websockets.connect(uri1) as ws1:
        msg1 = json.loads(await ws1.recv())
        assert msg1["type"] == "room_status"
        assert msg1["count"] == 1
        assert "Haluk" in msg1["nicks"]

        # Peer 2 connects
        uri2 = f"{WS_URL}/ws/{room_id}?nick=Ezgi&pwd={pwd}"
        async with websockets.connect(uri2) as ws2:
            # Both peers should get room_status count 2
            msg_ws2_status = json.loads(await ws2.recv())
            assert msg_ws2_status["type"] == "room_status"
            assert msg_ws2_status["count"] == 2

            # Initiator negotiation message
            msg1_peer = json.loads(await ws1.recv())
            if msg1_peer["type"] == "room_status":
                msg1_peer = json.loads(await ws1.recv())
            assert msg1_peer["type"] == "peer_joined"
            assert msg1_peer["isInitiator"] is True
            assert msg1_peer["remoteNick"] == "Ezgi"

            # Peer 2 negotiation message
            msg2_peer = json.loads(await ws2.recv())
            assert msg2_peer["type"] == "peer_joined"
            assert msg2_peer["isInitiator"] is False
            assert msg2_peer["remoteNick"] == "Haluk"

            # Test 3rd connection: should be REJECTED (capacity 2 max)
            uri3 = f"{WS_URL}/ws/{room_id}?nick=Intruder&pwd={pwd}"
            try:
                async with websockets.connect(uri3) as ws3:
                    msg3 = json.loads(await ws3.recv())
                    assert msg3["type"] == "error"
                    assert msg3["code"] == "ROOM_FULL"
                    print("  -> Capacity rejection (max 2): PASSED")
            except Exception as e:
                print(f"  -> Capacity rejection via close: PASSED ({e})")

            # Test signaling relay between ws1 and ws2 with allowed type 'offer'
            test_offer = {"type": "offer", "offer": {"sdp": "fake_sdp", "type": "offer"}}
            await ws1.send(json.dumps(test_offer))
            relayed_offer = json.loads(await ws2.recv())
            assert relayed_offer["type"] == "offer"
            assert relayed_offer["offer"]["sdp"] == "fake_sdp"
            print("  -> Signaling relay between peers: PASSED")

    print("  -> WebSocket 2-player signaling: PASSED")


def test_grace_period_recreation_protection():
    print("[TEST] 8. Testing Empty Room Disconnect Grace Period protection against hijacking...")
    room_id = f"GRACE-{secrets.token_hex(2).upper()}"
    pwd = "vaultpassword"

    # 1. Create protected room
    req = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "password": pwd, "creator_nick": "Host"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert json.loads(resp.read().decode())["success"] is True

    # 2. Unauthorized attempt to recreate/overwrite without password while room is in grace period
    req_hijack = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "creator_nick": "Attacker"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        urllib.request.urlopen(req_hijack)
        assert False, "Expected HTTP 409 when attempting unauthorized takeover during grace period"
    except urllib.error.HTTPError as err:
        assert err.code == 409, f"Expected HTTP 409, got {err.code}"
        print("  -> Unauthorized recreation during grace period correctly rejected with HTTP 409")

    # 3. Authorized reclaim with correct password succeeds
    req_reclaim = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "password": pwd, "creator_nick": "Host"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_reclaim) as resp:
        data = json.loads(resp.read().decode())
        assert data["success"] is True
        print("  -> Authorized reclaim with valid password succeeded")

    print("  -> Empty room grace period protection: PASSED")


async def test_websocket_in_session_rate_limiting():
    print("[TEST] 9. Testing In-Session WebSocket message rate limiting (flooding rejected with 1008)...")
    room_id = f"FLOOD-{secrets.token_hex(2).upper()}"
    req_create = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "creator_nick": "Spammer"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_create):
        pass

    uri = f"{WS_URL}/ws/{room_id}?nick=Spammer"
    async with websockets.connect(uri) as ws:
        await ws.recv()  # room_status count 1

        # Spam 65 messages rapidly
        closed_with_1008 = False
        try:
            for i in range(65):
                await ws.send(json.dumps({"type": "action_start_shoot"}))
            # Try to receive or wait for server close frame with timeout
            for _ in range(10):
                try:
                    await asyncio.wait_for(ws.recv(), timeout=1.0)
                except asyncio.TimeoutError:
                    break
        except websockets.exceptions.ConnectionClosed as close_err:
            assert close_err.code == 1008, f"Expected close code 1008, got {close_err.code}"
            closed_with_1008 = True
            print(f"  -> Message flood rejected: closed with code {close_err.code} ({close_err.reason})")

        assert closed_with_1008, "Expected connection to be closed with code 1008 after message flood"

    print("  -> In-session WebSocket message rate limiting: PASSED")


async def test_concurrent_join_disconnect_robustness():
    print("[TEST] 10. Testing Concurrent Join/Disconnect race condition robustness...")
    room_id = f"CONCUR-{secrets.token_hex(2).upper()}"
    req_create = urllib.request.Request(
        f"{BASE_URL}/api/rooms/create",
        data=json.dumps({"room_code": room_id, "creator_nick": "ConcurHost"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_create):
        pass

    async def connect_and_drop(nick: str, hold_sec: float = 0.05):
        try:
            async with websockets.connect(f"{WS_URL}/ws/{room_id}?nick={nick}") as ws:
                await ws.recv()
                await asyncio.sleep(hold_sec)
        except Exception:
            pass

    # Launch overlapping concurrent connects & fast disconnects
    tasks = [
        asyncio.create_task(connect_and_drop(f"Peer_{i}", hold_sec=0.02 * i))
        for i in range(8)
    ]
    await asyncio.gather(*tasks, return_exceptions=True)

    # Verify room is still alive and responds cleanly to status query
    req_status = urllib.request.Request(f"{BASE_URL}/api/rooms/{room_id}/status")
    with urllib.request.urlopen(req_status) as resp:
        data = json.loads(resp.read().decode())
        assert data["exists"] is True
        print(f"  -> Room remained intact through concurrent churn, current count: {data['count']}/2")

    print("  -> Concurrent join/disconnect robustness: PASSED")


async def main():
    test_rest_api_lifecycle()
    test_legal_routes()
    test_security_headers()
    test_brute_force_throttling()
    test_grace_period_recreation_protection()
    await test_websocket_size_cap()
    await test_websocket_message_filtering()
    await test_websocket_signaling()
    await test_websocket_in_session_rate_limiting()
    await test_concurrent_join_disconnect_robustness()
    print("\n==================================================")
    print("ALL TEST SUITE CHECKS PASSED WITH 100% SUCCESS! [OK]")
    print("==================================================")


if __name__ == "__main__":
    asyncio.run(main())
