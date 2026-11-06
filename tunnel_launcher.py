"""
OpenBooth Private Tunnel Helper
Starts a secure, ephemeral ngrok tunnel to port 8000.
"""

import atexit
import os
import subprocess
import sys
import time

from pyngrok import ngrok

PORT = 8000
# Ensure we run from the project root regardless of cwd
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

_server_proc = None


def cleanup():
    """Terminate the background server process on exit."""
    global _server_proc
    if _server_proc and _server_proc.poll() is None:
        print("\n[CLEANUP] Shutting down background OpenBooth server...")
        _server_proc.terminate()
        try:
            _server_proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            _server_proc.kill()


def wait_for_server(port, timeout=15):
    """Poll until the server is responsive, or timeout."""
    import urllib.request
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/robots.txt", timeout=2) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            pass
        time.sleep(1)
    return False


def main():
    global _server_proc
    atexit.register(cleanup)

    print("=" * 60)
    print("      OPEN // BOOTH - PRIVATE TUNNEL HELPER")
    print("=" * 60)
    print()
    print(f"[1] Checking local server on port {PORT}...")

    # Use the venv Python if available
    venv_python = os.path.join(PROJECT_ROOT, "backend", "venv", "Scripts", "python.exe")
    python_exe = venv_python if os.path.exists(venv_python) else sys.executable
    server_script = os.path.join(PROJECT_ROOT, "backend", "main.py")

    if not wait_for_server(PORT, timeout=2):
        print("    Server not responding. Starting OpenBooth server in background...")
        _server_proc = subprocess.Popen(
            [python_exe, server_script],
            cwd=PROJECT_ROOT
        )
        print("    Waiting for server to start...")
        if not wait_for_server(PORT, timeout=15):
            print("    [WARNING] Server did not respond within 15 seconds.")
            print("    The tunnel will attempt to connect anyway.")
        else:
            print("    Local OpenBooth server is ONLINE and responsive.")
    else:
        print("    Local OpenBooth server is ONLINE and responsive.")

    print()
    print("[2] Opening secure ngrok tunnel...")
    try:
        tunnel = ngrok.connect(PORT, "http")
        public_url = tunnel.public_url

        print()
        print("=" * 60)
        print(" [SUCCESS] YOUR PRIVATE PHOTOBOOTH IS LIVE!")
        print("=" * 60)
        print()
        print(f" -> Share this link with your partner:")
        print(f"    {public_url}")
        print()
        print(" Instructions:")
        print("  * You or your partner can create a private chamber.")
        print("  * You can set a password for the room if desired.")
        print("  * When finished, press Ctrl+C in this terminal to shut down.")
        print("=" * 60)
        print()

        ngrok_process = ngrok.get_ngrok_process()
        ngrok_process.proc.wait()

    except KeyboardInterrupt:
        print("\n[INFO] Shutting down tunnel...")
        ngrok.kill()
    except Exception as e:
        print()
        print("=" * 60)
        print(" [SETUP REQUIRED] NGROK AUTHTOKEN")
        print("=" * 60)
        print(" Ngrok reported:", str(e))
        print()
        print(" If you haven't added your free authtoken yet, run:")
        print("   ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>")
        print()
        print(" Get your free token at: https://dashboard.ngrok.com/get-started/your-authtoken")
        print("=" * 60)


if __name__ == "__main__":
    main()
