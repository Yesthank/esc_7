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
