
// Synthesizer canggih untuk efek suara dan musik latar belakang

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

export type MusicTrack = 'fun' | 'adventure' | 'chill';

// Preferences State
let sfxEnabled = true;
let musicEnabled = true;
let currentTrack: MusicTrack = 'fun';

// Load Settings from Storage on Init
const loadAudioSettings = () => {
  const storedSfx = localStorage.getItem('sfx_enabled');
  const storedMusic = localStorage.getItem('music_enabled');
  const storedTrack = localStorage.getItem('music_track');

  if (storedSfx !== null) sfxEnabled = storedSfx === 'true';
  if (storedMusic !== null) musicEnabled = storedMusic === 'true';
  if (storedTrack !== null) currentTrack = storedTrack as MusicTrack;
};
loadAudioSettings();

// Export setters for Settings Modal
export const setSFXEnabled = (enabled: boolean) => {
  sfxEnabled = enabled;
  localStorage.setItem('sfx_enabled', String(enabled));
};
export const setMusicEnabled = (enabled: boolean) => {
  musicEnabled = enabled;
  localStorage.setItem('music_enabled', String(enabled));
  if (!enabled) stopMusic();
  else if (music.difficulty) startMusic(music.difficulty);
};
export const setMusicTrack = (track: MusicTrack) => {
  currentTrack = track;
  localStorage.setItem('music_track', track);
  // Restart music to apply new track pattern if playing
  if (music.isPlaying) {
    stopMusic();
    startMusic(music.difficulty);
  }
};
export const getAudioState = () => ({ sfxEnabled, musicEnabled, currentTrack });


const getCtx = () => {
  if (!ctx) {
    ctx = new AudioContext();
    // Create White Noise Buffer for Hi-Hats/Snares
    const bufferSize = ctx.sampleRate * 2; // 2 seconds
    noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
  return ctx;
};

// --- Sound Effects (SFX) ---

export const playSound = (type: 'click' | 'correct' | 'wrong' | 'win' | 'lose' | 'hint' | 'lock') => {
  if (!sfxEnabled) return;

  const context = getCtx();
  if (context.state === 'suspended') {
    context.resume().catch(() => {});
  }

  const t = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  
  osc.connect(gain);
  gain.connect(context.destination);

  switch (type) {
    case 'click':
      // Woodblock sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
      break;

    case 'correct':
      // Happy coins
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.setValueAtTime(1200, t + 0.1);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
      
      const osc2 = context.createOscillator();
      const gain2 = context.createGain();
      osc2.connect(gain2);
      gain2.connect(context.destination);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1200, t);
      osc2.frequency.linearRampToValueAtTime(2000, t + 0.4);
      gain2.gain.setValueAtTime(0.1, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      osc2.start(t);
      osc2.stop(t + 0.4);
      break;

    case 'wrong':
      // Dull Error
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.linearRampToValueAtTime(50, t + 0.3);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
      break;
      
    case 'lose':
      // Sad Descending Slide (Wah-wah-wah)
      const loseNotes = [400, 350, 300, 250];
      loseNotes.forEach((freq, i) => {
        const o = context.createOscillator();
        const g = context.createGain();
        o.connect(g);
        g.connect(context.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + i * 0.4);
        o.frequency.linearRampToValueAtTime(freq - 20, t + i * 0.4 + 0.3);
        g.gain.setValueAtTime(0.2, t + i * 0.4);
        g.gain.linearRampToValueAtTime(0, t + i * 0.4 + 0.3);
        o.start(t + i * 0.4);
        o.stop(t + i * 0.4 + 0.4);
      });
      break;

    case 'hint':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.linearRampToValueAtTime(1600, t + 0.4);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
      break;
      
    case 'lock':
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
      break;

    case 'win':
      // Victory Fanfare (Celebratory)
      const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]; // C - E - G - C - G - C!
      notes.forEach((freq, i) => {
        const o = context.createOscillator();
        const g = context.createGain();
        o.connect(g);
        g.connect(context.destination);
        o.type = i === notes.length - 1 ? 'square' : 'triangle';
        o.frequency.value = freq;
        const duration = i === notes.length - 1 ? 0.8 : 0.2;
        g.gain.setValueAtTime(0.15, t + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + duration);
        o.start(t + i * 0.15);
        o.stop(t + i * 0.15 + duration);
      });
      break;
  }
};

// --- ENERGETIC BACKGROUND MUSIC ENGINE (Sequencer) ---

interface MusicState {
  isPlaying: boolean;
  difficulty: string;
  nextStepTime: number;
  currentStep: number;
  timerID: number | null;
}

let music: MusicState = {
  isPlaying: false,
  difficulty: 'easy',
  nextStepTime: 0,
  currentStep: 0,
  timerID: null
};

// --- Instruments ---

const playKick = (ctx: AudioContext, time: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
  gain.gain.setValueAtTime(0.6, time); 
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

  osc.start(time);
  osc.stop(time + 0.5);
};

const playHiHat = (ctx: AudioContext, time: number) => {
  if (!noiseBuffer) return;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 5000;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.1, time); 
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
  
  source.start(time);
  source.stop(time + 0.05);
};

const playBass = (ctx: AudioContext, time: number, freq: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(0.1, time);
  gain.gain.linearRampToValueAtTime(0, time + 0.2);
  
  osc.start(time);
  osc.stop(time + 0.2);
};

const playLead = (ctx: AudioContext, time: number, freq: number, type: OscillatorType = 'triangle') => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(0.05, time); 
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
  
  osc.start(time);
  osc.stop(time + 0.4);
};

// --- Composition Data (16 Steps Loop) ---
// Support multiple styles: Fun, Adventure, Chill

const MUSIC_PATTERNS: Record<MusicTrack, Record<string, any>> = {
  fun: {
    // Happy, Major Pentatonic
    easy: { bpm: 110, kickPattern: [1,0,0,0,1,0,0,0], leadType: 'sine', baseFreq: 523.25 },
    medium: { bpm: 130, kickPattern: [1,0,1,0,1,0,1,0], leadType: 'square', baseFreq: 440.0 },
    hard: { bpm: 150, kickPattern: [1,1,0,1,1,0,1,1], leadType: 'sawtooth', baseFreq: 587.33 }
  },
  adventure: {
    // Epic, Minor, Driving
    easy: { bpm: 100, kickPattern: [1,0,0,1,0,0,1,0], leadType: 'triangle', baseFreq: 440.0 },
    medium: { bpm: 125, kickPattern: [1,1,0,0,1,1,0,0], leadType: 'sawtooth', baseFreq: 392.0 },
    hard: { bpm: 145, kickPattern: [1,0,1,1,1,0,1,0], leadType: 'square', baseFreq: 293.66 }
  },
  chill: {
    // Slower, Smoother
    easy: { bpm: 80, kickPattern: [1,0,0,0,0,0,1,0], leadType: 'sine', baseFreq: 329.63 },
    medium: { bpm: 95, kickPattern: [1,0,0,1,0,0,0,0], leadType: 'triangle', baseFreq: 349.23 },
    hard: { bpm: 110, kickPattern: [1,0,1,0,0,1,0,0], leadType: 'sine', baseFreq: 392.00 }
  }
};

const scheduleStep = (difficulty: string, time: number) => {
  const ctx = getCtx();
  
  // Select Pattern based on current Track Setting
  const styleConfig = MUSIC_PATTERNS[currentTrack][difficulty] || MUSIC_PATTERNS['fun']['easy'];
  const step = music.currentStep % 16;
  const beatIndex = step % 8; // simplified pattern index

  // 1. Kick
  if (styleConfig.kickPattern[beatIndex]) playKick(ctx, time);

  // 2. Hat (Every offbeat)
  if (step % 2 !== 0) playHiHat(ctx, time);

  // 3. Bass (Root Note on beat 1 & 9)
  if (step === 0 || step === 8) playBass(ctx, time, styleConfig.baseFreq / 2);

  // 4. Lead (Simple Arp logic)
  if ([0, 3, 6, 9, 12].includes(step)) {
    // Generate a simple scale offset
    const scale = [1, 1.25, 1.5, 1.33, 1.5, 2]; // Major-ish intervals
    const note = styleConfig.baseFreq * scale[Math.floor(Math.random() * scale.length)];
    playLead(ctx, time, note, styleConfig.leadType);
  }

  music.currentStep++;
};

const sequencerLoop = () => {
  if (!musicEnabled) return;

  const ctx = getCtx();
  const styleConfig = MUSIC_PATTERNS[currentTrack][music.difficulty] || MUSIC_PATTERNS['fun']['easy'];
  const secondsPerStep = 60.0 / styleConfig.bpm / 4; // 16th notes
  const lookahead = 0.1;

  while (music.nextStepTime < ctx.currentTime + lookahead) {
    scheduleStep(music.difficulty, music.nextStepTime);
    music.nextStepTime += secondsPerStep;
  }
  
  music.timerID = window.setTimeout(sequencerLoop, 25);
};

export const startMusic = (difficulty: string) => {
  if (!musicEnabled) return;
  if (music.isPlaying && music.difficulty === difficulty) return;
  
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  if (music.isPlaying) stopMusic();

  music.isPlaying = true;
  music.difficulty = difficulty;
  music.currentStep = 0;
  music.nextStepTime = ctx.currentTime + 0.05;
  
  sequencerLoop();
};

export const stopMusic = () => {
  if (music.timerID !== null) {
    window.clearTimeout(music.timerID);
    music.timerID = null;
  }
  music.isPlaying = false;
};
