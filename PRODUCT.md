# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

HTML5, Tailwind CSS, Vanilla JS (Frontend), Python FastAPI + WebSockets (Backend)

## Users

Long-distance couples and remote friends who want to create shared memories in real-time.

## Product Purpose

A synchronized 2-player virtual photobooth. It enables users in different locations to join a shared room, see each other via video, and take photos together simultaneously. The end result is a downloadable, classic 4-strip retro photobooth image. Success means a seamless, perfectly synchronized real-time experience that makes distance feel smaller.

## Positioning

True synchronization over P2P WebRTC. When one user presses "Take Photo", the 3-2-1 countdown and the exact moment of capture are synchronized across both clients, unlike generic screenshot tools or async photo apps.

## Operating Context

Users are likely in their respective homes, at their computers or laptops with webcams, chatting either through the app's video feed or alongside a voice call. The workflow involves creating a room code, sharing it out-of-band (e.g., via a messaging app), joining the room, framing themselves, and pressing a single capture button.

## Capabilities and Constraints

- Requires browser webcam access (getUserMedia).
- Real-time video streaming requires P2P WebRTC.
- Server is strictly for WebRTC signaling (FastAPI WebSockets); no video or image data is stored on the server.
- The photo composition runs client-side using the HTML `<canvas>` API.
- Must operate effectively in a local development environment (localhost) as well as over ngrok/Vercel for remote testing.

## Brand Commitments

- **Name:** OpenBooth
- **Vibe:** Playful, retro, and engaging.

## Evidence on Hand

None. The project is in the initial Alpha/Beta 1 phase (local testing). Future phases will test with actual remote users via ngrok.

## Product Principles

1. **Synchronicity First:** The magic of the photobooth relies on the exact moment of shared capture. Delay or desync breaks the illusion.
2. **Zero Storage, High Privacy:** All video is P2P; all image processing happens on the client's device. The server never sees the photos.
3. **Frictionless Entry:** Joining a room must be as simple as entering a short code. No logins, no complex setups.
4. **Delightful Output:** The final photostrip must feel like a tangible, retro keepsake, not just a raw webcam screenshot.
