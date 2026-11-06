---
name: OpenBooth
description: Synchronized 2-player P2P WebRTC virtual photobooth with nostalgic 4-strip keepsake export
colors:
  primary: "#38bdf8"
  primary-glow: "rgba(56, 189, 248, 0.4)"
  neutral-bg: "#030712"
  neutral-surface: "rgba(15, 23, 42, 0.85)"
  neutral-header: "rgba(2, 6, 23, 0.98)"
  neutral-border: "rgba(255, 255, 255, 0.15)"
  neutral-border-highlight: "rgba(255, 255, 255, 0.25)"
  text-primary: "#f1f5f9"
  text-muted: "#94a3b8"
  accent-coral: "#e05a47"
  status-success: "#10b981"
typography:
  display:
    fontFamily: "Fragile Bombers, Impact, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Fragile Bombers, Impact, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.05em"
  title:
    fontFamily: "Granix, Trebuchet MS, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.15em"
  body:
    fontFamily: "Granix, Trebuchet MS, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Sunny Brunch, BlueScreen, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.xl}"
    padding: "16px 40px"
  button-primary-hover:
    backgroundColor: "{colors.text-primary}"
  button-chrome:
    backgroundColor: "#e2e8f0"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.xl}"
    padding: "16px 40px"
  card-glass:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  input-hud:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: OpenBooth

## Overview

**Creative North Star: "The Orbiting Cyber-Chamber"**

OpenBooth merges the intimacy of classic mechanical photobooths with early-2000s cyber-futurism, Frutiger Aero glassmorphism, and raytraced sci-fi telemetry. Users do not simply capture a webcam photo; they enter an orbiting observation bay modeled after vintage cinematic science fiction (anchored by *The Humanoid* 1979 aesthetic archive).

The interface is dark, tactile, and specular. Deep obsidian backgrounds are overlaid with frosted aero-glass panels (`backdrop-filter: blur(16px)`), liquid chrome button gradients with top-edge specular highlights, and high-frequency monospace telemetry readouts. The balance prioritizes immediate tactile clarity: mission-critical actions (Join Room, Shutter Capture, Download Keepsake) feature unmistakable mechanical presence, while WebRTC telemetry and ambient controls remain restrained.

**Key Characteristics:**
- **Layered Aero Depth:** Deep void backgrounds with translucent frosted glass slabs, hairline borders, and cyan back-glows.
- **Specular Liquid Chrome:** Multi-stop vertical metallic gradients imitating physical brushed aluminum and mercury reflections.
- **Dual-Era Typographic Tension:** Ultra-expressive Y2K cyber display typography (`Alucrads`) anchored by structural high-tech geometric sans (`Granix`) and clinical monospace HUD labels.
- **Physical Souvenir Output:** Digital live feeds culminate in an authentic 4-cut physical collector photostrip with simulated photographic grain, borders, and synchronized session metadata.

## Colors

The OpenBooth palette balances deep cosmic darks with high-reflectance chrome metallics and laser-focused cyan telemetry accents.

### Primary
- **Electric Cyan** (`#38bdf8` / `oklch(78% 0.16 215)`): The operational pulse of the system. Used strictly for active camera indicators, sync status, laser accents, and interactive highlights.

### Neutral
- **Cosmic Obsidian Void** (`#030712`): The deepest canvas background, simulating outer-space void and CRT deep blacks.
- **Aero Glass Midnight** (`rgba(15, 23, 42, 0.75)` / `#0f172a`): Translucent structural surface color for cards and cockpit containers.
- **Obsidian Header Surface** (`rgba(2, 6, 23, 0.98)`): High-opacity anchor for navigation headers, ensuring 100% legibility above dynamic ambient posters.
- **Liquid Chrome / Ice White** (`#ffffff` / `#f1f5f9`): High-specular reflection points, hero titles, and chrome button crests.
- **HUD Slated Silver** (`#94a3b8` / `#64748b`): Calibrated secondary labels, placeholder text, and passive telemetry data.

### Secondary & Accents
- **Solar Flare Coral** (`#e05a47`): Warning states, disconnect triggers, and retro space-age accent themes.
- **Matrix Emerald** (`#10b981`): Peer-to-peer WebRTC connection confirmation and ICE connected states.

### Named Rules
**The Rare Glow Rule.** Laser cyan glow (`0 0 15px rgba(56, 189, 248, 0.4)`) is reserved exclusively for interactive elements in active states or live hardware feeds. It must never coat static decorative elements.

**The Pure Void Rule.** Primary surfaces must never use washed-out grays; they descend into true obsidian black (`#030712`) to allow high-specular glass highlights to achieve maximum optical contrast.

## Typography

OpenBooth pairs custom cyber-futuristic typography with high-tech geometric sans and clinical monospace telemetry.

**Display & Headline Font:** `Fragile Bombers` (custom OTF, fallback: `Impact`, sans-serif)  
**Interface & Headings Font:** `Granix` (custom OTF, fallback: `Trebuchet MS`, sans-serif)  
**HUD / Telemetry & Label Font:** `Sunny Brunch` (custom TTF, fallback: `BlueScreen`, `ui-monospace`, `monospace`)

**Character:** Wide, razor-sharp Y2K techno-futuristic geometric display personality by Raymond Larabie paired with playful, retro-chic `Sunny Brunch` labels and high-tech `Granix` controls.

### Hierarchy
- **Display** (700, `clamp(2rem, 5vw, 3.6rem)`, line-height: 1.05, letter-spacing: `0.04em`): Hero application title (`OPEN//BOOTH`) and dramatic countdown numerals.
- **Headline** (700, `1.5rem`, line-height: 1.2, letter-spacing: `0.05em`): Major section titles, photostrip titles, and modal headers.
- **Title** (700, `1rem`, line-height: 1.2, letter-spacing: `0.15em`, uppercase): Action button labels, viewport badges, and protocol headings.
- **Body** (400, `0.875rem`, line-height: 1.5): Explanatory descriptions, instructions, and user guidance.
- **Label / Telemetry** (500, `0.75rem`, line-height: 1.4, letter-spacing: `0.06em`, uppercase): Status indicators, timestamps, WebRTC room codes, and telemetry tags rendered in `Sunny Brunch`.

### Named Rules
**The Dual-Era Type Rule.** Display and headline titles belong to `Fragile Bombers`; interactive controls and protocol headers belong to `Granix`; data readouts and telemetry labels belong to `Sunny Brunch`. Never interchange these roles.

## Layout

OpenBooth utilizes a responsive 1500px wide grid structured as a two-column observation deck:

- **Exhibition & Theme Showcase (5/12 columns on desktop):** Houses the active retro poster archive, 5-theme capsule switcher, and protocol instructions.
- **Dual Observation Cockpit (7/12 columns on desktop):** Houses the simultaneous dual WebRTC video viewports (`Feed 01 // You` and `Feed 02 // Partner`), sequential countdown overlay, and the master shutter trigger bar.
- **Keepsake Preview Drawer:** Slides into view upon 4-cut capture completion, providing real-time canvas preview and 1-click PNG download.
- **Floating Telemetry Dock:** Pinned to bottom-right (`fixed bottom-4 right-4 z-50`), expandable on demand to prevent UI clutter while maintaining deep diagnostic transparency.

On mobile devices (`< 1024px`), the columns stack vertically with observation feeds retaining primary viewport focus.

## Elevation & Depth

Depth is achieved through physical material simulation: layered frosted glass slabs with specular highlights rather than diffuse muddy drop-shadows.

### Shadow Vocabulary
- **Cockpit Elevation** (`box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8)`): Grounding shadow for observation glass containers.
- **Aero Glass Inset Highlight** (`box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)`): Crisp top-edge light reflection simulating polished glass thickness.
- **Chrome Button Bevel** (`box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 0 15px rgba(56, 189, 248, 0.3)`): Multi-layer specular rim lighting and ambient cyan back-glow.
- **Laser Dot Pulse** (`box-shadow: 0 0 8px #38bdf8`): Active feed and sync status illumination.

### Named Rules
**The Specular Edge Rule.** Every glass or metallic container must carry an inset 1px specular top border (`rgba(255, 255, 255, 0.2)`) to catch overhead lighting and separate from the dark void.

## Shapes

- **Outer Shells & Cards:** 24px radius (`rounded-3xl` / `rounded-2xl`) with 1px translucent borders (`border border-white/20`).
- **Interactive Controls:** 16px radius (`rounded-2xl` / `rounded-xl`) for tactile comfort.
- **Telemetry Indicators & Badges:** Full capsule pills (`rounded-full`) or sharp 4px badges (`rounded`) for monospace telemetry.
- **Hairline Liquid Borders:** 1px gradient strokes (`linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(56, 189, 248, 0.3) 30%, ...)`).

## Components

### Buttons
- **Shape:** 16px radius (`rounded-2xl`)
- **Primary Shutter Action:** Liquid chrome multi-stop gradient (`linear-gradient(180deg, #E2E8F0 0%, #94A3B8 45%, #475569 50%, #64748B 80%, #CBD5E1 100%)`), dark text (`#030712`), uppercase `font-granix`, 16px vertical padding.
- **Hover / Active:** Top white specular intensification (`transform: scale(1.03)` on hover, `scale(0.97)` on active).
- **Secondary HUD Triggers:** Translucent obsidian (`bg-white/5 border border-white/20 hover:bg-cyan-300 hover:text-black transition-colors`).

### Cards & Observation Containers
- **Corner Style:** `rounded-3xl` (24px)
- **Background:** `linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(6, 11, 25, 0.85) 100%)`
- **Backdrop Filter:** `blur(16px)`
- **Border:** 1px hairline `rgba(255, 255, 255, 0.15)`
- **Internal Padding:** 24px (`p-6`)

### Inputs & HUD Fields
- **Style:** Monospace uppercase, `bg-white/5`, 1px border `rgba(255, 255, 255, 0.2)`, `rounded-lg` (8px).
- **Focus:** Outline removed, border shifts to `#38bdf8` with subtle cyan glow.

### Video Observation Viewports
- **Aspect Ratio:** 4:3 fixed studio ratio, black letterboxed foundation with `inset 0 0 20px rgba(0,0,0,0.9)` inner shadow.
- **Badges:** Floated frosted capsule badge with active status LED (`FEED 01 // YOU`).
- **Offline Fallback:** Technical wireframe SVG icon with monospace recovery directive.

### Signature Keepsake: 4-Cut Photostrip Canvas
- **Format:** 600 × 1860 px vertical high-resolution collector keepsake.
- **Elements:** Custom `Alucrads` header insignia, 4 sequentially captured frames with simulated photo borders, authentic barcode telemetry, and synchronized session timestamp.

## Do's and Don'ts

### Do:
- **Do** preserve the tactile specular highlights on interactive buttons (`inset 0 1px 2px rgba(255, 255, 255, 0.8)`).
- **Do** use `Alucrads` exclusively for hero branding, photo souvenir titles, and large countdown digits.
- **Do** maintain the 4:3 aspect ratio on dual video viewports to guarantee synchronized photostrip frame parity.
- **Do** keep WebRTC signaling strictly client-side and ephemeral, storing zero user media on servers.

### Don't:
- **Don't** apply saturated color gradients to large body text or paragraphs; reserve gradients for display typography and metallic buttons.
- **Don't** use diffuse muddy shadows (`rgba(0,0,0,0.2)`); use deep obsidian grounding (`rgba(0,0,0,0.8)`) paired with inset highlights.
- **Don't** replace custom display fonts with generic sans-serif fallbacks when modifying component markup.
- **Don't** clutter the primary viewport with persistent debug logs; confine telemetry to the collapsible floating dock.
