# DEVELOPMENT PLAN

This document outlines the step-by-step implementation for the Open-Booth project.

## Phase 1: Project Setup and Backend Signaling
- Initialize Git repository and project structure (`/frontend`, `/backend`).
- Setup a basic FastAPI application.
- Implement WebSocket endpoints for WebRTC signaling (offer, answer, ICE candidates, room joining).
- Create a minimal HTML page to connect to the WebSocket and verify basic two-way message passing.

## Phase 2: Frontend WebRTC Foundation
- Integrate Tailwind CSS via CDN for rapid prototyping.
- Implement the user interface for room creation/joining.
- Request camera permissions using `navigator.mediaDevices.getUserMedia`.
- Establish the WebRTC RTCPeerConnection lifecycle:
  - Caller creates Offer -> Server -> Callee.
  - Callee creates Answer -> Server -> Caller.
  - Exchange ICE Candidates.
- Render local and remote video streams on the page.

## Phase 3: Synchronization and Actions
- Implement a synchronized "Take Photo" action.
- When one user clicks the button, a WebSocket message is broadcast to both clients.
- Initiate a visual 3-2-1 countdown on both clients simultaneously.

## Phase 4: Canvas Composition (The Photostrip)
- At countdown 0, both clients capture a frame from the local stream and remote stream via HTML `<canvas>`.
- Repeat this process 4 times with short intervals.
- Merge the captured frames into a vertical 4-strip layout.
- Provide a "Download PNG" button for the generated photostrip.

## Phase 5: Debugger Tools & Refinement
- Add an on-screen debug panel to view:
  - WebSocket connection status.
  - WebRTC connection state (`checking`, `connected`, `failed`).
  - Ping/Latency metrics (if possible).
- This ensures any connectivity issues during early testing are transparent.

## Phase 6: Testing & Remote Deployment
- Expose the local backend using `ngrok` or similar tunnel tools.
- Host the frontend on a free static provider (e.g., Vercel, GitHub Pages).
- Share the links with the remote user for a real-world test.

## Sub-agent Delegation Strategy
- The Pro agent manages the overall state, WebRTC setup, and signaling logic.
- Flash subagents can be spawned to build the HTML structure, basic Tailwind classes, and placeholder UI components to save time and tokens.
