
// Synthesizer canggih untuk efek suara dan musik latar belakang

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

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

export const playSound = (type: 'click' | 'correct' | 'wrong' | 'win' | 'hint' | 'lock') => {
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
      
      // Sparkle layer
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
      // Low buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.linearRampToValueAtTime(100, t + 0.3);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
      break;

    case 'hint':
      // Magic shimmer
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.linearRampToValueAtTime(1600, t + 0.4);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
      break;
      
    case 'lock':
      // Dull thud
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
      break;

    case 'win':
      // Fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C Major Arp
      notes.forEach((freq, i) => {
        const o = context.createOscillator();
        const g = context.createGain();
        o.connect(g);
        g.connect(context.destination);
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.1, t + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.6);
        o.start(t + i * 0.08);
        o.stop(t + i * 0.08 + 0.6);
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
  gain.gain.setValueAtTime(0.6, time); // Volume Kick
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

  osc.start(time);
  osc.stop(time + 0.5);
};

const playHiHat = (ctx: AudioContext, time: number) => {
  if (!noiseBuffer) return;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  const gain = ctx.createGain();
  // Filter to make it sound like a hat
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 5000;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.15, time); // Volume Hat
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
  
  source.start(time);
  source.stop(time + 0.05);
};

const playBass = (ctx: AudioContext, time: number, freq: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square'; // Buzzier bass
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(0.15, time); // Volume Bass
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
  // Envelope agar "plucky"
  gain.gain.setValueAtTime(0.08, time); // Volume Lead (jangan terlalu keras)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
  
  osc.start(time);
  osc.stop(time + 0.4);
};

// --- Composition Data (16 Steps Loop) ---
// 0 = rest, number = frequency

// C Major Pentatonicish for Happy Vibes
const PATTERNS: Record<string, any> = {
  easy: {
    bpm: 110, // Santai tapi gerak
    kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], // Four on floor
    hat:  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // Offbeat
    bass: [130.8, 0, 0, 0, 130.8, 0, 0, 0, 174.6, 0, 0, 0, 196.0, 0, 196.0, 0], // C -> F -> G
    lead: [523.25, 0, 659.25, 0, 783.99, 0, 523.25, 0, 880.00, 0, 783.99, 0, 659.25, 0, 0, 0],
    leadType: 'sine'
  },
  medium: {
    bpm: 135, // Energik!
    kick: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // Driving beat
    hat:  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // Fast hats
    bass: [110.0, 0, 110.0, 0, 164.8, 0, 110.0, 0, 146.8, 0, 146.8, 0, 130.8, 0, 130.8, 123.4], // A Minor Funky
    lead: [0, 440, 0, 523, 0, 440, 0, 659, 0, 523, 0, 587, 0, 523, 493, 0],
    leadType: 'square'
  },
  hard: {
    bpm: 155, // Intense!
    kick: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0], // Breakbeat style
    hat:  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Running hats
    bass: [87.31, 0, 87.31, 0, 116.5, 0, 116.5, 0, 98.00, 0, 98.00, 0, 130.8, 130.8, 73.42, 0], // F -> Bb -> G -> C
    lead: [349.2, 440.0, 523.2, 698.4, 349.2, 440.0, 523.2, 698.4, 392.0, 493.9, 587.3, 783.9, 523.2, 659.2, 0, 0], // Fast Arpeggios
    leadType: 'sawtooth'
  }
};

const scheduleStep = (difficulty: string, time: number) => {
  const ctx = getCtx();
  const song = PATTERNS[difficulty] || PATTERNS['easy'];
  const step = music.currentStep % 16;

  // 1. Kick
  if (song.kick[step]) playKick(ctx, time);

  // 2. Hat
  if (song.hat[step]) playHiHat(ctx, time);

  // 3. Bass
  if (song.bass[step]) playBass(ctx, time, song.bass[step]);

  // 4. Lead
  if (song.lead[step]) playLead(ctx, time, song.lead[step], song.leadType);

  // Advance step
  music.currentStep++;
};

const sequencerLoop = () => {
  const ctx = getCtx();
  const song = PATTERNS[music.difficulty] || PATTERNS['easy'];
  const secondsPerStep = 60.0 / song.bpm / 4; // 16th notes
  const lookahead = 0.1; // seconds

  while (music.nextStepTime < ctx.currentTime + lookahead) {
    scheduleStep(music.difficulty, music.nextStepTime);
    music.nextStepTime += secondsPerStep;
  }
  
  music.timerID = window.setTimeout(sequencerLoop, 25);
};

export const startMusic = (difficulty: string) => {
  if (music.isPlaying && music.difficulty === difficulty) return;
  
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  // Reset if switching difficulty
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
