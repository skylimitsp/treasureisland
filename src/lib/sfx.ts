/**
 * Tiny Web Audio sound effects for the quiz — tones are synthesized on the fly
 * so we ship no audio assets. Everything is best-effort and silently no-ops when
 * audio is unavailable (SSR, autoplay policy, unsupported browser).
 * @author Joseph Nartey
 * @github devjoemedia
 * @date 2026-08-13
 */

let context: AudioContext | null = null

const audioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  try {
    // Loosened cast so the older-Safari webkit fallback stays a real branch.
    const win = window as unknown as {
      AudioContext?: typeof AudioContext
      webkitAudioContext?: typeof AudioContext
    }
    const Ctor = win.AudioContext ?? win.webkitAudioContext
    if (!Ctor) return null
    if (!context) context = new Ctor()
    // Browsers start the context suspended until a user gesture — resume on play.
    if (context.state === 'suspended') void context.resume()
    return context
  } catch {
    return null
  }
}

type Tone = {
  freq: number
  /** Seconds from now to start. */
  start: number
  duration: number
  type?: OscillatorType
  gain?: number
}

const playTones = (tones: Array<Tone>): void => {
  const ctx = audioContext()
  if (!ctx) return
  const now = ctx.currentTime
  for (const tone of tones) {
    const osc = ctx.createOscillator()
    const amp = ctx.createGain()
    osc.type = tone.type ?? 'sine'
    osc.frequency.value = tone.freq
    const t0 = now + tone.start
    const peak = tone.gain ?? 0.12
    amp.gain.setValueAtTime(0.0001, t0)
    amp.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.duration)
    osc.connect(amp).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + tone.duration + 0.02)
  }
}

/** Bright ascending arpeggio (C5–E5–G5) for a correct answer. */
export const playCorrect = (): void =>
  playTones([
    { freq: 523.25, start: 0, duration: 0.16 },
    { freq: 659.25, start: 0.09, duration: 0.16 },
    { freq: 783.99, start: 0.18, duration: 0.26 },
  ])

/** Soft descending buzz for a wrong answer. */
export const playWrong = (): void =>
  playTones([
    { freq: 220, start: 0, duration: 0.18, type: 'triangle', gain: 0.14 },
    { freq: 164.81, start: 0.12, duration: 0.28, type: 'triangle', gain: 0.14 },
  ])
