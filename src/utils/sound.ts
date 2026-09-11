export type SoundName = 'correct' | 'star' | 'complete' | 'whoosh' | 'tryagain';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

function tone(
  audio: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gain = 0.06,
) {
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playSound(name: SoundName, muted: boolean) {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;
  void audio.resume();
  const t = audio.currentTime;

  if (name === 'correct') {
    tone(audio, 523, t, 0.12, 'sine', 0.05);
    tone(audio, 659, t + 0.1, 0.16, 'sine', 0.05);
  } else if (name === 'star') {
    tone(audio, 784, t, 0.1, 'triangle', 0.045);
    tone(audio, 988, t + 0.09, 0.18, 'triangle', 0.045);
  } else if (name === 'complete') {
    tone(audio, 392, t, 0.12, 'sine', 0.05);
    tone(audio, 523, t + 0.12, 0.12, 'sine', 0.05);
    tone(audio, 659, t + 0.24, 0.22, 'sine', 0.05);
  } else if (name === 'whoosh') {
    tone(audio, 220, t, 0.18, 'sine', 0.03);
  } else {
    tone(audio, 196, t, 0.16, 'sine', 0.04);
  }
}
