import { useEffect, useRef } from 'react'

// R1 별당의 밤 — WebAudio 합성(에셋 불요). 시작 버튼(제스처) 이후에만 생성.
// 낮게 깔리는 바람·풀벌레 위로 간헐적 까마귀 울음 3연 — 흉조.
// hg-pouch 해정(어머니와 하직) 시 까마귀는 영영 멎는다 — "까마귀가 세 번 울고, 그쳤다."
// 실패해도 게임에 영향 없도록 전부 try/catch. 테스트는 오디오에 비의존.

// 까마귀 한 울음 — 톱니파 하강(거친 음색), 짧고 마른 까악.
function caw(ctx: AudioContext, at: number, gain: GainNode) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(640, at)
  o.frequency.exponentialRampToValueAtTime(340, at + 0.18)
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(0.85, at + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.25)
  o.connect(g)
  g.connect(gain)
  o.start(at)
  o.stop(at + 0.3)
}

// 풀벌레 — 고음 사인 3펄스 찌르르.
function chirp(ctx: AudioContext, at: number, gain: GainNode) {
  for (let i = 0; i < 3; i++) {
    const t = at + i * 0.07
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(4300, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    o.connect(g)
    g.connect(gain)
    o.start(t)
    o.stop(t + 0.07)
  }
}

// ── 거문고 — Karplus-Strong 현 합성(에셋 불요, 외부 음원 0) ──────────────
// 술대로 뜯는 저음 현: 노이즈 여기(타격감) → 지연선 저역 피드백(현의 울림).
// 농현(弄絃)은 재생 중 playbackRate 미세 진동을 음 중반부터 걸어 흉내낸다 —
// 음을 내고 끝을 흔드는 전통 주법. 가락은 계면조풍 5음(E2~E3) 짧은 구절을
// 성기게(20여 초마다) 흘린다. 해정 순간은 sting() 두 탄현.

const GEOMUNGO = { E2: 82.41, G2: 98.0, A2: 110.0, B2: 123.47, D3: 146.83, E3: 164.81 }
// 짧은 가락들 — 마지막 음에 농현. 낮고 성기게, 배경 회화처럼.
const PHRASES: number[][] = [
  [GEOMUNGO.A2],
  [GEOMUNGO.E2, GEOMUNGO.A2],
  [GEOMUNGO.A2, GEOMUNGO.B2, GEOMUNGO.A2],
  [GEOMUNGO.D3, GEOMUNGO.B2, GEOMUNGO.A2],
  [GEOMUNGO.B2, GEOMUNGO.A2, GEOMUNGO.E2],
  [GEOMUNGO.E3, GEOMUNGO.D3, GEOMUNGO.B2],
]

function renderPluck(ctx: AudioContext, freq: number): AudioBuffer {
  const sr = ctx.sampleRate
  const n = Math.floor(sr * 2.8)
  const buf = ctx.createBuffer(1, n, sr)
  const out = buf.getChannelData(0)
  const period = Math.max(2, Math.floor(sr / freq))
  const line = new Float32Array(period)
  for (let i = 0; i < period; i += 1) line[i] = Math.random() * 2 - 1
  let idx = 0
  let prev = 0
  for (let i = 0; i < n; i += 1) {
    const cur = line[idx]!
    out[i] = cur
    line[idx] = (cur + prev) * 0.5 * 0.9965 // 저역 평균 + 느린 감쇠 — 묵직하고 길게 운다
    prev = cur
    idx = (idx + 1) % period
  }
  return buf
}

function pluck(
  ctx: AudioContext, dest: GainNode, cache: Map<number, AudioBuffer>,
  freq: number, at: number, vel: number, nonghyeon: boolean,
) {
  let buf = cache.get(freq)
  if (!buf) { buf = renderPluck(ctx, freq); cache.set(freq, buf) }
  const src = ctx.createBufferSource()
  src.buffer = buf
  const g = ctx.createGain()
  g.gain.setValueAtTime(vel, at)
  g.gain.setTargetAtTime(0.0001, at + 2.0, 0.25)
  if (nonghyeon) {
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 4.2
    const lg = ctx.createGain()
    lg.gain.setValueAtTime(0, at)
    lg.gain.linearRampToValueAtTime(0.009, at + 1.1) // 중반부터 흔들어 끝을 운다
    lfo.connect(lg)
    lg.connect(src.playbackRate)
    lfo.start(at)
    lfo.stop(at + 2.7)
  }
  src.connect(g)
  g.connect(dest)
  src.start(at)
  src.stop(at + 2.8)
}

/** 인게임 거문고 — 성긴 가락 배경 + 해정 sting. active 동안만 산다. */
export function useGeomungo(active: boolean): { sting: () => void } {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const cacheRef = useRef<Map<number, AudioBuffer>>(new Map())
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    let disposed = false
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = ctxRef.current ?? new Ctor()
      ctxRef.current = ctx
      const master = ctx.createGain()
      master.gain.value = 0.12
      master.connect(ctx.destination)
      masterRef.current = master

      const playPhrase = () => {
        if (disposed) return
        try {
          if (ctx.state === 'suspended') void ctx.resume()
          const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]!
          let t = ctx.currentTime + 0.05 + Math.random() * 6
          phrase.forEach((freq, i) => {
            const last = i === phrase.length - 1
            pluck(ctx, master, cacheRef.current, freq, t, 0.5 + Math.random() * 0.15, last && phrase.length > 1)
            t += 0.75 + Math.random() * 0.55
          })
        } catch { /* ignore */ }
      }
      const first = window.setTimeout(playPhrase, 3500)
      timerRef.current = window.setInterval(playPhrase, 22000)
      return () => {
        disposed = true
        window.clearTimeout(first)
        if (timerRef.current !== null) window.clearInterval(timerRef.current)
        try { master.disconnect() } catch { /* ignore */ }
        try { void ctx.close() } catch { /* ignore */ }
        ctxRef.current = null
        masterRef.current = null
        cacheRef.current = new Map()
      }
    } catch {
      return
    }
  }, [active])

  const sting = () => {
    try {
      const ctx = ctxRef.current
      const master = masterRef.current
      if (!ctx || !master) return
      if (ctx.state === 'suspended') void ctx.resume()
      const t = ctx.currentTime + 0.02
      pluck(ctx, master, cacheRef.current, GEOMUNGO.E2, t, 0.9, false)
      pluck(ctx, master, cacheRef.current, GEOMUNGO.B2, t + 0.16, 0.8, true)
    } catch { /* ignore */ }
  }
  return { sting }
}

export function useCrowAmbience(active: boolean, silenced: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active || silenced) return
    let disposed = false
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = ctxRef.current ?? new Ctor()
      ctxRef.current = ctx
      const master = ctx.createGain()
      master.gain.value = 0.05 // 아주 멀리서
      master.connect(ctx.destination)

      // 바람 — 저역 노이즈 루프, 마당을 낮게 쓸고 지나간다.
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const ch = buf.getChannelData(0)
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1
      const wind = ctx.createBufferSource()
      wind.buffer = buf
      wind.loop = true
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 220
      const wg = ctx.createGain()
      wg.gain.value = 0.55
      wind.connect(lp)
      lp.connect(wg)
      wg.connect(master)
      try { wind.start() } catch { /* ignore */ }

      const playOnce = () => {
        if (disposed) return
        try {
          if (ctx.state === 'suspended') void ctx.resume()
          let t = ctx.currentTime + 0.05
          chirp(ctx, t, master)
          chirp(ctx, t + 1.7, master)
          // 까마귀 울음 3연 — 세 번 울고, 한동안 침묵.
          t += 3.4
          for (let i = 0; i < 3; i++) { caw(ctx, t, master); t += 0.52 }
          chirp(ctx, t + 2.6, master)
        } catch { /* ignore */ }
      }
      playOnce()
      timerRef.current = window.setInterval(playOnce, 14000)
      return () => {
        disposed = true
        if (timerRef.current !== null) window.clearInterval(timerRef.current)
        try { wind.stop() } catch { /* ignore */ }
        try { master.disconnect() } catch { /* ignore */ }
      }
    } catch {
      return
    }
  }, [active, silenced])

  // 해정(silenced) 순간 — 즉시 정적. 까마귀는 다시 울지 않는다.
  useEffect(() => {
    if (!silenced) return
    try {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
      void ctxRef.current?.close()
      ctxRef.current = null
    } catch { /* ignore */ }
  }, [silenced])
}
