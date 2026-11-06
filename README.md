# OpenBooth

OpenBooth is a synchronized virtual photobooth for two people. It lets you and a friend connect your webcams, take 4 photos together at the same time, and download a classic retro photostrip.

## How It Works

1. One person creates a room code and shares it.
2. The other person joins the room with the code.
3. You both see each other on live video.
4. When either person clicks the shutter button, a 3-2-1 countdown starts on both screens.
5. Four photos are taken in a row and placed into a photo strip.
6. You can choose different layouts, apply color themes, and download the image to your computer.

All photos are created directly in your browser. No photos or video recordings are saved on the server.

## Features

- Synchronized Capture: When one person presses the button, the countdown and photo shots trigger at the same time on both screens.
- Two-Player Video: Low-latency peer-to-peer video connection between you and your friend.
- Solo Mode: You can also use the photobooth alone.
- Photo Strips: Classic 4-cut photostrip with Split and Dual layout options.
- Color Themes: Multiple color filters including Cyber, Black and White, Sepia, and Neon.
- Privacy First: Photos are processed in your browser memory and never uploaded to any server.
- Room Passwords: You can set a password on your room so only invited people can join.

## Requirements

- Python 3.10 or higher
- A modern web browser with camera support (Google Chrome, Firefox, Edge, or Safari)

## How to Run

### 1. Install Dependencies

Open a terminal in the project folder and run:

```bash
# Optional: create and activate a virtual environment
python -m venv backend/venv

# On Windows:
backend\venv\Scripts\activate

# On Linux or macOS:
source backend/venv/bin/activate

# Install required packages
pip install -r backend/requirements.txt
```

### 2. Start the App

On Windows:
Double-click `start_openbooth.bat` or run:
```cmd
start_openbooth.bat
```

On Linux or macOS:
```bash
chmod +x start_openbooth.sh
./start_openbooth.sh
```

Or run directly with Python:
```bash
python backend/main.py
```

Then open your browser and go to:
http://localhost:8000

## How to Play with a Friend (Over the Internet)

Webcams require a secure connection (HTTPS) when not running on localhost. To play with someone in another location, you can share a public HTTPS link:

### Option A: Using the Built-in Tunnel Helper
If you have a free ngrok account:
```bash
python tunnel_launcher.py
```
This starts the server and gives you a link to send to your friend.

### Option B: Using Cloudflare Tunnel
If you have `cloudflared` installed:
```bash
cloudflared tunnel --url http://localhost:8000
```
Send the generated `trycloudflare.com` link to your friend.

## Testing

To run the automated tests:

1. Start the server in one terminal:
   ```bash
   python backend/main.py
   ```
2. Run the test suite in another terminal:
   ```bash
   python backend/test_suite.py
   ```
3. Run the concurrency test:
   ```bash
   python backend/test_concurrency.py
   ```

## Project Structure

- `frontend/`: The web interface, styles, fonts, and photostrip generator.
- `backend/`: FastAPI server for signaling room connections.
- `tunnel_launcher.py`: Helper script to create an online tunnel.
- `start_openbooth.bat`: Windows launcher script.
- `start_openbooth.sh`: Linux and macOS launcher script.

## License

This project is open source and available under the MIT License. See the LICENSE file for details.
