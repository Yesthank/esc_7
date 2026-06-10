import type { GameConfig } from '../engine/types'

// 여정 지도 — 별당→소굴→해인사→감영(육로) ‖ 대궐(한양).
// 압송 이후(대궐 진입)에는 지나온 길로 되돌아갈 수 없다 — 픽션 보호(압송된 몸은 돌아갈 수 없다).
const LAND = ['room-byeoldang', 'room-cave', 'room-haeinsa', 'room-gamyeong']
const DAEGWOL = 'room-daegwol'
const SHORT: Record<string, string> = {
  'room-byeoldang': '별당', 'room-cave': '소굴', 'room-haeinsa': '해인사', 'room-gamyeong': '감영',
  'room-daegwol': '대궐',
}

export function ShipMap({
  config,
  current,
  visited,
  onMove,
}: {
  config: GameConfig
  current: string
  visited: string[]
  onMove: (roomId: string) => void
}) {
  const apsong = visited.includes(DAEGWOL) // 압송 이후 — 지나온 길이 어둑하게 잠긴다
  const landRooms = LAND.filter((id) => config.rooms.some((r) => r.id === id))

  const cell = (id: string, lockedByApsong: boolean) => {
    const isHere = id === current
    const seen = visited.includes(id)
    const disabled = !seen || isHere || lockedByApsong
    return (
      <button
        key={id}
        className={`shipmap__cell${isHere ? ' here' : ''}${seen ? ' seen' : ''}${lockedByApsong ? ' sealocked' : ''}`}
        disabled={disabled}
        onClick={() => !disabled && onMove(id)}
        aria-label={SHORT[id] ?? id}
      >
        <span className="shipmap__dot" />
        <span className="shipmap__name">{SHORT[id] ?? id}</span>
        {!seen && <span className="shipmap__lock">🔒</span>}
      </button>
    )
  }

  return (
    <nav className="shipmap" aria-label="여정 지도">
      <svg className="shipmap__hull" viewBox="0 0 232 56" aria-hidden="true">
        {/* 육로 — 별당·소굴·해인사·감영 (압송 이후 어둑해진다) */}
        <g opacity={apsong ? 0.45 : 1}>
          {/* 기와집(별당) — 처마 곡선 */}
          <path d="M8 50 v-11 h26 v11" fill="#161c2a" stroke="#c9762b" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M4 40 q17 -13 34 0 l-4.5 1.2 q-12.5 -9 -25 0 z" fill="#1a2238" stroke="#c9762b" strokeWidth="1.2" strokeLinejoin="round" />
          {/* 산(도적 소굴) — 두 봉우리와 폭포 */}
          <path d="M42 50 l17 -27 l10 14 l8 -11 l13 24 z" fill="#161c2a" stroke="#2e6e4e" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M69 39 q-1.5 5.5 0 11" fill="none" stroke="#5a86cc" strokeWidth="1.5" opacity="0.85" />
          {/* 사찰 지붕(해인사) — 이중 처마 */}
          <path d="M97 50 v-9 h28 v9" fill="#161c2a" stroke="#c9762b" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M92 41 q19 -9 38 0 l-4 1.4 q-15 -6.6 -30 0 z" fill="#1a2238" stroke="#b03a2e" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M100 34 q11 -7 22 0 l-3 1.2 q-8 -4.8 -16 0 z" fill="#1a2238" stroke="#b03a2e" strokeWidth="1.1" strokeLinejoin="round" />
          {/* 성곽(감영) — 총안 담장 */}
          <path d="M138 50 v-12 h5 v-4 h5 v4 h8 v-4 h5 v4 h8 v-4 h5 v4 h5 v12 z" fill="#161c2a" stroke="#c9762b" strokeWidth="1.3" strokeLinejoin="round" />
          {/* 길 — 육로 점선 */}
          <path d="M10 52 q80 -5 164 0" fill="none" stroke="#8a6228" strokeWidth="1.3" strokeDasharray="5 4" opacity="0.6" />
        </g>
        {/* 멀리 대궐(한양) — 압송 뒤에야 또렷해진다 */}
        <g opacity={apsong ? 1 : 0.55}>
          <path d="M186 50 v-9 h42 v9 z" fill="#161c2a" stroke="#c9762b" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M203 50 v-6.5 q4 -3 8 0 V50 z" fill="#0c1018" />
          <path d="M182 41 q25 -8 50 0 l-4.2 1.4 q-20.8 -6 -41.6 0 z" fill="#1a2238" stroke="#b03a2e" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M190 33.5 q17 -7 34 0 l-3.6 1.3 q-13.4 -4.8 -26.8 0 z" fill="#1a2238" stroke="#b03a2e" strokeWidth="1.1" strokeLinejoin="round" />
        </g>
      </svg>
      <div className="shipmap__cells">
        {landRooms.map((id) => cell(id, apsong))}
        <span className="shipmap__sea" aria-hidden="true" style={{ color: '#c9762b' }}>‖</span>
        {cell(DAEGWOL, false)}
      </div>
    </nav>
  )
}
