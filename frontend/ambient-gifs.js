/**
 * OpenBooth Ambient GIF Engine
 * 
 * Upgraded Features:
 * - 18 sample GIFs (assets/sample1.gif .. assets/sample18.gif)
 * - Frame 0 playback guarantee on every spawn via unique cache-busting
 * - Up to 7 GIFs concurrent on screen
 * - Variable random initial size (between min and max width)
 * - Dynamic breathing scale: smoothly gets bigger or smaller by a random factor (-10% to +10%)
 * - Relaxed 10% overlap allowance with other GIFs and UI objects
 * - Ultra-smooth 2.2s fade transitions
 * - Lifespan: random 10s to 17s
 * - Spawn rate: every random 1.5s to 3.2s
 * - Liveness watchdog: always at least 1 active GIF playing
 */

(function () {
  'use strict';

  const CONFIG = {
    totalSamples: 36, // All 36 sample GIFs (sample1.gif to sample36.gif)
    maxConcurrent: 7,
    minLifespanMs: 10000,
    maxLifespanMs: 17000,
    minSpawnIntervalMs: 1500,
    maxSpawnIntervalMs: 3200,
    fadeDurationMs: 2200, // Extra smooth slow fade in & out
    minWidth: 150,        // Variable random size bounds
    maxWidth: 270,
    aspectRatio: 4 / 3,   // Standard camera sample aspect ratio
    margin: 12,           // Edge padding from viewport borders
    maxOverlapRatio: 0.10, // Up to 10% overlap allowed with GIFs & UI container
    minSpeedPxSec: 4,     // Subtle organic drift speed (pixels per second)
    maxSpeedPxSec: 16     // Capped max drift speed to keep motion smooth and ambient
  };

  let activeGifs = [];
  let spawnTimer = null;
  let layerElement = null;
  let mainContainer = null;
  let recentSamples = []; // Avoid picking the exact same sample back-to-back
  let spawnCounter = 0; // Instance pooling for image cache reuse

  /** Initialize the engine */
  function initAmbientGifs() {
    layerElement = document.getElementById('ambientGifLayer');
    if (!layerElement) {
      layerElement = document.createElement('div');
      layerElement.id = 'ambientGifLayer';
      layerElement.className = 'fixed inset-0 z-0 overflow-hidden pointer-events-none select-none';
      document.body.prepend(layerElement);
    }

    mainContainer = document.getElementById('mainAppContainer') || document.querySelector('.max-w-5xl');

    // Spawn first GIF immediately so background is never empty on load
    spawnGif();

    // Start recurring spawn scheduler
    scheduleNextSpawn();

    // Window resize handler to prune any out-of-bound items
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 200);
    }, { passive: true });
  }

  /** Schedules the next spawn interval */
  function scheduleNextSpawn() {
    if (spawnTimer) clearTimeout(spawnTimer);
    const interval = Math.floor(Math.random() * (CONFIG.maxSpawnIntervalMs - CONFIG.minSpawnIntervalMs)) + CONFIG.minSpawnIntervalMs;
    spawnTimer = setTimeout(() => {
      spawnGif();
      scheduleNextSpawn();
    }, interval);
  }

  /** Pick a random sample between 1 and 18, avoiding recent repeats */
  function pickRandomSample() {
    const available = [];
    for (let i = 1; i <= CONFIG.totalSamples; i++) {
      if (!recentSamples.includes(i)) available.push(i);
    }
    const sample = available[Math.floor(Math.random() * available.length)] || Math.floor(Math.random() * CONFIG.totalSamples) + 1;
    recentSamples.push(sample);
    if (recentSamples.length > 12) recentSamples.shift();
    return sample;
  }

  /** Calculate intersection ratio between two bounding boxes */
  function getIntersectionRatio(boxA, boxB) {
    const interW = Math.max(0, Math.min(boxA.x + boxA.width, boxB.x + boxB.width) - Math.max(boxA.x, boxB.x));
    const interH = Math.max(0, Math.min(boxA.y + boxA.height, boxB.y + boxB.height) - Math.max(boxA.y, boxB.y));
    const interArea = interW * interH;
    if (interArea <= 0) return 0;
    const areaA = boxA.width * boxA.height;
    const areaB = boxB.width * boxB.height;
    return Math.max(interArea / areaA, interArea / areaB);
  }

  /** Validates candidate placement adhering to max 10% overlap rule */
  function isValidPlacement(candidate) {
    // 1. Check overlap with central UI container (camera, buttons, header)
    if (mainContainer) {
      if (!isValidPlacement._cachedRect || isValidPlacement._cacheTime < Date.now() - 500) {
        isValidPlacement._cachedRect = mainContainer.getBoundingClientRect();
        isValidPlacement._cacheTime = Date.now();
      }
      const r = isValidPlacement._cachedRect;
      const interW = Math.max(0, Math.min(candidate.x + candidate.width, r.right) - Math.max(candidate.x, r.left));
      const interH = Math.max(0, Math.min(candidate.y + candidate.height, r.bottom) - Math.max(candidate.y, r.top));
      const interArea = interW * interH;
      const candidateArea = candidate.width * candidate.height;
      if (candidateArea > 0 && (interArea / candidateArea) > CONFIG.maxOverlapRatio) {
        return false;
      }
    }

    // 2. Check overlap with all currently active GIFs (max 10% mutual overlap)
    for (const active of activeGifs) {
      if (getIntersectionRatio(candidate, active.rect) > CONFIG.maxOverlapRatio) {
        return false;
      }
    }

    return true;
  }

  /** Find placement across background with 10% overlap freedom */
  function findSafePosition(width, height) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = CONFIG.margin;

    const maxX = Math.max(margin, vw - width - margin);
    const maxY = Math.max(margin, vh - height - margin);

    if (maxX <= margin && maxY <= margin) return null;

    let mainLeft = vw * 0.15;
    let mainRight = vw * 0.85;
    if (mainContainer) {
      if (!findSafePosition._cachedRect || findSafePosition._cacheTime < Date.now() - 500) {
        findSafePosition._cachedRect = mainContainer.getBoundingClientRect();
        findSafePosition._cacheTime = Date.now();
      }
      const r = findSafePosition._cachedRect;
      mainLeft = r.left;
      mainRight = r.right;
    }

    const MAX_ATTEMPTS = 65;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      let candX;

      // Natural broad distribution:
      // ~45% left flank, ~45% right flank, ~10% top/bottom across screen
      const r = Math.random();
      if (r < 0.45) {
        const leftLimit = Math.min(maxX, mainLeft + width * 0.10);
        candX = margin + Math.random() * Math.max(0, leftLimit - margin);
      } else if (r < 0.90) {
        const rightStart = Math.max(margin, mainRight - width * 0.10);
        candX = rightStart + Math.random() * Math.max(0, maxX - rightStart);
      } else {
        candX = margin + Math.random() * (maxX - margin);
      }

      const candY = margin + Math.random() * (maxY - margin);

      const candidate = {
        x: Math.round(candX),
        y: Math.round(candY),
        width: Math.round(width),
        height: Math.round(height)
      };

      if (isValidPlacement(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  /** Spawns a single animated GIF with variable size and dynamic scale drift */
  function spawnGif() {
    if (activeGifs.length >= CONFIG.maxConcurrent) {
      return;
    }

    // Variable Random Initial Size
    const vw = window.innerWidth;
    const minW = Math.max(130, Math.min(CONFIG.minWidth, Math.floor(vw * 0.16)));
    const maxW = Math.max(minW + 30, Math.min(CONFIG.maxWidth, Math.floor(vw * 0.25)));
    const gifWidth = Math.round(minW + Math.random() * (maxW - minW));
    const gifHeight = Math.round(gifWidth / CONFIG.aspectRatio);

    const position = findSafePosition(gifWidth, gifHeight);
    if (!position) {
      return; // No suitable spot found right now
    }

    // Random lifespan (10s to 17s)
    const lifespan = Math.floor(Math.random() * (CONFIG.maxLifespanMs - CONFIG.minLifespanMs)) + CONFIG.minLifespanMs;

    // Smoothly get bigger or smaller by a random value between -25% and +25%
    const scaleDelta = (Math.random() * 0.50) - 0.25; // [-0.25, +0.25]
    const targetScale = +(1.0 + scaleDelta).toFixed(3);

    // Pick a random direction angle (0 to 360 deg) and randomized speed (capped max)
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * (CONFIG.maxSpeedPxSec - CONFIG.minSpeedPxSec) + CONFIG.minSpeedPxSec;
    const totalDist = (lifespan / 1000) * speed;
    const driftX = Math.round(Math.cos(angle) * totalDist);
    const driftY = Math.round(Math.sin(angle) * totalDist);

    const sampleNum = pickRandomSample();
    // Reusable instance nonces prevent unbounded image memory allocation
    const instanceId = (spawnCounter++ % 16);
    const frameZeroUrl = `assets/sample${sampleNum}.gif?inst=${instanceId}`;

    // Create container card with transparent feathered gradient margins
    const card = document.createElement('div');
    card.className = 'ambient-gif-card';
    card.style.cssText = `
      position: absolute;
      left: ${position.x}px;
      top: ${position.y}px;
      width: ${position.width}px;
      height: ${position.height}px;
      opacity: 0;
      transform: translate3d(0, 0, 0) scale(1);
      transition: opacity ${CONFIG.fadeDurationMs}ms cubic-bezier(0.25, 1, 0.5, 1), transform ${lifespan}ms cubic-bezier(0.25, 0.1, 0.25, 1);
      border-radius: 16px;
      overflow: hidden;
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 56%, rgba(0, 0, 0, 0) 98%);
      mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 56%, rgba(0, 0, 0, 0) 98%);
      filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.8));
      pointer-events: none;
      z-index: 1;
      will-change: opacity, transform;
    `;

    const img = document.createElement('img');
    img.src = frameZeroUrl;
    img.alt = `Ambient Sample ${sampleNum}`;
    img.className = 'w-full h-full object-cover select-none pointer-events-none block';
    img.loading = 'eager';

    card.appendChild(img);
    layerElement.appendChild(card);

    const gifEntry = {
      id: Symbol('ambientGif'),
      element: card,
      rect: position,
      isFadingOut: false,
      lifespanTimer: null,
    };
    activeGifs.push(gifEntry);

    // If image fails to load, gracefully dismiss without leaving broken element
    img.onerror = () => {
      dismissGif(gifEntry);
    };

    // Trigger smooth slow fade-in, gradual scale drift, and smooth directional motion
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.opacity = '0.80';
        card.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) scale(${targetScale})`;
      });
    });

    // Schedule lifespan
    gifEntry.lifespanTimer = setTimeout(() => {
      dismissGif(gifEntry);
    }, lifespan);
  }

  /** Smoothly fades out and removes a GIF */
  function dismissGif(gifEntry) {
    if (gifEntry.isFadingOut) return;
    gifEntry.isFadingOut = true;
    if (gifEntry.lifespanTimer) {
      clearTimeout(gifEntry.lifespanTimer);
      gifEntry.lifespanTimer = null;
    }

    // Liveness Watchdog: Check how many GIFs remain that are NOT fading out
    const remainingActive = activeGifs.filter(g => !g.isFadingOut && g !== gifEntry);
    if (remainingActive.length === 0) {
      // Sole remaining GIF is departing: immediately spawn a new one
      spawnGif();
    }

    // Trigger ultra smooth fade-out (preserving current scale without abrupt jump)
    gifEntry.element.style.transition = `opacity ${CONFIG.fadeDurationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    gifEntry.element.style.opacity = '0';

    setTimeout(() => {
      if (gifEntry.element.parentNode) {
        gifEntry.element.parentNode.removeChild(gifEntry.element);
      }
      activeGifs = activeGifs.filter(g => g !== gifEntry);

      // Final check: if registry is somehow empty, force a spawn
      if (activeGifs.length === 0) {
        spawnGif();
      }
    }, CONFIG.fadeDurationMs + 50);
  }

  /** Adjust active bounding boxes on window resize */
  function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const item of [...activeGifs]) {
      if (item.rect.x + item.rect.width > w || item.rect.y + item.rect.height > h) {
        dismissGif(item);
      }
    }
  }

  // Auto-boot when DOM is ready, respecting motion preferences
  function boot() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Respect user's motion preferences
    }
    initAmbientGifs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
