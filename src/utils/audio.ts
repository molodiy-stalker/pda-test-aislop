// Web Audio API Synthesizer for S.T.A.L.K.E.R. 2 PDA sound effects

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

/**
 * Tactical mechanical click on button/item press
 */
export function playPdaClick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(850, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}

/**
 * High-tech PDA tab switch chime (Q / E keys)
 */
export function playPdaTabSwitch() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Dual tone chirp
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'square';

  osc1.frequency.setValueAtTime(1200, now);
  osc1.frequency.exponentialRampToValueAtTime(1800, now + 0.06);

  osc2.frequency.setValueAtTime(600, now);
  osc2.frequency.exponentialRampToValueAtTime(900, now + 0.06);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.07);
  osc2.stop(now + 0.07);
}

/**
 * Sonar ping when placing or selecting a map marker
 */
export function playMarkerPing() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1560, now);
  osc.frequency.setValueAtTime(1180, now + 0.04);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

/**
 * Geiger counter radiation crackle
 */
export function playGeigerCrackle() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.015; // 15ms burst
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3200, now);
  filter.Q.setValueAtTime(3, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
}

/**
 * Upgrade install ratchet / wrench sound
 */
export function playUpgradeSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(350, now);
  osc.frequency.linearRampToValueAtTime(580, now + 0.08);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

/**
 * Tactical steel bolt throw sound
 */
export function playBoltThrow() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}

/**
 * Anomaly trigger & energetic discharge explosion
 */
export function playAnomalyDischarge(type: 'electro' | 'burner' | 'gravitational' | 'psi' = 'gravitational') {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === 'electro') {
    // Sharp electric arc snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  } else if (type === 'burner') {
    // Roaring heat blast
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.linearRampToValueAtTime(300, now + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  } else {
    // Gravitational vortex thud & warping distortion
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

/**
 * Echoing detector beep
 */
export function playDetectorBeep(freq = 1950) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Weapon workbench test firing shot
 */
export function playWeaponShot() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}

/**
 * Atmospheric Stalker acoustic guitar chord progression
 */
export function playCampfireGuitarChord(chordIndex = 0) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Authentic D-minor / A-minor Stalker campfire chords
  const chords = [
    [146.83, 220.0, 261.63, 329.63], // D minor
    [110.0, 164.81, 220.0, 261.63],  // A minor
    [130.81, 196.0, 246.94, 329.63], // C major
    [123.47, 185.0, 246.94, 311.13]  // B dim
  ];

  const notes = chords[chordIndex % chords.length];

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.04;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.12, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 1.2);
  });
}

// Local MP3 audio tracks uploaded for quest events
const LOCAL_AUDIO_TRACKS = {
  accepted: '/assets/aistudio/1_6efc6021.mp3',      // 1 прийнято
  accomplished: '/assets/aistudio/2_da8b9d7b.mp3',  // 2 виконано
  failed: '/assets/aistudio/3_92261911.mp3',        // 3 провалено
};

let currentAudioElem: HTMLAudioElement | null = null;

function playAudioTrack(trackUrl: string, fallbackSynth: () => void) {
  if (isMuted) return;

  if (typeof window !== 'undefined') {
    try {
      if (currentAudioElem) {
        currentAudioElem.pause();
        currentAudioElem.currentTime = 0;
      }

      const audio = new Audio(trackUrl);
      currentAudioElem = audio;
      audio.volume = 0.95;

      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('HTML5 Audio playback prevented, using synth fallback:', err);
          fallbackSynth();
        });
      }
      return;
    } catch (e) {
      console.warn('Failed to initialize Audio, falling back to Web Audio API:', e);
    }
  }

  fallbackSynth();
}

/**
 * S.T.A.L.K.E.R. 2 Mission Accepted audio (1_6efc6021.mp3)
 */
export function playMissionAcceptedSting() {
  playAudioTrack(LOCAL_AUDIO_TRACKS.accepted, () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const oscLow = ctx.createOscillator();
    const oscMid = ctx.createOscillator();
    const oscHigh = ctx.createOscillator();
    const gain = ctx.createGain();

    oscLow.type = 'sine';
    oscLow.frequency.setValueAtTime(110, now);
    oscLow.frequency.exponentialRampToValueAtTime(82.4, now + 1.2);

    oscMid.type = 'triangle';
    oscMid.frequency.setValueAtTime(220, now);
    oscMid.frequency.exponentialRampToValueAtTime(329.6, now + 0.8);

    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(659.25, now);
    oscHigh.frequency.exponentialRampToValueAtTime(880, now + 1.0);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    oscLow.connect(gain);
    oscMid.connect(gain);
    oscHigh.connect(gain);
    gain.connect(ctx.destination);

    oscLow.start(now);
    oscMid.start(now);
    oscHigh.start(now);

    oscLow.stop(now + 1.5);
    oscMid.stop(now + 1.5);
    oscHigh.stop(now + 1.5);
  });
}

/**
 * S.T.A.L.K.E.R. 2 Mission Accomplished audio (2_da8b9d7b.mp3)
 */
export function playMissionAccomplishedSting() {
  playAudioTrack(LOCAL_AUDIO_TRACKS.accomplished, () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(440, now);
    osc1.frequency.setValueAtTime(554.37, now + 0.15);
    osc1.frequency.setValueAtTime(659.25, now + 0.35);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 1.4);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220, now);
    osc2.frequency.setValueAtTime(277.18, now + 0.15);
    osc2.frequency.setValueAtTime(329.63, now + 0.35);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.6);
    osc2.stop(now + 1.6);
  });
}

/**
 * S.T.A.L.K.E.R. 2 Mission Failed audio (3_92261911.mp3)
 */
export function playMissionFailedSting() {
  playAudioTrack(LOCAL_AUDIO_TRACKS.failed, () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(185, now);
    osc1.frequency.exponentialRampToValueAtTime(92.5, now + 1.2);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(130.81, now);
    osc2.frequency.exponentialRampToValueAtTime(65.4, now + 1.2);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
  });
}

/**
 * Tactical radiation threshold alarm siren (urgent alternating frequencies)
 */
export function playRadiationAlarm() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // High-pitch dual alternating chirp
  [0, 0.12, 0.24, 0.36].forEach((offset, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(idx % 2 === 0 ? 1750 : 2200, now + offset);

    gain.gain.setValueAtTime(0.25, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + offset);
    osc.stop(now + offset + 0.09);
  });
}

/**
 * Mechanical keyboard key click for Linux terminal
 */
export function playKeyboardClack() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(700 + Math.random() * 200, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.025);
}

/**
 * Stalker PDA login / profile change boot chime
 */
export function playLoginChime() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [440, 554.37, 659.25, 880];

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.15, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.3);
  });
}

