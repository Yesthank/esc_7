import { useEffect, useState } from 'react'

/**
 * 세로로 든 기기에게 "가로가 편해요"를 안내 — 강제하지 않는다.
 * 타이틀 화면에서만 렌더된다(게임 중 미표시). 가로로 돌리면 자동으로 사라지고, 탭하면 닫힌다.
 */
export function RotateHint() {
  const [portrait, setPortrait] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const sync = () => setPortrait(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (!portrait || dismissed) return null

  return (
    <button className="rotate-hint" onClick={() => setDismissed(true)} aria-label="가로 안내 닫기">
      <span className="rotate-hint__phone" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <rect x="16" y="6" width="16" height="30" rx="3.4" fill="none" stroke="#e6d8c4" strokeWidth="2.4" />
          <circle cx="24" cy="31.4" r="1.6" fill="#e6d8c4" />
          <path d="M37 18 a14 14 0 0 1 4 12" fill="none" stroke="#b07ae0" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M41.8 26 l-1 5.4 -4.6 -2.6 z" fill="#b07ae0" />
        </svg>
      </span>
      <span className="rotate-hint__text">기기를 가로로 눕히면<br />훨씬 편하게 즐길 수 있어요</span>
      <span className="rotate-hint__ok">알겠어요</span>
    </button>
  )
}
