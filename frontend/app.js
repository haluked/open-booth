/**
 * OpenBooth - Y2K Edition
 * 2-Player Synchronized WebRTC Virtual Photobooth & Solo Photobooth
 * Complete 4-Shot Sequential Capture & Classic 4-Cut Strip Renderer
 */

// ==========================================
// 1. DOM Element Selections
// ==========================================
const elements = {
  // Toast
  toastNotification: document.getElementById('toastNotification'),
  toastText: document.getElementById('toastText'),
  toastIcon: document.getElementById('toastIcon'),

  // Views
  landingView: document.getElementById('landingView'),
  boothView: document.getElementById('boothView'),
  headerLogoLink: document.getElementById('headerLogoLink'),

  // Landing view controls
  pilotNickInput: document.getElementById('pilotNickInput'),
  reconnectBanner: document.getElementById('reconnectBanner'),
  reconnectCodeText: document.getElementById('reconnectCodeText'),
  reconnectAcceptBtn: document.getElementById('reconnectAcceptBtn'),
  reconnectDismissBtn: document.getElementById('reconnectDismissBtn'),
  generatedCodePreview: document.getElementById('generatedCodePreview'),
  rollCodeBtn: document.getElementById('rollCodeBtn'),
  createLockCheckbox: document.getElementById('createLockCheckbox'),
  createPasswordInput: document.getElementById('createPasswordInput'),
  createChamberBtn: document.getElementById('createChamberBtn'),
  joinCodeInput: document.getElementById('joinCodeInput'),
  joinPasswordInput: document.getElementById('joinPasswordInput'),
  joinChamberBtn: document.getElementById('joinChamberBtn'),

  // Room header & active controls
  roomActiveControls: document.getElementById('roomActiveControls'),
  displayRoomCode: document.getElementById('displayRoomCode'),
  copyInviteLinkBtn: document.getElementById('copyInviteLinkBtn'),
  disconnectBtn: document.getElementById('disconnectBtn'),

  // Participant & status indicators
  participantBadge: document.getElementById('participantBadge'),
  participantDot: document.getElementById('participantDot'),
  participantCountText: document.getElementById('participantCountText'),
  statusIndicator: document.getElementById('statusIndicator'),
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  modePill: document.getElementById('modePill'),

  // Video feeds
  localVideo: document.getElementById('localVideo'),
  localPlaceholder: document.getElementById('localVideoPlaceholder'),
  enableCameraBtn: document.getElementById('enableCameraBtn'),
  toggleCameraBtn: document.getElementById('toggleCameraBtn'),
  toggleCameraText: document.getElementById('toggleCameraText'),
  toggleCameraIcon: document.getElementById('toggleCameraIcon'),
  remoteVideo: document.getElementById('remoteVideo'),
  remotePlaceholder: document.getElementById('remoteVideoPlaceholder'),
  remoteStatusDot: document.getElementById('remoteStatusDot'),
  remotePlaceholderText: document.getElementById('remotePlaceholderText'),
  remotePlaceholderSubText: document.getElementById('remotePlaceholderSubText'),
  invitePartnerCardBtn: document.getElementById('invitePartnerCardBtn'),
  localNickDisplay: document.getElementById('localNickDisplay'),
  remoteNickDisplay: document.getElementById('remoteNickDisplay'),

  // Countdown & Flash Overlay
  countdownContainer: document.getElementById('countdownContainer'),
  countdownShotBadge: document.getElementById('countdownShotBadge'),
  countdownNumber: document.getElementById('countdownNumber'),
  countdownMessage: document.getElementById('countdownMessage'),
  countdownDots: document.getElementById('countdownDots'),
  flashOverlay: document.getElementById('flashOverlay'),

  // Action button
  takePhotoBtn: document.getElementById('takePhotoBtn'),
  takePhotoBtnText: document.getElementById('takePhotoBtnText'),
  takePhotoBtnSub: document.getElementById('takePhotoBtnSub'),

  // 4-Shot Tray
  shotTrayCount: document.getElementById('shotTrayCount'),
  thumbSlots: [
    document.getElementById('thumbSlot-0'),
    document.getElementById('thumbSlot-1'),
    document.getElementById('thumbSlot-2'),
    document.getElementById('thumbSlot-3'),
  ],
  thumbImgs: [
    document.getElementById('thumbImg-0'),
    document.getElementById('thumbImg-1'),
    document.getElementById('thumbImg-2'),
    document.getElementById('thumbImg-3'),
  ],
  thumbPlaceholders: [
    document.getElementById('thumbPlaceholder-0'),
    document.getElementById('thumbPlaceholder-1'),
    document.getElementById('thumbPlaceholder-2'),
    document.getElementById('thumbPlaceholder-3'),
  ],

  // Photostrip Result & Canvas
  photostripCanvas: document.getElementById('photostripCanvas'),
  resultSection: document.getElementById('resultSection'),
  photostripPreview: document.getElementById('photostripPreview'),
  resultSubtitle: document.getElementById('resultSubtitle'),
  downloadStripBtn: document.getElementById('downloadStripBtn'),
  retakePhotosBtn: document.getElementById('retakePhotosBtn'),
  closePreviewBtn: document.getElementById('closePreviewBtn'),
  themeSelectorContainer: document.getElementById('themeSelectorContainer'),
  duoLayoutControl: document.getElementById('duoLayoutControl'),
  layoutSplitBtn: document.getElementById('layoutSplitBtn'),
  layoutDualBtn: document.getElementById('layoutDualBtn'),

  // Chamber Modals
  chamberNotFoundModal: document.getElementById('chamberNotFoundModal'),
  notFoundCodeSpan: document.getElementById('notFoundCodeSpan'),
  modalReturnLobbyBtn: document.getElementById('modalReturnLobbyBtn'),
  modalCreateRoomInsteadBtn: document.getElementById('modalCreateRoomInsteadBtn'),
  chamberFullModal: document.getElementById('chamberFullModal'),
  fullCodeSpan: document.getElementById('fullCodeSpan'),
  modalFullLobbyBtn: document.getElementById('modalFullLobbyBtn'),
  chamberPasswordModal: document.getElementById('chamberPasswordModal'),
  pwdCodeSpan: document.getElementById('pwdCodeSpan'),
  modalPasswordInput: document.getElementById('modalPasswordInput'),
  modalPasswordError: document.getElementById('modalPasswordError'),
  modalPasswordSubmitBtn: document.getElementById('modalPasswordSubmitBtn'),
  modalPasswordCancelBtn: document.getElementById('modalPasswordCancelBtn'),
  chamberNickModal: document.getElementById('chamberNickModal'),
  nickCodeSpan: document.getElementById('nickCodeSpan'),
  modalNickInput: document.getElementById('modalNickInput'),
  modalNickSubmitBtn: document.getElementById('modalNickSubmitBtn'),
  modalNickCancelBtn: document.getElementById('modalNickCancelBtn'),

  // Legal & Storage Transparency
  openPrivacyModalBtn: document.getElementById('openPrivacyModalBtn'),
  openTermsModalBtn: document.getElementById('openTermsModalBtn'),
  clearLocalDataBtn: document.getElementById('clearLocalDataBtn'),
  privacyStorageNotice: document.getElementById('privacyStorageNotice'),
  dismissStorageNoticeBtn: document.getElementById('dismissStorageNoticeBtn'),
  ackStorageNoticeBtn: document.getElementById('ackStorageNoticeBtn'),
  legalModal: document.getElementById('legalModal'),
  legalModalTitle: document.getElementById('legalModalTitle'),
  tabPrivacyBtn: document.getElementById('tabPrivacyBtn'),
  tabTermsBtn: document.getElementById('tabTermsBtn'),
  legalModalBody: document.getElementById('legalModalBody'),
  closeLegalModalBtn: document.getElementById('closeLegalModalBtn'),
  legalModalDoneBtn: document.getElementById('legalModalDoneBtn'),

  // Debugger panel
  toggleDebuggerBtn: document.getElementById('toggleDebuggerBtn'),
  clearLogsBtn: document.getElementById('clearLogsBtn'),
  debuggerBody: document.getElementById('debuggerBody'),
  debugLogsContainer: document.getElementById('debugLogsContainer'),
  debugWsStatus: document.getElementById('debugWsStatus'),
  debugRtcStatus: document.getElementById('debugRtcStatus'),
  debugIceStatus: document.getElementById('debugIceStatus'),
  debugActiveRoom: document.getElementById('debugActiveRoom'),
};

// ==========================================
// 2. Application State
// ==========================================
const state = {
  roomId: null,
  localNick: 'You',
  remoteNick: 'Friend',
  roomPassword: '',
  pendingRoomId: null,
  ws: null,
  peerConnection: null,
  localStream: null,
  remoteStream: null,
  participantCount: 1, // 1: solo, 2: duo
  isInRoom: false,
  isCapturing: false,
  capturedShots: [], // Array of { local: Canvas, remote: Canvas | null, timestamp: number }
  selectedTheme: 'cyber', // 'cyber' | 'classic' | 'sepia' | 'neon'
  duoLayout: 'split', // 'split' | 'dual'
  isDebuggerCollapsed: true, // Collapsed by default
  iceCandidateQueue: [], // Queue for ICE candidates arriving before remote description
  currentCaptureSessionId: 0,
  activeCountdownInterval: null,
  activeBreatherTimeout: null,
  localMediaPromise: null,
  isCameraEnabled: true,
};

// ==========================================
// 3. Audio Effects (Web Audio API)
// ==========================================
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** One-time gesture listener to unlock Web Audio context on iOS Safari / Android Chrome */
function setupAudioUnlock() {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch (e) {}
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('click', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('click', unlockAudio, { passive: true });
}

/** Play short electronic beep for 3, 2, 1 countdown */
function playCountdownBeep(isFinal = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Audio autoplay restrictions or unsupported
  }
}

/** Synthesize realistic camera shutter click & flash sound */
function playShutterSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {
    // Ignore audio error
  }
}

// ==========================================
// 4. UI Toast & Debug Helpers
// ==========================================
let toastTimeout = null;
function showToast(message, icon = '✨', duration = 3000) {
  if (!elements.toastNotification) return;
  if (elements.toastText) elements.toastText.textContent = message;
  if (elements.toastIcon) elements.toastIcon.textContent = icon;

  elements.toastNotification.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
  elements.toastNotification.classList.add('opacity-100', 'translate-y-0');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toastNotification.classList.remove('opacity-100', 'translate-y-0');
    elements.toastNotification.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
  }, duration);
}

function logDebug(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const colorMap = {
    info: 'text-neutral-400',
    success: 'text-emerald-400',
    warn: 'text-amber-400',
    error: 'text-rose-400',
  };

  const line = document.createElement('div');
  line.className = `font-mono text-xs ${colorMap[type] || 'text-neutral-400'}`;
  line.textContent = `[${timestamp}] ${message}`;

  if (elements.debugLogsContainer) {
    elements.debugLogsContainer.appendChild(line);
    // Cap debug log entries to prevent memory bloat
    while (elements.debugLogsContainer.childElementCount > 200) {
      elements.debugLogsContainer.removeChild(elements.debugLogsContainer.firstChild);
    }
    elements.debugLogsContainer.scrollTop = elements.debugLogsContainer.scrollHeight;
  }

  const consolePrefix = `[OpenBooth ${timestamp}]`;
  if (type === 'error') console.error(consolePrefix, message);
  else if (type === 'warn') console.warn(consolePrefix, message);
  else console.log(consolePrefix, message);
}

function clearDebugLogs() {
  if (elements.debugLogsContainer) {
    elements.debugLogsContainer.innerHTML = '';
    logDebug('Logs cleared.', 'info');
  }
}

function updateConnectionStatus(status, color = 'bg-neutral-500') {
  if (elements.statusText) elements.statusText.textContent = status;
  if (elements.statusDot) {
    elements.statusDot.className = `w-2 h-2 rounded-full ${color}`;
  }
  if (elements.statusIndicator) {
    elements.statusIndicator.classList.remove('hidden');
  }
}

// ==========================================
// 4.1 Cookie & LocalStorage Helpers
// ==========================================
function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
  } catch (e) {
    return null;
  }
}

function setCookie(name, value, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
  } catch (e) {}
}

function getStoredNickname() {
  try {
    const val = localStorage.getItem('openbooth_nick') || getCookie('openbooth_nick');
    if (val && val.trim() && val.trim() !== 'You' && val.trim() !== 'Pilot') {
      return val.trim().slice(0, 24);
    }
    return '';
  } catch (e) {
    const cVal = getCookie('openbooth_nick');
    if (cVal && cVal.trim() && cVal.trim() !== 'You' && cVal.trim() !== 'Pilot') {
      return cVal.trim().slice(0, 24);
    }
    return '';
  }
}

function saveNickname(nick, updateInput = false) {
  const raw = (nick || '').trim().slice(0, 24);
  const clean = raw || 'You';
  state.localNick = clean;
  if (raw && raw !== 'You' && raw !== 'Pilot') {
    try { localStorage.setItem('openbooth_nick', raw); } catch (e) {}
    setCookie('openbooth_nick', raw);
  } else if (!raw) {
    try { localStorage.removeItem('openbooth_nick'); } catch (e) {}
    setCookie('openbooth_nick', '');
  }
  if (updateInput && elements.pilotNickInput) {
    elements.pilotNickInput.value = raw;
  }
  if (elements.localNickDisplay) {
    elements.localNickDisplay.textContent = clean;
  }
}

function getStoredRoom() {
  try {
    return localStorage.getItem('openbooth_room') || getCookie('openbooth_room') || null;
  } catch (e) {
    return getCookie('openbooth_room') || null;
  }
}

function saveStoredRoom(roomId) {
  try { localStorage.setItem('openbooth_room', roomId); } catch (e) {}
  setCookie('openbooth_room', roomId);
}

function clearStoredRoom() {
  try { localStorage.removeItem('openbooth_room'); } catch (e) {}
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `openbooth_room=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secure}`;
  } catch (e) {}
}

// ==========================================
// 4.2 Algorithmic Room Code Generator
// ==========================================
const CODE_PREFIXES = ["BOOTH", "SNAP", "PHOTO", "SMILE", "STUDIO", "PARTY", "CHEESE", "POSE"];
const SAFE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function generateAlgorithmicRoomCode() {
  const prefix = CODE_PREFIXES[Math.floor(Math.random() * CODE_PREFIXES.length)];
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += SAFE_CHARS.charAt(Math.floor(Math.random() * SAFE_CHARS.length));
  }
  return `${prefix}-${suffix}`;
}

function rollRandomCode() {
  const code = generateAlgorithmicRoomCode();
  if (elements.generatedCodePreview) {
    elements.generatedCodePreview.textContent = code;
  }
  return code;
}

// ==========================================
// 4.3 View Switching & Modals
// ==========================================
function hideAllModals() {
  elements.chamberNotFoundModal?.classList.add('hidden');
  elements.chamberFullModal?.classList.add('hidden');
  elements.chamberPasswordModal?.classList.add('hidden');
  elements.chamberNickModal?.classList.add('hidden');
  elements.legalModal?.classList.add('hidden');
}

function showChamberNotFoundModal(roomCode) {
  hideAllModals();
  state.pendingRoomId = roomCode;
  if (elements.notFoundCodeSpan) elements.notFoundCodeSpan.textContent = `#${roomCode}`;
  elements.chamberNotFoundModal?.classList.remove('hidden');
}

function showChamberFullModal(roomCode) {
  hideAllModals();
  if (elements.fullCodeSpan) elements.fullCodeSpan.textContent = `#${roomCode}`;
  elements.chamberFullModal?.classList.remove('hidden');
}

function showChamberPasswordModal(roomCode, errorMessage = null) {
  hideAllModals();
  state.pendingRoomId = roomCode;
  if (elements.pwdCodeSpan) elements.pwdCodeSpan.textContent = `#${roomCode}`;
  if (elements.modalPasswordInput) {
    elements.modalPasswordInput.value = '';
    setTimeout(() => elements.modalPasswordInput.focus(), 50);
  }
  if (elements.modalPasswordError) {
    if (errorMessage) {
      elements.modalPasswordError.textContent = errorMessage;
      elements.modalPasswordError.classList.remove('hidden');
    } else {
      elements.modalPasswordError.classList.add('hidden');
    }
  }
  elements.chamberPasswordModal?.classList.remove('hidden');
}

function showChamberNickModal(roomCode) {
  hideAllModals();
  state.pendingRoomId = roomCode;
  if (elements.nickCodeSpan) elements.nickCodeSpan.textContent = `#${roomCode}`;
  if (elements.modalNickInput) {
    elements.modalNickInput.value = '';
    setTimeout(() => elements.modalNickInput.focus(), 50);
  }
  elements.chamberNickModal?.classList.remove('hidden');
}

// ==========================================
// 4.4 Legal & Storage Transparency
// ==========================================
const LEGAL_TEXT = {
  privacy: `
    <div class="space-y-4">
      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">Zero-Knowledge Architecture &amp; Data Minimization</h4>
        <p class="mt-1 text-slate-300">OpenBooth is engineered from the ground up as a zero-knowledge, 100% client-side application. We do not store, process, mirror, or upload your photos, videos, or camera feeds to any central server or cloud storage.</p>
      </div>

      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">1. Local Processing in Browser RAM</h4>
        <p class="mt-1 text-slate-300">Every photo capture, pose countdown, 4-shot sequence burst, theme filter application, and photostrip composite rendering is executed entirely within your browser's local sandbox memory (HTML5 Canvas API). Captured frames never leave your local device memory unless downloaded directly by you as a keepsake strip.</p>
      </div>

      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">2. WebRTC Peer-to-Peer Encryption (DTLS &amp; SRTP)</h4>
        <p class="mt-1 text-slate-300">In 2-player photobooth mode, real-time video feeds travel directly between you and your partner using end-to-end encrypted WebRTC peer-to-peer data channels. Media packets are encrypted in transit via standard DTLS (Datagram Transport Layer Security) and SRTP (Secure Real-time Transport Protocol). The OpenBooth signaling server acts purely as an ephemeral handshake broker and never has access to unencrypted video frames or keystrokes.</p>
      </div>

      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">3. Biometric Data Non-Collection (BIPA Compliance)</h4>
        <p class="mt-1 text-slate-300">In strict adherence to the Illinois Biometric Information Privacy Act (BIPA) and global biometric protection frameworks, OpenBooth <strong class="text-white">DOES NOT</strong> capture, detect, extract, analyze, or retain biometric identifiers, facial geometry vectors, retina scans, voiceprints, or automated facial recognition templates. Canvas pixels are painted as raw visual rasters without semantic facial profiling.</p>
      </div>

      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">4. GDPR &amp; CCPA / CPRA Compliance</h4>
        <p class="mt-1 text-slate-300">We comply with the EU General Data Protection Regulation (GDPR Art. 5 &amp; 25) and California Consumer Privacy Act (CCPA/CPRA):</p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-slate-400">
          <li><strong class="text-slate-200">No Personal Data Sale:</strong> We never sell, rent, or share personal data or usage patterns with third parties or data brokers.</li>
          <li><strong class="text-slate-200">Zero Cross-Site Tracking:</strong> No advertising tags, tracking pixels, or third-party analytical telemetry scripts are loaded.</li>
          <li><strong class="text-slate-200">Instant Ephemeral Deletion:</strong> Terminating your browser session or disconnecting immediately flushes volatile memory buffers.</li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">5. Minimal Storage Transparency</h4>
        <p class="mt-1 text-slate-300">We utilize browser <code class="text-cyan-300 font-mono bg-white/5 px-1 py-0.5 rounded">localStorage</code> and first-party cookies exclusively for functional continuity: remembering your name (<code class="text-cyan-300 font-mono">openbooth_nick</code>) and your active room code (<code class="text-cyan-300 font-mono">openbooth_room</code>) to support reconnection if your network drops. You can purge this at any time using the "Reset Saved Name" button.</p>
      </div>
    </div>
  `,
  terms: `
    <div class="space-y-4">
      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">OpenBooth Terms of Service &amp; Acceptable Use</h4>
        <p class="mt-1 text-slate-300">Effective Date: October 2026. By accessing or using the OpenBooth platform, you acknowledge and agree to be bound by the following terms and operating conditions.</p>
      </div>

      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">1. Acceptable Use Policy (AUP)</h4>
        <p class="mt-1 text-slate-300">OpenBooth is provided for positive collaborative experiences and fun keepsake photo creation. You strictly agree not to:</p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-slate-400">
          <li>Capture, record, or distribute screenshots of any peer participant without their unambiguous prior consent.</li>
          <li>Transmit sexually explicit, non-consensual intimate, abusive, harassing, or unlawful imagery through shared feeds.</li>
          <li>Attempt denial-of-service, signal flood, packet manipulation, or unauthorized interception against our WebSockets infrastructure.</li>
        </ul>
      </div>

      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">2. Room Access &amp; Password Responsibility</h4>
        <p class="mt-1 text-slate-300">OpenBooth provides algorithmic room codes and optional PIN password protection. You are solely responsible for safeguarding invite links and passwords generated for private photobooth rooms.</p>
      </div>

      <div class="pb-3 border-b border-white/10">
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">3. Intellectual Property &amp; Content Rights</h4>
        <p class="mt-1 text-slate-300">You retain 100% intellectual property ownership of all photos, poses, strips, and composites created through OpenBooth. Because processing is entirely client-side, OpenBooth neither claims nor requires any intellectual property license to your creations.</p>
      </div>

      <div>
        <h4 class="text-sm font-bold text-cyan-300 uppercase tracking-wider font-granix">4. Limitation of Liability &amp; "As-Is" Warranty</h4>
        <p class="mt-1 text-slate-300">OpenBooth is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by applicable law, OpenBooth, its contributors, and operators disclaim all representations or warranties, express or implied. Under no circumstances shall OpenBooth be held liable for incidental, consequential, or punitive damages resulting from network connectivity failures, browser incompatibilities, or WebRTC packet latency.</p>
      </div>
    </div>
  `
};

function showLegalModal(tab = 'privacy') {
  hideAllModals();
  switchLegalTab(tab);
  elements.legalModal?.classList.remove('hidden');
}

function hideLegalModal() {
  elements.legalModal?.classList.add('hidden');
}

function switchLegalTab(tab) {
  if (tab === 'terms') {
    if (elements.legalModalTitle) elements.legalModalTitle.textContent = 'TERMS OF SERVICE';
    if (elements.tabPrivacyBtn) {
      elements.tabPrivacyBtn.className = 'px-4 py-2 font-granix font-black text-xs uppercase tracking-wider rounded-t-lg transition-colors border-b-2 border-transparent text-slate-400 hover:text-slate-200 cursor-pointer';
    }
    if (elements.tabTermsBtn) {
      elements.tabTermsBtn.className = 'px-4 py-2 font-granix font-black text-xs uppercase tracking-wider rounded-t-lg transition-colors border-b-2 border-cyan-400 text-cyan-300 bg-white/5 cursor-pointer';
    }
    if (elements.legalModalBody) {
      elements.legalModalBody.innerHTML = LEGAL_TEXT.terms;
    }
  } else {
    if (elements.legalModalTitle) elements.legalModalTitle.textContent = 'PRIVACY POLICY & ZERO-KNOWLEDGE TRUST';
    if (elements.tabPrivacyBtn) {
      elements.tabPrivacyBtn.className = 'px-4 py-2 font-granix font-black text-xs uppercase tracking-wider rounded-t-lg transition-colors border-b-2 border-cyan-400 text-cyan-300 bg-white/5 cursor-pointer';
    }
    if (elements.tabTermsBtn) {
      elements.tabTermsBtn.className = 'px-4 py-2 font-granix font-black text-xs uppercase tracking-wider rounded-t-lg transition-colors border-b-2 border-transparent text-slate-400 hover:text-slate-200 cursor-pointer';
    }
    if (elements.legalModalBody) {
      elements.legalModalBody.innerHTML = LEGAL_TEXT.privacy;
    }
  }
}

function clearLocalData() {
  try {
    localStorage.removeItem('openbooth_nick');
    localStorage.removeItem('openbooth_room');
  } catch (e) {}
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `openbooth_nick=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secure}`;
  document.cookie = `openbooth_room=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secure}`;
  state.localNick = 'You';
  if (elements.pilotNickInput) elements.pilotNickInput.value = '';
  if (elements.localNickDisplay) elements.localNickDisplay.textContent = 'YOU';
  if (elements.reconnectBanner) elements.reconnectBanner.classList.add('hidden');
  showToast('Saved name and session cookies cleared', '🧹');
}

function checkStorageNotice() {
  try {
    const acknowledged = localStorage.getItem('openbooth_storage_ack');
    if (!acknowledged && elements.privacyStorageNotice) {
      elements.privacyStorageNotice.classList.remove('hidden');
    }
  } catch (e) {
    if (elements.privacyStorageNotice) {
      elements.privacyStorageNotice.classList.remove('hidden');
    }
  }
}

function ackStorageNotice() {
  try {
    localStorage.setItem('openbooth_storage_ack', 'true');
  } catch (e) {}
  elements.privacyStorageNotice?.classList.add('hidden');
  showToast('Storage preferences saved', '🔒');
}

function dismissStorageNotice() {
  elements.privacyStorageNotice?.classList.add('hidden');
}

function showLandingView(updateUrl = true) {
  state.isInRoom = false;
  state.roomId = null;
  state.roomPassword = '';
  hideAllModals();

  if (elements.landingView) elements.landingView.classList.remove('hidden');
  if (elements.boothView) elements.boothView.classList.add('hidden');
  if (elements.roomActiveControls) elements.roomActiveControls.classList.add('hidden');

  if (elements.statusIndicator) {
    elements.statusIndicator.classList.remove('hidden');
    if (elements.statusText) elements.statusText.textContent = 'ONLINE';
    if (elements.statusDot) elements.statusDot.className = 'w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse';
  }

  rollRandomCode();
  checkResumeBanner();

  if (updateUrl) {
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    } catch (e) {}
  }
}

function showBoothView(roomId, updateUrl = true) {
  state.isInRoom = true;
  state.roomId = roomId;
  saveStoredRoom(roomId);
  hideAllModals();

  // Acquire camera preview only when inside a room
  if (state.isCameraEnabled && !state.localStream) {
    startLocalMedia();
  }
  if (elements.toggleCameraText) {
    elements.toggleCameraText.textContent = state.isCameraEnabled ? 'CAMERA ON' : 'CAMERA OFF';
  }
  if (elements.toggleCameraIcon) {
    elements.toggleCameraIcon.className = `w-2 h-2 rounded-full ${state.isCameraEnabled ? 'bg-emerald-400' : 'bg-rose-500'}`;
  }

  if (elements.landingView) elements.landingView.classList.add('hidden');
  if (elements.boothView) elements.boothView.classList.remove('hidden');
  if (elements.roomActiveControls) elements.roomActiveControls.classList.remove('hidden');
  if (elements.displayRoomCode) elements.displayRoomCode.textContent = `#${roomId}`;

  if (elements.localNickDisplay) elements.localNickDisplay.textContent = state.localNick;
  if (elements.remoteNickDisplay && state.participantCount < 2) {
    elements.remoteNickDisplay.textContent = 'WAITING FOR FRIEND';
  }

  if (elements.statusIndicator) {
    if (elements.statusText) elements.statusText.textContent = 'ROOM ACTIVE';
    if (elements.statusDot) elements.statusDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
  }

  if (updateUrl) {
    try {
      const targetUrl = `/room/${encodeURIComponent(roomId)}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }
    } catch (e) {}
  }
}

async function checkResumeBanner() {
  const storedRoom = getStoredRoom();
  if (!storedRoom || state.isInRoom) {
    elements.reconnectBanner?.classList.add('hidden');
    return;
  }

  try {
    const res = await fetch('/api/rooms/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ room_id: storedRoom })
    });
    const data = await res.json();
    if (data.exists && !data.is_full) {
      if (elements.reconnectBanner && elements.reconnectCodeText) {
        elements.reconnectCodeText.textContent = `#${storedRoom}`;
        elements.reconnectBanner.classList.remove('hidden');
      }
    } else {
      elements.reconnectBanner?.classList.add('hidden');
      clearStoredRoom();
    }
  } catch (e) {
    elements.reconnectBanner?.classList.add('hidden');
  }
}

// ==========================================
// 5. Room Participant & Mode Management
// ==========================================
function updateParticipantUI() {
  const isDuo = state.isInRoom && state.participantCount >= 2;

  // Participant counter badge
  if (elements.participantCountText && elements.participantDot) {
    if (!state.isInRoom) {
      elements.participantCountText.textContent = '1 USER READY';
      elements.participantDot.className = 'w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]';
    } else if (state.participantCount === 1) {
      elements.participantCountText.textContent = '1 USER READY';
      elements.participantDot.className = 'w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]';
    } else {
      elements.participantCountText.textContent = '2 USERS READY';
      elements.participantDot.className = 'w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse';
    }
  }

  // Action button labels
  if (elements.takePhotoBtnText && !state.isCapturing) {
    elements.takePhotoBtnText.textContent = 'TAKE PHOTOS (4 SHOTS)';
  }

  // Remote placeholder card & invite link button
  if (elements.remotePlaceholder) {
    const hasRemoteVideo = state.remoteStream && state.remoteStream.getVideoTracks().length > 0;
    if (hasRemoteVideo) {
      elements.remotePlaceholder.classList.add('hidden');
      if (elements.remoteNickDisplay) elements.remoteNickDisplay.textContent = state.remoteNick || 'Friend';
      if (elements.remoteStatusDot) elements.remoteStatusDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
      if (elements.invitePartnerCardBtn) elements.invitePartnerCardBtn.classList.add('hidden');
    } else if (isDuo) {
      // Partner is connected in the room, but their camera is not transmitting video
      elements.remotePlaceholder.classList.remove('hidden');
      if (elements.remoteNickDisplay) elements.remoteNickDisplay.textContent = 'Camera is not open';
      if (elements.remoteStatusDot) elements.remoteStatusDot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400';
      if (elements.remotePlaceholderText) {
        elements.remotePlaceholderText.textContent = `[${state.remoteNick || 'Guest'}] is connected, but camera is not open`;
      }
      if (elements.remotePlaceholderSubText) {
        elements.remotePlaceholderSubText.textContent = 'Waiting for your partner to turn on or allow their camera...';
      }
      // Remove copy room link button when friend has joined the room
      if (elements.invitePartnerCardBtn) {
        elements.invitePartnerCardBtn.classList.add('hidden');
      }
    } else {
      // Room is empty (user is alone)
      elements.remotePlaceholder.classList.remove('hidden');
      if (elements.remoteNickDisplay) elements.remoteNickDisplay.textContent = 'WAITING FOR FRIEND';
      if (elements.remoteStatusDot) elements.remoteStatusDot.className = 'w-1.5 h-1.5 rounded-full bg-slate-500';
      if (elements.remotePlaceholderText) {
        elements.remotePlaceholderText.textContent = 'WAITING FOR YOUR FRIEND';
      }
      if (elements.remotePlaceholderSubText) {
        elements.remotePlaceholderSubText.textContent = 'Send the room link to your friend to start snapping photos together';
      }
      // Only show copy room link if the room is empty
      if (elements.invitePartnerCardBtn) {
        elements.invitePartnerCardBtn.classList.remove('hidden');
      }
    }
  }

  // Duo layout controls in result section
  if (elements.duoLayoutControl) {
    if (isDuo) {
      elements.duoLayoutControl.classList.remove('hidden');
    } else {
      elements.duoLayoutControl.classList.add('hidden');
    }
  }
}

// Copy full invite link to clipboard
function copyInviteLink() {
  const roomId = state.roomId;
  if (!roomId) {
    showToast('Please join a room first!', '⚠️');
    return;
  }
  const url = `${window.location.origin}/room/${encodeURIComponent(roomId)}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast(`Invite link copied for #${roomId}! Send to your friend.`, '🔗');
  }).catch(() => {
    prompt('Copy this link:', url);
  });
}

// ==========================================
// 6. Room REST API & WebSocket Signaling
// ==========================================
async function handleCreateChamber() {
  getAudioContext();
  const nick = elements.pilotNickInput?.value.trim() || state.localNick || 'You';
  saveNickname(nick);

  const roomCode = elements.generatedCodePreview?.textContent.trim() || rollRandomCode();
  const isProtected = elements.createLockCheckbox?.checked;
  const password = isProtected ? elements.createPasswordInput?.value.trim() : null;

  try {
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        room_code: roomCode,
        password: password,
        creator_nick: nick
      })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.detail || 'Could not create room', '⚠️');
      return;
    }
    state.roomPassword = password || '';
    showBoothView(data.room_id);
    initWebSocket(data.room_id);
    startWebRTC();
  } catch (err) {
    showToast('Failed to create room: ' + err.message, '⚠️');
  }
}

async function handleJoinChamber(codeToJoin, pwdToJoin) {
  getAudioContext();
  const nick = elements.pilotNickInput?.value.trim() || state.localNick || 'You';
  saveNickname(nick);

  const cleanCode = (codeToJoin || elements.joinCodeInput?.value || '').trim().toUpperCase();
  if (!cleanCode) {
    showToast('Please enter a room code', '⚠️');
    return;
  }

  const pwd = pwdToJoin !== undefined && pwdToJoin !== null ? pwdToJoin : (elements.joinPasswordInput?.value.trim() || null);

  try {
    const res = await fetch('/api/rooms/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        room_id: cleanCode,
        password: pwd
      })
    });

    if (res.status === 429) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error || errData.detail || 'Too many failed attempts. Room locked temporarily.';
      showToast(msg, '⏳', 4000);
      showChamberPasswordModal(cleanCode, msg);
      return;
    }

    const data = await res.json();

    if (!data.exists) {
      logDebug(`Room #${cleanCode} not found in memory. Auto-creating room...`, 'info');
      try {
        const createRes = await fetch('/api/rooms/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            room_code: cleanCode,
            password: pwd,
            creator_nick: state.localNick || 'You'
          })
        });
        const createData = await createRes.json();
        if (createRes.ok && createData.success) {
          hideAllModals();
          state.roomPassword = pwd || '';
          showBoothView(cleanCode);
          initWebSocket(cleanCode);
          startWebRTC();
          showToast(`Joined Room #${cleanCode}! Waiting for your friend...`, '📸');
          return;
        }
      } catch (createErr) {
        logDebug(`Auto-create fallback error: ${createErr.message}`, 'error');
      }
      showChamberNotFoundModal(cleanCode);
      return;
    }
    if (data.is_full) {
      showChamberFullModal(cleanCode);
      return;
    }
    if (data.password_required && !data.valid) {
      const msg = (pwd !== null && pwd !== undefined) ? 'Invalid room password. Please try again.' : null;
      showChamberPasswordModal(cleanCode, msg);
      return;
    }

    // Valid and ready!
    hideAllModals();
    state.roomPassword = pwd || '';
    showBoothView(cleanCode);
    initWebSocket(cleanCode);
    startWebRTC();
  } catch (err) {
    showToast('Connection error: ' + err.message, '⚠️');
  }
}

function leaveChamber() {
  if (state.isCapturing) {
    abortCaptureSequence();
  }
  if (state.ws) {
    try { state.ws.close(); } catch (e) {}
  }
  if (state.peerConnection) {
    try { state.peerConnection.close(); } catch (e) {}
    state.peerConnection = null;
  }
  if (state.localStream) {
    state.localStream.getTracks().forEach(t => t.stop());
    state.localStream = null;
  }
  if (elements.localVideo) elements.localVideo.srcObject = null;
  state.iceCandidateQueue = [];
  state.capturedShots = [];
  state.remoteStream = null;
  if (elements.remoteVideo) elements.remoteVideo.srcObject = null;
  clearStoredRoom();
  showLandingView();
  showToast('Left the room. Returned home.', '🚪');
}

function initWebSocket(roomId) {
  logDebug(`Connecting to signaling server for room: "${roomId}"...`, 'info');

  if (elements.debugActiveRoom) {
    elements.debugActiveRoom.textContent = roomId;
    elements.debugActiveRoom.classList.add('text-cyan-400');
  }
  if (elements.debugWsStatus) {
    elements.debugWsStatus.textContent = 'CONNECTING...';
    elements.debugWsStatus.className = 'font-semibold text-amber-400';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const queryParams = new URLSearchParams({
    nick: state.localNick
  });
  if (state.roomPassword) {
    queryParams.set('pwd', state.roomPassword);
  }

  const wsUrl = `${protocol}//${window.location.host}/ws/${encodeURIComponent(roomId)}?${queryParams.toString()}`;
  state.ws = new WebSocket(wsUrl);

  state.ws.onopen = () => {
    logDebug('WebSocket connected to signaling server.', 'success');
    state.isInRoom = true;
    showBoothView(roomId);

    if (elements.debugWsStatus) {
      elements.debugWsStatus.textContent = 'CONNECTED';
      elements.debugWsStatus.className = 'font-semibold text-emerald-400';
    }
    updateConnectionStatus('Online', 'bg-emerald-400');
    updateParticipantUI();
    showToast(`Connected to room #${roomId}`, '✅');
  };

  state.ws.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      logDebug(`WS MSG: ${data.type}`, 'info');

      if (data.type === 'error') {
        showToast(data.message || 'Room Error', '⚠️');
        if (data.code === 'INVALID_PASSWORD' || data.code === 'PASSWORD_REQUIRED') {
          showChamberPasswordModal(roomId);
        } else if (data.code === 'ROOM_FULL') {
          showChamberFullModal(roomId);
        } else if (data.code === 'ROOM_NOT_FOUND') {
          showChamberNotFoundModal(roomId);
        }
        return;
      }

      if (data.type === 'room_status') {
        state.participantCount = data.count || 1;
        logDebug(`Room participants count: ${state.participantCount}`, 'info');
        updateParticipantUI();
      } else if (data.type === 'peer_joined') {
        state.participantCount = 2;
        state.remoteNick = data.remoteNick || 'Friend';
        if (elements.remoteNickDisplay) {
          elements.remoteNickDisplay.textContent = state.remoteNick;
        }
        updateParticipantUI();
        showToast(`${state.remoteNick} joined the room!`, '👥');

        if (data.isInitiator) {
          if (!state.peerConnection) startWebRTC();
          // Wait up to 3 seconds if local camera is currently requesting permission
          if (!state.localStream && state.localMediaPromise) {
            logDebug('Waiting for local camera initialization before creating offer...', 'info');
            await Promise.race([state.localMediaPromise, new Promise(r => setTimeout(r, 3000))]);
          }
          await initiateNegotiation();
        }
      } else if (data.type === 'offer') {
        logDebug('Received WebRTC offer', 'info');
        if (!state.peerConnection) startWebRTC();

        // Wait up to 3 seconds if local camera is initializing so answer includes our tracks
        if (!state.localStream && state.localMediaPromise) {
          logDebug('Waiting for local camera initialization before answer...', 'info');
          await Promise.race([state.localMediaPromise, new Promise(r => setTimeout(r, 3000))]);
        }

        // Attach local tracks before answering so remote peer receives our video
        if (state.localStream && state.peerConnection) {
          const senders = state.peerConnection.getSenders();
          state.localStream.getTracks().forEach(track => {
            if (!senders.some(s => s.track && s.track.id === track.id)) {
              try {
                state.peerConnection.addTrack(track, state.localStream);
                logDebug('Attached local track before answering.', 'info');
              } catch (e) {}
            }
          });
        }

        await state.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

        // Flush queued ICE candidates
        while (state.iceCandidateQueue && state.iceCandidateQueue.length > 0) {
          const cand = state.iceCandidateQueue.shift();
          try {
            await state.peerConnection.addIceCandidate(new RTCIceCandidate(cand));
          } catch (e) {
            logDebug(`Error applying queued ICE candidate: ${e.message}`, 'warn');
          }
        }

        const answer = await state.peerConnection.createAnswer();
        await state.peerConnection.setLocalDescription(answer);
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
          state.ws.send(JSON.stringify({ type: 'answer', answer: answer }));
          logDebug('Dispatched WebRTC answer.', 'success');
        }
      } else if (data.type === 'answer') {
        logDebug('Received WebRTC answer', 'info');
        if (state.peerConnection) {
          await state.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          // Flush queued ICE candidates
          while (state.iceCandidateQueue && state.iceCandidateQueue.length > 0) {
            const cand = state.iceCandidateQueue.shift();
            try {
              await state.peerConnection.addIceCandidate(new RTCIceCandidate(cand));
            } catch (e) {
              logDebug(`Error applying queued ICE candidate: ${e.message}`, 'warn');
            }
          }
        }
      } else if (data.type === 'ice-candidate') {
        if (data.candidate) {
          if (state.peerConnection && state.peerConnection.remoteDescription && state.peerConnection.remoteDescription.type) {
            try {
              await state.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
              logDebug(`Error adding ICE candidate: ${e.message}`, 'warn');
            }
          } else {
            state.iceCandidateQueue.push(data.candidate);
          }
        }
      } else if (data.type === 'peer_left') {
        logDebug('Peer left the room.', 'warn');
        state.participantCount = 1;
        state.remoteStream = null;
        state.iceCandidateQueue = [];
        if (elements.remoteVideo) elements.remoteVideo.srcObject = null;
        if (elements.remoteNickDisplay) {
          elements.remoteNickDisplay.textContent = 'WAITING FOR FRIEND';
        }
        if (state.peerConnection) {
          try { state.peerConnection.close(); } catch (e) {}
          state.peerConnection = null;
        }
        if (state.isCapturing) {
          abortCaptureSequence();
        }
        updateParticipantUI();
        showToast(`${data.nick || 'Friend'} disconnected. Waiting for reconnection...`, '⚠️');
      } else if (data.type === 'action_start_shoot') {
        logDebug('Friend started photo sequence!', 'success');
        const targetStartTime = data.targetStartTime || Date.now();
        const waitMs = Math.max(0, targetStartTime - Date.now());
        setTimeout(() => {
          startMultiShotSequence(false);
        }, waitMs);
      } else if (data.type === 'update_nick') {
        state.remoteNick = data.nick || 'Friend';
        if (elements.remoteNickDisplay) {
          elements.remoteNickDisplay.textContent = state.remoteNick;
        }
        showToast(`Friend updated their name to "${state.remoteNick}"`, '👤');
      }
    } catch (err) {
      logDebug(`Error processing WS message: ${err.message}`, 'error');
    }
  };

  state.ws.onerror = () => {
    logDebug('WebSocket connection error.', 'error');
    updateConnectionStatus('WS Error', 'bg-rose-400');
  };

  state.ws.onclose = () => {
    logDebug('WebSocket closed.', 'warn');
    state.isInRoom = false;
    state.participantCount = 1;
    if (elements.debugWsStatus) {
      elements.debugWsStatus.textContent = 'DISCONNECTED';
      elements.debugWsStatus.className = 'font-semibold text-rose-400';
    }
    updateConnectionStatus('Offline', 'bg-neutral-500');
    updateParticipantUI();
  };
}

function attachLocalTracksToPeer() {
  if (!state.peerConnection || !state.localStream) return false;
  let added = false;
  const senders = state.peerConnection.getSenders();
  state.localStream.getTracks().forEach(track => {
    const exists = senders.some(s => s.track && s.track.id === track.id);
    if (!exists) {
      try {
        state.peerConnection.addTrack(track, state.localStream);
        added = true;
        logDebug(`Attached local track (${track.kind}) to peer connection.`, 'info');
      } catch (e) {
        logDebug(`Error adding track to peer connection: ${e.message}`, 'warn');
      }
    }
  });

  // If new tracks were added after the connection was already established, trigger renegotiation!
  if (added && state.isInRoom && state.ws && state.ws.readyState === WebSocket.OPEN) {
    if (state.peerConnection.signalingState === 'stable') {
      logDebug('Renegotiating WebRTC session with newly added tracks...', 'info');
      initiateNegotiation();
    }
  }
  return added;
}

async function initiateNegotiation() {
  if (!state.peerConnection || !state.ws || state.ws.readyState !== WebSocket.OPEN) return;
  try {
    // Ensure all local stream tracks are attached before creating offer
    if (state.localStream) {
      const senders = state.peerConnection.getSenders();
      state.localStream.getTracks().forEach(track => {
        if (!senders.some(s => s.track && s.track.id === track.id)) {
          try {
            state.peerConnection.addTrack(track, state.localStream);
          } catch (e) {}
        }
      });
    }

    logDebug('Creating WebRTC offer...', 'info');
    const offer = await state.peerConnection.createOffer();
    await state.peerConnection.setLocalDescription(offer);
    state.ws.send(JSON.stringify({ type: 'offer', offer: offer }));
    logDebug('WebRTC offer dispatched to partner.', 'success');
  } catch (e) {
    logDebug(`Error during offer negotiation: ${e.message}`, 'error');
  }
}

function startWebRTC() {
  logDebug('startWebRTC() initializing peer connection', 'info');
  state.iceCandidateQueue = [];

  if (elements.debugRtcStatus) {
    elements.debugRtcStatus.textContent = 'INITIALIZING';
    elements.debugRtcStatus.className = 'font-semibold text-amber-400';
  }

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' }
    ]
  };
  state.peerConnection = new RTCPeerConnection(configuration);

  if (state.localStream) {
    attachLocalTracksToPeer();
  }

  state.peerConnection.onicecandidate = (event) => {
    if (event.candidate && state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
    }
  };

  state.peerConnection.ontrack = (event) => {
    logDebug('Remote media track received from partner.', 'success');
    if (event.streams && event.streams[0]) {
      state.remoteStream = event.streams[0];
    } else {
      if (!state.remoteStream) {
        state.remoteStream = new MediaStream();
      }
      state.remoteStream.addTrack(event.track);
    }

    if (elements.remoteVideo) {
      elements.remoteVideo.srcObject = state.remoteStream;
      elements.remoteVideo.muted = true;
      elements.remoteVideo.playsInline = true;
      const playPromise = elements.remoteVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => logDebug('Remote play warning: ' + err.message, 'warn'));
      }
    }

    if (elements.remotePlaceholder) {
      elements.remotePlaceholder.classList.add('hidden');
    }
    if (elements.remoteStatusDot) {
      elements.remoteStatusDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
    }
    updateParticipantUI();

    event.track.onmute = () => {
      logDebug('Remote track muted.', 'warn');
    };
    event.track.onunmute = () => {
      logDebug('Remote track unmuted.', 'info');
      elements.remotePlaceholder?.classList.add('hidden');
      updateParticipantUI();
    };
    event.track.onended = () => {
      logDebug('Remote track ended.', 'warn');
      updateParticipantUI();
    };
  };

  state.peerConnection.onnegotiationneeded = async () => {
    logDebug('WebRTC negotiationneeded event triggered.', 'info');
    if (state.isInRoom && state.ws && state.ws.readyState === WebSocket.OPEN && state.peerConnection.signalingState === 'stable') {
      await initiateNegotiation();
    }
  };

  state.peerConnection.onconnectionstatechange = () => {
    const connState = state.peerConnection.connectionState;
    logDebug(`RTC Connection State: ${connState}`, 'info');
    if (elements.debugRtcStatus) {
      elements.debugRtcStatus.textContent = connState.toUpperCase();
      if (connState === 'connected') {
        elements.debugRtcStatus.className = 'font-semibold text-emerald-400';
      } else if (connState === 'failed') {
        elements.debugRtcStatus.className = 'font-semibold text-rose-400';
      }
    }
  };

  state.peerConnection.oniceconnectionstatechange = () => {
    if (elements.debugIceStatus) {
      elements.debugIceStatus.textContent = state.peerConnection.iceConnectionState.toUpperCase();
    }
  };
}

function abortCaptureSequence() {
  state.currentCaptureSessionId++;
  state.isCapturing = false;
  if (state.activeCountdownInterval) {
    clearInterval(state.activeCountdownInterval);
    state.activeCountdownInterval = null;
  }
  if (state.activeBreatherTimeout) {
    clearTimeout(state.activeBreatherTimeout);
    state.activeBreatherTimeout = null;
  }
  if (elements.countdownContainer) elements.countdownContainer.classList.add('hidden');
  if (elements.takePhotoBtn) elements.takePhotoBtn.disabled = false;
  if (elements.shotTrayCount) elements.shotTrayCount.textContent = 'SESSION CANCELLED';
  updateParticipantUI();
  showToast('Partner disconnected mid-session. Session aborted.', '⚠️');
}

// ==========================================
// 7. Local Media (Camera)
// ==========================================
async function startLocalMedia() {
  logDebug('Requesting local camera access...', 'info');
  state.localMediaPromise = (async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        logDebug('Camera API (mediaDevices) not available in this environment.', 'warn');
        if (elements.localPlaceholder) elements.localPlaceholder.classList.remove('hidden');
        return null;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      state.localStream = stream;
      if (elements.localVideo) {
        elements.localVideo.srcObject = stream;
        elements.localVideo.muted = true;
        elements.localVideo.playsInline = true;
        elements.localVideo.play().catch(() => {});
      }
      if (elements.localPlaceholder) {
        elements.localPlaceholder.classList.add('hidden');
      }
      logDebug('Local camera active.', 'success');

      // Attach tracks to active peer connection if already open
      attachLocalTracksToPeer();
      return stream;
    } catch (err) {
      logDebug(`Camera access error: ${err.message}`, 'error');
      if (elements.localPlaceholder) {
        elements.localPlaceholder.classList.remove('hidden');
      }
      showToast('Please allow camera access to take photos!', '📷');
      return null;
    }
  })();
  return state.localMediaPromise;
}

/** Manual camera toggle */
async function toggleCamera() {
  if (state.isCameraEnabled) {
    // Turn camera OFF
    state.isCameraEnabled = false;
    if (state.localStream) {
      state.localStream.getTracks().forEach(t => {
        t.enabled = false;
        t.stop();
      });
      state.localStream = null;
    }
    if (elements.localVideo) {
      elements.localVideo.srcObject = null;
    }
    if (elements.localPlaceholder) {
      elements.localPlaceholder.classList.remove('hidden');
    }
    if (elements.toggleCameraText) elements.toggleCameraText.textContent = 'CAMERA OFF';
    if (elements.toggleCameraIcon) elements.toggleCameraIcon.className = 'w-2 h-2 rounded-full bg-rose-500';
    showToast('Camera turned off', '📷');

    // Remove tracks from peer connection and renegotiate
    if (state.peerConnection) {
      state.peerConnection.getSenders().forEach(sender => {
        if (sender.track) {
          try { state.peerConnection.removeTrack(sender); } catch (e) {}
        }
      });
      if (state.isInRoom && state.ws && state.ws.readyState === WebSocket.OPEN && state.peerConnection.signalingState === 'stable') {
        initiateNegotiation();
      }
    }
  } else {
    // Turn camera ON
    state.isCameraEnabled = true;
    if (elements.toggleCameraText) elements.toggleCameraText.textContent = 'CAMERA ON';
    if (elements.toggleCameraIcon) elements.toggleCameraIcon.className = 'w-2 h-2 rounded-full bg-emerald-400';
    showToast('Turning camera on...', '📷');
    await startLocalMedia();
  }
}

// Grab an instantaneous frozen snapshot frame as an offscreen canvas
function grabFrame(videoElement) {
  if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) return null;
  if (typeof videoElement.readyState === 'number' && videoElement.readyState < 2) return null;
  const c = document.createElement('canvas');
  c.width = videoElement.videoWidth;
  c.height = videoElement.videoHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, c.width, c.height);
  return c;
}

// ==========================================
// 8. 4-Shot Sequential Capture Engine
// ==========================================
const SHOT_COUNT = 4;
const POSE_MESSAGES = [
  'Pose 1: Strike your first pose',
  'Pose 2: Change it up, strike a new pose',
  'Pose 3: Show some love, pose together',
  'Pose 4: Big final smile'
];

/**
 * Executes the full 4-shot photobooth sequence
 * 3s countdown -> snapshot 1 -> breather -> 3s countdown -> snapshot 2 ...
 * @param {boolean} isInitiator True if this client pressed the button
 */
async function startMultiShotSequence(isInitiator = true) {
  if (state.isCapturing) {
    logDebug('Capture already in progress.', 'warn');
    return;
  }

  // Ensure AudioContext is primed by user interaction
  getAudioContext();

  state.isCapturing = true;
  state.capturedShots = [];
  const sessionId = ++state.currentCaptureSessionId;

  // Notify peer if in a duo room and we are the initiator
  if (isInitiator && state.ws && state.ws.readyState === WebSocket.OPEN && state.participantCount >= 2) {
    logDebug('Broadcasting action_start_shoot to partner...', 'info');
    const targetStartTime = Date.now() + 600;
    state.ws.send(JSON.stringify({
      type: 'action_start_shoot',
      targetStartTime: targetStartTime
    }));
    await new Promise(r => setTimeout(r, 600));
    if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
      return;
    }
  }

  // Update UI to Capturing state
  if (elements.takePhotoBtn) elements.takePhotoBtn.disabled = true;
  if (elements.takePhotoBtnText) elements.takePhotoBtnText.textContent = 'SESSION IN PROGRESS...';
  if (elements.shotTrayCount) elements.shotTrayCount.textContent = 'CAPTURE IN PROGRESS...';

  // Reset mini thumbnails
  for (let i = 0; i < SHOT_COUNT; i++) {
    if (elements.thumbImgs[i]) {
      elements.thumbImgs[i].classList.add('hidden');
      elements.thumbImgs[i].src = '';
    }
    if (elements.thumbPlaceholders[i]) elements.thumbPlaceholders[i].classList.remove('hidden');
    if (elements.thumbSlots[i]) {
      elements.thumbSlots[i].classList.remove('border-y2k-blue', 'shadow-[0_0_15px_rgba(0,240,255,0.4)]');
      elements.thumbSlots[i].classList.add('border-y2k-blue/20');
    }
  }

  // Show countdown overlay
  if (elements.countdownContainer) elements.countdownContainer.classList.remove('hidden');

  // Loop through all 4 shots
  for (let shotIndex = 0; shotIndex < SHOT_COUNT; shotIndex++) {
    if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
      return;
    }

    await executeSingleShot(shotIndex, sessionId);

    if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
      return;
    }

    // Breather pause between shots (1.2 seconds) before next countdown
    if (shotIndex < SHOT_COUNT - 1) {
      await showBreatherPause(shotIndex, sessionId);
      if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
        return;
      }
    }
  }

  // All 4 shots captured!
  if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
    return;
  }

  if (elements.countdownContainer) elements.countdownContainer.classList.add('hidden');
  if (elements.shotTrayCount) elements.shotTrayCount.textContent = 'ALL 4 SHOTS READY! RENDERED';

  // Render the classic 4-cut photostrip
  renderPhotostrip();

  // Reset button state
  state.isCapturing = false;
  if (elements.takePhotoBtn) elements.takePhotoBtn.disabled = false;
  updateParticipantUI();
}

/**
 * Runs 3-2-1 countdown for a single shot and saves the frozen frames
 */
function executeSingleShot(shotIndex, sessionId) {
  return new Promise((resolve) => {
    if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
      resolve();
      return;
    }

    // Update badge and dots
    if (elements.countdownShotBadge) {
      elements.countdownShotBadge.textContent = `PHOTO ${shotIndex + 1} OF 4`;
    }
    if (elements.countdownMessage) {
      elements.countdownMessage.textContent = POSE_MESSAGES[shotIndex] || 'Strike a pose!';
    }
    updateCountdownDots(shotIndex);

    // Highlight current thumbnail slot
    if (elements.thumbSlots[shotIndex]) {
      elements.thumbSlots[shotIndex].classList.add('border-y2k-blue', 'shadow-[0_0_15px_rgba(0,240,255,0.4)]');
    }

    let count = 3;
    if (elements.countdownNumber) elements.countdownNumber.textContent = count;
    playCountdownBeep(false);

    if (state.activeCountdownInterval) {
      clearInterval(state.activeCountdownInterval);
    }

    state.activeCountdownInterval = setInterval(() => {
      if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
        clearInterval(state.activeCountdownInterval);
        state.activeCountdownInterval = null;
        resolve();
        return;
      }

      count--;
      if (count > 0) {
        if (elements.countdownNumber) elements.countdownNumber.textContent = count;
        playCountdownBeep(false);
      } else {
        clearInterval(state.activeCountdownInterval);
        state.activeCountdownInterval = null;

        // SNAP moment!
        if (elements.countdownNumber) elements.countdownNumber.textContent = 'SNAP';
        playCountdownBeep(true);
        triggerShutterAndSave(shotIndex);

        setTimeout(() => {
          resolve();
        }, 300);
      }
    }, 1000);
  });
}

/** Breather pause between shots */
function showBreatherPause(currentShotIndex, sessionId) {
  return new Promise((resolve) => {
    if (state.currentCaptureSessionId !== sessionId || !state.isCapturing) {
      resolve();
      return;
    }
    if (elements.countdownNumber) elements.countdownNumber.textContent = '•';
    if (elements.countdownMessage) {
      elements.countdownMessage.textContent = `Get ready for Photo ${currentShotIndex + 2}...`;
    }
    if (state.activeBreatherTimeout) {
      clearTimeout(state.activeBreatherTimeout);
    }
    state.activeBreatherTimeout = setTimeout(() => {
      state.activeBreatherTimeout = null;
      resolve();
    }, 1200);
  });
}

function updateCountdownDots(activeIndex) {
  if (!elements.countdownDots) return;
  const dots = elements.countdownDots.children;
  for (let i = 0; i < dots.length; i++) {
    if (i === activeIndex) {
      dots[i].className = 'w-3 h-3 rounded-full bg-y2k-blue shadow-[0_0_10px_#00F0FF] scale-125 transition-all';
    } else if (i < activeIndex) {
      dots[i].className = 'w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] transition-all';
    } else {
      dots[i].className = 'w-3 h-3 rounded-full bg-white/20 transition-all';
    }
  }
}

/** Trigger shutter flash effect, shutter sound, and freeze video frames */
function triggerShutterAndSave(shotIndex) {
  // Flash effect
  if (elements.flashOverlay) {
    elements.flashOverlay.classList.remove('opacity-0');
    elements.flashOverlay.classList.add('opacity-90');
    setTimeout(() => {
      elements.flashOverlay.classList.remove('opacity-90');
      elements.flashOverlay.classList.add('opacity-0');
    }, 150);
  }

  // Shutter audio
  playShutterSound();

  // Grab instantaneous frames
  const localSnap = grabFrame(elements.localVideo);
  const isDuo = state.isInRoom && state.participantCount >= 2 && elements.remoteVideo?.videoWidth;
  const remoteSnap = isDuo ? grabFrame(elements.remoteVideo) : null;

  state.capturedShots.push({
    local: localSnap,
    remote: remoteSnap,
    timestamp: Date.now()
  });

  // Update live mini thumbnail tray
  if (elements.thumbImgs[shotIndex]) {
    let thumbSource = localSnap;
    if (isDuo && localSnap && remoteSnap) {
      // Create a nice mini duo split thumbnail
      const tc = document.createElement('canvas');
      tc.width = 160;
      tc.height = 120;
      const tctx = tc.getContext('2d');
      drawCover(tctx, localSnap, 0, 0, 78, 120, true);
      tctx.fillStyle = '#00F0FF';
      tctx.fillRect(78, 0, 4, 120);
      drawCover(tctx, remoteSnap, 82, 0, 78, 120, false);
      thumbSource = tc;
    }
    if (thumbSource) {
      const thumbDataUrl = thumbSource.toDataURL('image/jpeg', 0.7);
      elements.thumbImgs[shotIndex].src = thumbDataUrl;
      elements.thumbImgs[shotIndex].classList.remove('hidden');
      if (elements.thumbPlaceholders[shotIndex]) {
        elements.thumbPlaceholders[shotIndex].classList.add('hidden');
      }
    }
  }
  if (elements.shotTrayCount) {
    elements.shotTrayCount.textContent = `${shotIndex + 1} OF 4 SHOTS READY`;
  }
  logDebug(`Captured Shot ${shotIndex + 1} of 4.`, 'success');
}

// ==========================================
// 9. Classic 4-Cut Photostrip Canvas Renderer
// ==========================================
/**
 * Helper to draw image onto canvas with cover aspect ratio & horizontal mirror
 */
function drawCover(ctx, sourceCanvas, dx, dy, dw, dh, mirror = true) {
  if (!sourceCanvas) return;
  const sw = sourceCanvas.width;
  const sh = sourceCanvas.height;
  if (!sw || !sh) return;

  const targetRatio = dw / dh;
  const sourceRatio = sw / sh;
  let sx, sy, sCropW, sCropH;

  if (sourceRatio > targetRatio) {
    sCropH = sh;
    sCropW = Math.round(sh * targetRatio);
    sx = Math.round((sw - sCropW) / 2);
    sy = 0;
  } else {
    sCropW = sw;
    sCropH = Math.round(sw / targetRatio);
    sx = 0;
    sy = Math.round((sh - sCropH) / 2);
  }

  ctx.save();
  if (mirror) {
    ctx.translate(dx + dw, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(sourceCanvas, sx, sy, sCropW, sCropH, 0, 0, dw, dh);
  } else {
    ctx.drawImage(sourceCanvas, sx, sy, sCropW, sCropH, dx, dy, dw, dh);
  }
  ctx.restore();
}

/** Theme Palette Definitions */
const THEMES = {
  cyber: {
    bg: '#080C1A',
    cardBg: '#020612',
    border: '#00F0FF',
    innerBorder: 'rgba(0, 240, 255, 0.4)',
    titleColor: '#FFFFFF',
    subColor: '#8B9BB4',
    accentColor: '#00F0FF',
    font: "'Fragile Bombers', 'Hooey Demo', monospace",
    subFont: 'Granix, sans-serif',
  },
  classic: {
    bg: '#FAF9F6',
    cardBg: '#111111',
    border: '#E2E8F0',
    innerBorder: 'rgba(0, 0, 0, 0.08)',
    titleColor: '#0F172A',
    subColor: '#64748B',
    accentColor: '#0F172A',
    font: 'sans-serif',
  },
  sepia: {
    bg: '#F5ECE1',
    cardBg: '#2D2015',
    border: '#D8C3A5',
    innerBorder: 'rgba(110, 80, 50, 0.2)',
    titleColor: '#4A3324',
    subColor: '#8C6D58',
    accentColor: '#B85D19',
    font: 'serif',
  },
  neon: {
    bg: '#04101E',
    cardBg: '#010811',
    border: '#00F0FF',
    innerBorder: 'rgba(0, 240, 255, 0.6)',
    titleColor: '#00F0FF',
    subColor: '#5EEAD4',
    accentColor: '#38BDF8',
    font: 'monospace',
  }
};

/**
 * Draws decorative retro photobooth barcode
 */
function drawBarcode(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  const barCount = 38;
  const barWidth = width / barCount;
  let currentX = x;
  const pattern = [1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1];
  for (let i = 0; i < pattern.length && currentX < x + width; i++) {
    const w = pattern[i] * (barWidth * 0.4);
    if (i % 2 === 0) {
      ctx.fillRect(currentX, y, Math.min(w, x + width - currentX), height);
    }
    currentX += w + 2;
  }
}

/**
 * Main Photostrip Rendering Function
 * Generates the authentic 4-cut vertical strip on canvas
 */
function renderPhotostrip() {
  const canvas = elements.photostripCanvas;
  if (!canvas) return;

  const isDuo = state.isInRoom && state.participantCount >= 2;
  const theme = THEMES[state.selectedTheme] || THEMES.cyber;

  // Canvas Geometry
  const stripWidth = 600;
  const stripHeight = 1860;
  canvas.width = stripWidth;
  canvas.height = stripHeight;
  const ctx = canvas.getContext('2d');

  // 1. Draw Strip Background
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, stripWidth, stripHeight);

  // Decorative border around the strip
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, stripWidth - 24, stripHeight - 24);

  // Subtle outer edge notches (retro analog photobooth paper effect)
  ctx.fillStyle = theme.accentColor;
  for (let ny = 60; ny < stripHeight - 60; ny += 120) {
    ctx.fillRect(4, ny, 5, 12);
    ctx.fillRect(stripWidth - 9, ny, 5, 12);
  }

  // 2. Header
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.titleColor;
  ctx.font = `bold 28px ${theme.font}`;
  ctx.fillText('★  OPENBOOTH  ★', stripWidth / 2, 54);

  ctx.fillStyle = theme.subColor;
  ctx.font = `12px ${theme.subFont || theme.font}`;
  ctx.fillText('ONLINE PHOTO BOOTH  •  4-SHOT PHOTO STRIP', stripWidth / 2, 78);

  // 3. 4 Photo Frames Layout
  const frameX = 40;
  const frameWidth = 520;
  const frameHeight = 380;
  const startY = 100;
  const frameSpacing = 24;

  for (let i = 0; i < 4; i++) {
    const frameY = startY + i * (frameHeight + frameSpacing);
    const shot = state.capturedShots[i];

    // Background card for frame
    ctx.fillStyle = theme.cardBg;
    ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

    // Frame border
    ctx.strokeStyle = theme.innerBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

    if (isDuo && shot?.remote && state.duoLayout === 'dual') {
      // DUO ALTERNATING FULL-FRAME LAYOUT:
      // Even frames (0, 2): Local Pilot; Odd frames (1, 3): Remote Partner
      const isLocalPose = (i % 2 === 0);
      const activeSource = isLocalPose ? shot.local : shot.remote;
      const activeNick = isLocalPose ? (state.localNick || 'YOU') : (state.remoteNick || 'PARTNER');
      const shouldMirror = isLocalPose;

      if (activeSource) {
        drawCover(ctx, activeSource, frameX, frameY, frameWidth, frameHeight, shouldMirror);
      } else {
        ctx.fillStyle = '#1A202C';
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
      }

      // Dynamic Participant Badge
      ctx.font = 'bold 9px monospace';
      const badgeText = activeNick.toUpperCase();
      const badgeW = Math.max(42, ctx.measureText(badgeText).width + 14);
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(frameX + 6, frameY + frameHeight - 22, badgeW, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText(badgeText, frameX + 12, frameY + frameHeight - 10);
    } else if (isDuo && shot?.remote) {
      // DUO SPLIT SIDE-BY-SIDE LAYOUT (Default Duo)
      const halfWidth = (frameWidth - 8) / 2; // 256px each with 8px divider

      // Left Half: Local User (Mirrored)
      if (shot?.local) {
        drawCover(ctx, shot.local, frameX, frameY, halfWidth, frameHeight, true);
      }
      // Divider
      ctx.fillStyle = theme.border;
      ctx.fillRect(frameX + halfWidth, frameY, 8, frameHeight);

      // Right Half: Remote Partner (Unmirrored natural view)
      if (shot?.remote) {
        drawCover(ctx, shot.remote, frameX + halfWidth + 8, frameY, halfWidth, frameHeight, false);
      }

      // Dynamic participant badges in corners
      ctx.font = 'bold 9px monospace';
      const leftText = (state.localNick || 'YOU').toUpperCase();
      const rightText = (state.remoteNick || 'PARTNER').toUpperCase();
      const leftW = Math.max(36, ctx.measureText(leftText).width + 12);
      const rightW = Math.max(36, ctx.measureText(rightText).width + 12);

      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(frameX + 6, frameY + frameHeight - 22, leftW, 16);
      ctx.fillRect(frameX + frameWidth - rightW - 6, frameY + frameHeight - 22, rightW, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText(leftText, frameX + 12, frameY + frameHeight - 10);
      ctx.fillText(rightText, frameX + frameWidth - rightW, frameY + frameHeight - 10);
    } else {
      // SOLO MODE: 1 Person fills the entire 520x380 frame
      if (shot?.local) {
        drawCover(ctx, shot.local, frameX, frameY, frameWidth, frameHeight, true);
      } else {
        // Fallback if camera stream wasn't ready
        ctx.fillStyle = '#1A202C';
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
        ctx.fillStyle = theme.subColor;
        ctx.font = `14px ${theme.font}`;
        ctx.textAlign = 'center';
        ctx.fillText(`[ Pose 0${i + 1} Memory Frame ]`, frameX + frameWidth / 2, frameY + frameHeight / 2);
      }
    }

    // Corner Pose Stamp: "01", "02", "03", "04"
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(frameX + 6, frameY + 6, 32, 20);
    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`0${i + 1}`, frameX + 22, frameY + 20);
  }

  // 4. Footer & Timestamp
  const footerY = startY + 4 * (frameHeight + frameSpacing) + 12; // ~1730px
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const roomTag = state.roomId ? `ROOM #${state.roomId}` : 'SOLO SESSION';

  ctx.textAlign = 'center';
  ctx.fillStyle = theme.titleColor;
  ctx.font = `bold 14px ${theme.font}`;
  ctx.fillText(`${dateStr}  •  ${timeStr}`, stripWidth / 2, footerY + 16);

  ctx.fillStyle = theme.subColor;
  ctx.font = `11px monospace`;
  ctx.fillText(`${roomTag}  •  OPENBOOTH SOUVENIR`, stripWidth / 2, footerY + 36);

  // Decorative barcode at bottom
  drawBarcode(ctx, 160, footerY + 48, 280, 24, theme.accentColor);

  ctx.fillStyle = theme.subColor;
  ctx.font = '9px monospace';
  ctx.fillText('100% PRIVATE  •  CAPTURED DIRECTLY ON YOUR DEVICE', stripWidth / 2, footerY + 86);

  // 5. Update Preview & Show Result Section
  const dataUrl = canvas.toDataURL('image/png');
  if (elements.photostripPreview) {
    elements.photostripPreview.src = dataUrl;
  }
  if (elements.resultSubtitle) {
    elements.resultSubtitle.textContent = isDuo
      ? `Duo Session with ${state.remoteNick || 'Friend'} • Room #${state.roomId || 'DUO'}`
      : `Solo Photobooth • 4 Poses • ${dateStr}`;
  }
  if (elements.resultSection) {
    elements.resultSection.classList.remove('hidden');
    elements.resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  logDebug('Photostrip rendering completed successfully.', 'success');
}

// ==========================================
// 10. Event Listeners Setup
// ==========================================
let _nickSaveTimer = null;
function debouncedSaveNick(value) {
  clearTimeout(_nickSaveTimer);
  _nickSaveTimer = setTimeout(() => saveNickname(value, false), 300);
}

function setupEventListeners() {
  elements.pilotNickInput?.addEventListener('input', (e) => {
    debouncedSaveNick(e.target.value);
  });

  elements.pilotNickInput?.addEventListener('blur', (e) => {
    clearTimeout(_nickSaveTimer);
    saveNickname(e.target.value, false);
  });

  elements.pilotNickInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveNickname(e.target.value, false);
      e.target.blur();
    }
  });

  // Clickable in-booth nickname badge
  const localNickBadge = document.getElementById('localNickBadge');
  localNickBadge?.addEventListener('click', () => {
    const current = (state.localNick && state.localNick !== 'You') ? state.localNick : '';
    const newName = window.prompt('Enter your name:', current);
    if (newName !== null) {
      const clean = newName.trim().slice(0, 24);
      saveNickname(clean, true);
      showToast(`Name updated to "${state.localNick}"`, '👤');
      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify({
          type: 'update_nick',
          nick: state.localNick
        }));
      }
    }
  });

  // Re-roll random room code button
  elements.rollCodeBtn?.addEventListener('click', () => {
    rollRandomCode();
  });

  // Room password lock checkbox toggle
  elements.createLockCheckbox?.addEventListener('change', (e) => {
    if (elements.createPasswordInput) {
      elements.createPasswordInput.classList.toggle('hidden', !e.target.checked);
      if (e.target.checked) {
        elements.createPasswordInput.focus();
      }
    }
  });

  // Create Room button
  elements.createChamberBtn?.addEventListener('click', () => {
    handleCreateChamber();
  });

  // Join Room button
  elements.joinChamberBtn?.addEventListener('click', () => {
    handleJoinChamber();
  });

  // Enter key on Join Code input
  elements.joinCodeInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleJoinChamber();
    }
  });

  // Enter key on Join Password input
  elements.joinPasswordInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleJoinChamber();
    }
  });

  // Reconnect banner buttons
  elements.reconnectAcceptBtn?.addEventListener('click', () => {
    const storedRoom = getStoredRoom();
    if (storedRoom) {
      handleJoinChamber(storedRoom, null);
    }
  });

  elements.reconnectDismissBtn?.addEventListener('click', () => {
    clearStoredRoom();
    elements.reconnectBanner?.classList.add('hidden');
  });

  // Header Logo click -> Returns to Home
  elements.headerLogoLink?.addEventListener('click', () => {
    if (state.isInRoom) {
      if (confirm('Leave current room and return home?')) {
        leaveChamber();
      }
    } else {
      showLandingView();
    }
  });

  // Disconnect button
  elements.disconnectBtn?.addEventListener('click', () => {
    leaveChamber();
  });

  // Modal event listeners
  elements.modalReturnLobbyBtn?.addEventListener('click', () => {
    hideAllModals();
    showLandingView();
  });

  elements.modalFullLobbyBtn?.addEventListener('click', () => {
    hideAllModals();
    showLandingView();
  });

  elements.modalCreateRoomInsteadBtn?.addEventListener('click', () => {
    hideAllModals();
    const candidateCode = state.pendingRoomId;
    if (candidateCode) {
      if (elements.generatedCodePreview) elements.generatedCodePreview.textContent = candidateCode;
    }
    handleCreateChamber();
  });

  elements.modalPasswordCancelBtn?.addEventListener('click', () => {
    hideAllModals();
    showLandingView();
  });

  elements.modalPasswordSubmitBtn?.addEventListener('click', () => {
    const pwd = elements.modalPasswordInput?.value.trim();
    if (!pwd) {
      if (elements.modalPasswordError) {
        elements.modalPasswordError.textContent = 'Please enter a password.';
        elements.modalPasswordError.classList.remove('hidden');
      }
      return;
    }
    if (state.pendingRoomId) {
      handleJoinChamber(state.pendingRoomId, pwd);
    }
  });

  elements.modalPasswordInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      elements.modalPasswordSubmitBtn?.click();
    }
  });

  elements.modalNickCancelBtn?.addEventListener('click', () => {
    hideAllModals();
    showLandingView(true);
  });

  elements.modalNickSubmitBtn?.addEventListener('click', () => {
    const nick = elements.modalNickInput?.value.trim();
    if (nick) {
      saveNickname(nick, true);
    }
    hideAllModals();
    if (state.pendingRoomId) {
      handleJoinChamber(state.pendingRoomId, null);
    }
  });

  elements.modalNickInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      elements.modalNickSubmitBtn?.click();
    }
  });

  // Global Escape key listener to dismiss top-level modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!elements.legalModal?.classList.contains('hidden')) {
        hideLegalModal();
      } else if (!elements.chamberNickModal?.classList.contains('hidden')) {
        hideAllModals();
        showLandingView(true);
      } else if (!elements.chamberPasswordModal?.classList.contains('hidden')) {
        hideAllModals();
        showLandingView(true);
      } else if (!elements.chamberNotFoundModal?.classList.contains('hidden')) {
        hideAllModals();
        showLandingView(true);
      } else if (!elements.chamberFullModal?.classList.contains('hidden')) {
        hideAllModals();
        showLandingView(true);
      }
    }
  });

  // Copy buttons
  elements.copyInviteLinkBtn?.addEventListener('click', copyInviteLink);
  elements.invitePartnerCardBtn?.addEventListener('click', copyInviteLink);

  // Enable camera button
  elements.enableCameraBtn?.addEventListener('click', () => {
    state.isCameraEnabled = true;
    if (elements.toggleCameraText) elements.toggleCameraText.textContent = 'CAMERA ON';
    if (elements.toggleCameraIcon) elements.toggleCameraIcon.className = 'w-2 h-2 rounded-full bg-emerald-400';
    startLocalMedia();
  });

  // Toggle camera button
  elements.toggleCameraBtn?.addEventListener('click', toggleCamera);

  // Start Photobooth capture button
  elements.takePhotoBtn?.addEventListener('click', () => {
    if (!state.localStream) {
      showToast('Camera must be active to take photos!', '📷');
      startLocalMedia();
      return;
    }
    startMultiShotSequence(true);
  });

  // Download Photostrip PNG
  elements.downloadStripBtn?.addEventListener('click', () => {
    if (!elements.photostripCanvas) return;
    const filenameCode = state.roomId || 'solo';
    const filename = `openbooth-${filenameCode}-${Date.now()}.png`;

    elements.photostripCanvas.toBlob(async (blob) => {
      if (!blob) {
        showToast('Error generating image file.', '⚠️');
        return;
      }

      // Check if Web Share API with files is supported (iOS / mobile devices)
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'OpenBooth Keepsake',
            text: 'Our OpenBooth Photostrip!'
          });
          showToast('Photostrip shared successfully!', '💖');
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      // Standard desktop / browser blob download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      showToast('Photostrip PNG saved to downloads!', '💾');
    }, 'image/png');
  });

  // Retake button
  elements.retakePhotosBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Ready for a new photobooth session!', '🔄');
  });

  // Close preview button
  elements.closePreviewBtn?.addEventListener('click', () => {
    elements.resultSection?.classList.add('hidden');
  });

  // Theme selector buttons
  if (elements.themeSelectorContainer) {
    const themeButtons = elements.themeSelectorContainer.querySelectorAll('button[data-theme]');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        if (theme && THEMES[theme]) {
          state.selectedTheme = theme;
          themeButtons.forEach(b => {
            b.className = 'theme-btn px-3 py-2 rounded-xl text-xs font-semibold bg-transparent text-white border border-white/20 hover:border-cyan-400 transition-all text-center cursor-pointer';
          });
          btn.className = 'theme-btn px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-cyan-300 border border-cyan-400 transition-all text-center cursor-pointer';
          if (state.capturedShots.length > 0) {
            renderPhotostrip();
          }
        }
      });
    });
  }

  // Duo layout toggle buttons
  elements.layoutSplitBtn?.addEventListener('click', () => {
    state.duoLayout = 'split';
    elements.layoutSplitBtn.className = 'px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-cyan-300 border border-cyan-400 transition-all text-center cursor-pointer';
    elements.layoutDualBtn.className = 'px-3 py-2 rounded-xl text-xs font-semibold bg-transparent text-white border border-white/20 hover:border-cyan-400 transition-all text-center cursor-pointer';
    if (state.capturedShots.length > 0) renderPhotostrip();
  });

  elements.layoutDualBtn?.addEventListener('click', () => {
    state.duoLayout = 'dual';
    elements.layoutDualBtn.className = 'px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-cyan-300 border border-cyan-400 transition-all text-center cursor-pointer';
    elements.layoutSplitBtn.className = 'px-3 py-2 rounded-xl text-xs font-semibold bg-transparent text-white border border-white/20 hover:border-cyan-400 transition-all text-center cursor-pointer';
    if (state.capturedShots.length > 0) renderPhotostrip();
  });

  // Toggle diagnostics panel
  elements.toggleDebuggerBtn?.addEventListener('click', () => {
    state.isDebuggerCollapsed = !state.isDebuggerCollapsed;
    if (elements.debuggerBody) {
      elements.debuggerBody.classList.toggle('hidden', state.isDebuggerCollapsed);
    }
  });

  // Clear logs
  elements.clearLogsBtn?.addEventListener('click', clearDebugLogs);

  // Legal Modal Triggers & Controls
  elements.openPrivacyModalBtn?.addEventListener('click', () => {
    showLegalModal('privacy');
  });

  elements.openTermsModalBtn?.addEventListener('click', () => {
    showLegalModal('terms');
  });

  elements.closeLegalModalBtn?.addEventListener('click', () => {
    hideLegalModal();
  });

  elements.legalModalDoneBtn?.addEventListener('click', () => {
    hideLegalModal();
  });

  elements.tabPrivacyBtn?.addEventListener('click', () => {
    switchLegalTab('privacy');
  });

  elements.tabTermsBtn?.addEventListener('click', () => {
    switchLegalTab('terms');
  });

  elements.legalModal?.addEventListener('click', (e) => {
    if (e.target === elements.legalModal) {
      hideLegalModal();
    }
  });

  // Purge Local Nick & Chamber Session Data
  elements.clearLocalDataBtn?.addEventListener('click', () => {
    clearLocalData();
  });

  // Storage Transparency Notice Banner Controls
  elements.dismissStorageNoticeBtn?.addEventListener('click', () => {
    dismissStorageNotice();
  });

  elements.ackStorageNoticeBtn?.addEventListener('click', () => {
    ackStorageNotice();
  });
}

// ==========================================
// 11. Direct Link & Auto-Join Resolution
// ==========================================
async function checkDirectUrlOrStoredSession() {
  const pathname = (window.location.pathname || '').toLowerCase();
  const hash = window.location.hash;

  if (pathname.includes('/privacy') || hash === '#privacy') {
    showLandingView(false);
    showLegalModal('privacy');
    checkStorageNotice();
    return;
  }
  if (pathname.includes('/terms') || hash === '#terms') {
    showLandingView(false);
    showLegalModal('terms');
    checkStorageNotice();
    return;
  }

  const pathMatch = window.location.pathname.match(/\/room\/([A-Za-z0-9_-]+)/i);
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get('room') || (pathMatch ? pathMatch[1] : null);

  if (roomFromUrl && roomFromUrl.trim()) {
    const cleanRoom = roomFromUrl.trim().toUpperCase();
    const storedNick = getStoredNickname();
    if (storedNick) {
      saveNickname(storedNick, true);
    }
    // Auto-join the room directly and immediately
    handleJoinChamber(cleanRoom, null);
    checkStorageNotice();
    return;
  }

  // If no room in URL, show default Landing View
  showLandingView(false);
  checkStorageNotice();
}

function handlePopState() {
  const pathname = (window.location.pathname || '').toLowerCase();
  const pathMatch = window.location.pathname.match(/\/room\/([A-Za-z0-9_-]+)/i);

  if (pathMatch) {
    const roomCode = pathMatch[1].toUpperCase();
    if (state.roomId !== roomCode) {
      handleJoinChamber(roomCode, null);
    }
  } else if (pathname.includes('/privacy')) {
    showLegalModal('privacy');
  } else if (pathname.includes('/terms')) {
    showLegalModal('terms');
  } else {
    if (state.isInRoom) {
      leaveChamber();
    } else {
      hideAllModals();
      showLandingView(false);
    }
  }
}

// ==========================================
// 12. Initialization
// ==========================================
function initApp() {
  logDebug('OpenBooth application initializing...', 'info');

  // Setup mobile Web Audio unlock gesture
  setupAudioUnlock();

  // Load and apply stored nickname if user previously set one
  const savedNick = getStoredNickname();
  if (savedNick) {
    saveNickname(savedNick, true);
  } else {
    state.localNick = 'You';
    if (elements.pilotNickInput) elements.pilotNickInput.value = '';
    if (elements.localNickDisplay) elements.localNickDisplay.textContent = 'YOU';
  }

  // Setup UI event handlers
  setupEventListeners();

  // Listen for browser back / forward navigation
  window.addEventListener('popstate', handlePopState);

  // Resolve direct URL /room/{code}, legal routes, or active session
  checkDirectUrlOrStoredSession();

  // Ensure remote video listeners unhide the view as soon as frames arrive
  if (elements.remoteVideo) {
    elements.remoteVideo.addEventListener('loadedmetadata', () => {
      elements.remotePlaceholder?.classList.add('hidden');
      elements.remoteVideo.play().catch(() => {});
      updateParticipantUI();
    });
    elements.remoteVideo.addEventListener('playing', () => {
      elements.remotePlaceholder?.classList.add('hidden');
      if (elements.remoteStatusDot) elements.remoteStatusDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
      updateParticipantUI();
    });
  }

  // Cleanup hardware resources on page unload
  window.addEventListener('beforeunload', () => {
    if (state.localStream) {
      state.localStream.getTracks().forEach(t => t.stop());
    }
    if (state.ws) {
      try { state.ws.close(); } catch (e) {}
    }
    if (state.peerConnection) {
      try { state.peerConnection.close(); } catch (e) {}
    }
  });
}

// Boot up once DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
