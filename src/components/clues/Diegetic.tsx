import { useState, type CSSProperties, type JSX, type ReactNode } from 'react'
import type { NoteClue, TokensClue } from '../../engine/types'

// 단서를 "세계 속 장면"으로 렌더한다 — 칩이 아니라 책갑·복주머니·윷판·산가지·그림자·단청·괘 깃발·목활자.
// 원재료만 보여주고, 변환법은 플레이어 몫. 렌더는 clues.json emit 토큰만 신뢰한다.
// 시각 캐논(설계서 §5): 한지 #efe6d0 · 쪽빛 밤 #1a2238 · 등롱 주황 #c9762b · 단청 녹 #2e6e4e + 단청 적.
// 김홍도풍 수묵담채 분위기의 단순·가독 우선 SVG. 모바일 800×360 가독(획 굵기·최소 크기).

const HANJI = '#efe6d0'
const NIGHT = '#1a2238'
const AMBER = '#c9762b'
const DAN_GREEN = '#2e6e4e'
const INK = '#2a2418'
const INK_RED = '#8a2c3c' // 인주(印朱) — 도장·자수 강조
const GOLD_THREAD = '#f0d9a0' // 수실·금박

/** viewBox 기반 SVG 래퍼 — height:auto 환경에서 높이 0 함정을 막는 aspect-ratio 명시. */
function Scene({ vb, children }: { vb: string; children: ReactNode }) {
  const parts = vb.split(/\s+/).map(Number)
  const w = parts[2] ?? 1, h = parts[3] ?? 1
  return (
    <svg className="dieg" viewBox={vb} style={{ aspectRatio: `${w} / ${h}` }} aria-hidden="true">
      {children}
    </svg>
  )
}

/** 괘(卦) SVG 자형 — 유니코드 글리프 렌더 금지(설계서 §5/§7-D8). 행은 위→아래, 1=실선 0=끊김. */
const TRIGRAM_TB: Record<string, [number, number, number]> = {
  '☰': [1, 1, 1], '☱': [0, 1, 1], '☲': [1, 0, 1], '☳': [0, 0, 1],
  '☴': [1, 1, 0], '☵': [0, 1, 0], '☶': [1, 0, 0], '☷': [0, 0, 0],
}
function TrigramGlyph({ cx, y, w, color, sym, gap = 9, bh = 5 }: {
  cx: number; y: number; w: number; color: string; sym: string; gap?: number; bh?: number
}) {
  const rows = TRIGRAM_TB[sym] ?? TRIGRAM_TB['☰']!
  const x = cx - w / 2
  return (
    <g>
      {rows.map((solid, r) =>
        solid ? (
          <rect key={r} x={x} y={y + r * gap} width={w} height={bh} rx={1.4} fill={color} />
        ) : (
          <g key={r}>
            <rect x={x} y={y + r * gap} width={w * 0.42} height={bh} rx={1.4} fill={color} />
            <rect x={x + w * 0.58} y={y + r * gap} width={w * 0.42} height={bh} rx={1.4} fill={color} />
          </g>
        ),
      )}
    </g>
  )
}

/** 산가지 세로식 자형 — '-' = 상단 가로획 1, '|' 개수 = 세로 막대(설계서 §2 L4 — 유니코드 금지, SVG 전용). */
function SanRods({ cx, baseY, h, pattern, color, rw = 3.6, gap = 6.5 }: {
  cx: number; baseY: number; h: number; pattern: string; color: string; rw?: number; gap?: number
}) {
  const top = pattern.startsWith('-')
  const n = (pattern.match(/\|/g) ?? []).length
  const w = n > 0 ? (n - 1) * gap + rw : gap * 2
  const x0 = cx - w / 2
  const barW = Math.max(w, gap * 2) + 4
  return (
    <g>
      {top && <rect x={cx - barW / 2} y={baseY - h - gap - 1} width={barW} height={rw} rx={rw / 2.6} fill={color} />}
      {Array.from({ length: n }).map((_, k) => (
        <rect key={k} x={x0 + k * gap} y={baseY - h} width={rw} height={h} rx={rw / 2.6} fill={color} />
      ))}
    </g>
  )
}

// ── R1 별당 ──────────────────────────────────────────────────────────────

/** 서가의 책갑 — 천간 한자 표지 4질 + 권수 패(값축). 차례는 책력이 안다. */
function Bookcase({ clue }: { clue: TokensClue }) {
  const n = Math.max(clue.tokens.length, 1)
  const spacing = 216 / n
  const caseColors = ['#41597c', DAN_GREEN, '#8a5a2e', '#6e3a4c', '#4a4a6e']
  return (
    <Scene vb="0 0 240 122">
      <rect x="0" y="2" width="240" height="116" rx="4" fill="#232b44" />
      <rect x="8" y="102" width="224" height="8" rx="2" fill="#4a3826" />
      {clue.tokens.map((t, i) => {
        const x = 14 + i * spacing
        const w = spacing - 10
        const cx = x + w / 2
        return (
          <g key={i}>
            <rect x={x} y="22" width={w} height="80" rx="2.4" fill={caseColors[i % caseColors.length]} stroke="#14101c" strokeWidth="1.2" />
            <rect x={x + 4} y="26" width={w - 8} height="72" fill="none" stroke={HANJI} strokeWidth="0.8" opacity="0.35" />
            <text x={cx} y="62" textAnchor="middle" fontSize="26" fontFamily="serif" fontWeight="700" fill={HANJI}>{t.tag}</text>
            <rect x={cx - 12} y="78" width="24" height="17" rx="2.4" fill={HANJI} stroke="#5c441c" strokeWidth="1" />
            <text x={cx} y="90.5" textAnchor="middle" fontSize="11.5" fontFamily="serif" fontWeight="700" fill={INK}>
              {t.text}<tspan fontSize="7"> 권</tspan>
            </text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 책상 위 책력 — 천간 10자: 한자 + 독음·순번 병기 차트(외부지식 0). */
function Chaekryeok({ clue }: { clue: TokensClue }) {
  return (
    <div className="dieg-chart">
      <div className="dieg-chart__title">책력 — 천간의 차례</div>
      <div className="dieg-chart__grid">
        {clue.tokens.map((t, i) => (
          <span className="dieg-chart__cell" key={i}>
            <b>{t.text}</b>
            <i>{t.tag}</i>
          </span>
        ))}
      </div>
    </div>
  )
}

/** 어머니의 복주머니 — 자음 4자가 수실 끈으로 꿰임. 진한 처음 매듭부터 실을 따라간다. */
function Pouch({ clue }: { clue: TokensClue }) {
  const SPOTS: [number, number][] = [[72, 92], [146, 84], [132, 138], [80, 140]]
  const ordered = clue.tokens
    .map((t, i) => ({ i, knot: Number((t.tag ?? '').replace(/\D+/g, '')) || i + 1 }))
    .sort((a, b) => a.knot - b.knot)
  const pts = ordered.map((o) => SPOTS[o.i % SPOTS.length]!)
  const first = pts[0]!
  const a = pts[pts.length - 2] ?? first
  const b = pts[pts.length - 1] ?? first
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
  const ax = a[0] + (b[0] - a[0]) * 0.62
  const ay = a[1] + (b[1] - a[1]) * 0.62
  return (
    <Scene vb="0 0 220 182">
      <rect x="0" y="0" width="220" height="182" rx="4" fill={NIGHT} />
      {/* 복주머니 몸체 */}
      <path d="M110 34 C70 40 42 70 42 110 C42 150 72 168 110 168 C148 168 178 150 178 110 C178 70 150 40 110 34 Z"
        fill="#a14a5c" stroke="#581c2c" strokeWidth="2" />
      <ellipse cx="110" cy="37" rx="27" ry="8" fill="#8a3a4c" stroke="#581c2c" strokeWidth="1.4" />
      <path d="M96 34 L84 16 M124 34 L136 16" stroke={GOLD_THREAD} strokeWidth="2" strokeLinecap="round" />
      <circle cx="84" cy="14" r="3" fill={GOLD_THREAD} />
      <circle cx="136" cy="14" r="3" fill={GOLD_THREAD} />
      {/* 수실 — 매듭 차례로 꿰는 한 가닥 */}
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={GOLD_THREAD}
        strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" opacity="0.95" />
      <polygon points="0,-3.4 7.5,0 0,3.4" transform={`translate(${ax} ${ay}) rotate(${ang})`} fill={GOLD_THREAD} />
      {/* 매듭 + 자수 낱자 (토큰 자리 고정, 처음 매듭만 크고 진하다) */}
      {clue.tokens.map((t, i) => {
        const p = SPOTS[i % SPOTS.length]!
        const isFirst = p === first
        return (
          <g key={i}>
            {isFirst ? (
              <g>
                <circle cx={p[0]} cy={p[1]} r="6.6" fill="#33101c" stroke={GOLD_THREAD} strokeWidth="1.8" />
                <circle cx={p[0]} cy={p[1]} r="2.4" fill={GOLD_THREAD} />
              </g>
            ) : (
              <circle cx={p[0]} cy={p[1]} r="3.6" fill="#5c2430" stroke={GOLD_THREAD} strokeWidth="1.2" />
            )}
            <text x={p[0]} y={p[1] - 11} textAnchor="middle" fontSize="19" fontFamily="serif" fontWeight="700" fill={HANJI}>{t.text}</text>
            <text x={p[0]} y={p[1] + 17} textAnchor="middle" fontSize="7.2" fill={GOLD_THREAD}>{t.tag}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 언문 반절표 족자 — ㄱ~ㅎ 14자 + 순번(서당 가나다 익힘 차트). */
function Banjeol({ clue }: { clue: TokensClue }) {
  return (
    <div className="dieg-chart">
      <div style={{ height: 6, borderRadius: 3, background: '#4a3826', margin: '0 -4px 8px' }} />
      <div className="dieg-chart__title">언문 반절표 — 가나다 차례</div>
      <div className="dieg-chart__grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {clue.tokens.map((t, i) => (
          <span className="dieg-chart__cell" key={i}>
            <b>{t.text}</b>
            <i>{t.tag}</i>
          </span>
        ))}
      </div>
      <div style={{ height: 6, borderRadius: 3, background: '#4a3826', margin: '8px -4px 0' }} />
    </div>
  )
}

/** 복주머니 안감 — 바늘땀 쌍좌표 자수(앞 수 : 뒤 수). 사이퍼 좌표의 원천. */
function Lining({ clue }: { clue: TokensClue }) {
  return (
    <div className="dieg-paper">
      <div className="dieg-paper__mast">복주머니 안감 — 바늘땀의 수</div>
      <Scene vb="0 0 220 112">
        <rect x="6" y="5" width="208" height="100" rx="7" fill="#ddc9b4" stroke="#a14a5c"
          strokeWidth="1.8" strokeDasharray="5 4" />
        {clue.tokens.map((t, r) => {
          const y = 36 + r * 27
          return (
            <g key={r}>
              <text x="26" y={y + 4} textAnchor="middle" fontSize="8" fill="#a08a6c">{r + 1}</text>
              <path d={`M40 ${y - 4} l7 8 M47 ${y - 4} l-7 8`} stroke={INK_RED} strokeWidth="1.6" strokeLinecap="round" />
              <text x="125" y={y + 6} textAnchor="middle" fontSize="18" fontFamily="serif" fontWeight="700"
                fill={INK_RED} letterSpacing="2">{t.text.replace(':', ' : ')}</text>
              <path d={`M173 ${y - 4} l7 8 M180 ${y - 4} l-7 8`} stroke={INK_RED} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )
        })}
      </Scene>
    </div>
  )
}

// ── R2 도적 소굴 ─────────────────────────────────────────────────────────

/** 바위의 윷 기록 — 던져 둔 4판의 결과명 글자 새김(점수 직독은 미끼 — 패는 걸음이다). */
function YutRecord({ clue }: { clue: TokensClue }) {
  return (
    <Scene vb="0 0 240 100">
      <rect x="0" y="0" width="240" height="100" rx="4" fill="#241f1a" />
      <path d="M14 84 Q10 36 52 24 Q120 6 196 22 Q232 30 228 64 Q224 92 178 92 L40 92 Q18 92 14 84 Z"
        fill="#4e463c" stroke="#2c2620" strokeWidth="1.6" />
      {clue.tokens.map((t, i) => {
        const x = 48 + i * 50
        return (
          <g key={i}>
            <text x={x} y="58" textAnchor="middle" fontSize="26" fontFamily="serif" fontWeight="700"
              fill="#241f1a" stroke="#9a8c74" strokeWidth="0.7">{t.text}</text>
            <text x={x} y="78" textAnchor="middle" fontSize="8" fill="#c2b698">{t.tag}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 바위에 새긴 윷판 — 출발 칸의 말 + 길 14칸의 새김 숫자(보드-워크). */
function YutBoard({ clue }: { clue: TokensClue }) {
  const cx = 115, cy = 92, r = 58
  const pos = (deg: number, rad: number): [number, number] => {
    const a = (deg * Math.PI) / 180
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]
  }
  const cells = clue.tokens.map((t, i) => {
    const deg = -90 + (i + 1) * 24 // 출발(맨 위)에서 시계방향
    return { t, deg, p: pos(deg, r), lab: pos(deg, r + 15) }
  })
  const arrowFrom = pos(-82, r + 14), arrowTo = pos(-62, r + 14)
  const arrowAng = (Math.atan2(arrowTo[1] - arrowFrom[1], arrowTo[0] - arrowFrom[0]) * 180) / Math.PI
  const start = pos(-90, r)
  return (
    <Scene vb="0 0 230 178">
      <rect x="0" y="0" width="230" height="178" rx="4" fill="#3a342c" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#241f1a" strokeWidth="7" opacity="0.55" />
      {/* 출발 칸 + 말 */}
      <circle cx={start[0]} cy={start[1]} r="11.5" fill="#2a2724" stroke="#c9a14a" strokeWidth="1.6" />
      <text x={start[0]} y={start[1] - 18} textAnchor="middle" fontSize="8.5" fill="#e0d4b4">출발</text>
      <circle cx={start[0]} cy={start[1]} r="5.2" fill={AMBER} stroke="#4a2c10" strokeWidth="1.2" />
      <circle cx={start[0] - 1.4} cy={start[1] - 1.6} r="1.4" fill="#f4dcb4" opacity="0.8" />
      {/* 진행 방향 */}
      <path d={`M${arrowFrom[0]} ${arrowFrom[1]} A${r + 14} ${r + 14} 0 0 1 ${arrowTo[0]} ${arrowTo[1]}`}
        fill="none" stroke="#c2b698" strokeWidth="1.6" />
      <polygon points="0,-3 6.5,0 0,3" transform={`translate(${arrowTo[0]} ${arrowTo[1]}) rotate(${arrowAng})`} fill="#c2b698" />
      {/* 길 14칸 */}
      {cells.map(({ t, p, lab }, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="10.5" fill="#332e28" stroke="#8a7c5c" strokeWidth="1" />
          <text x={p[0]} y={p[1] + 3.8} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight="700" fill={HANJI}>{t.text}</text>
          <text x={lab[0]} y={lab[1] + 2.4} textAnchor="middle" fontSize="6.5" fill="#a89a78">{(t.tag ?? '').replace(/\D+/g, '')}</text>
        </g>
      ))}
    </Scene>
  )
}

/** 귀퉁이의 걸음수 새김 — 도1 · 개2 · 걸3 · 윷4 · 모5 (돌 새김 차트). */
function Georeumsu({ clue }: { clue: TokensClue }) {
  return (
    <div className="dieg-chart dieg-chart--slab">
      <div className="dieg-chart__title">귀퉁이 새김 — 걸음수</div>
      <div className="dieg-chart__grid">
        {clue.tokens.map((t, i) => (
          <span className="dieg-chart__cell" key={i}>
            <b>{t.text}</b>
            <i>{t.tag} 걸음</i>
          </span>
        ))}
      </div>
    </div>
  )
}

/** 노름판의 산가지 — 세로식 산대 4묶음 + 엽전 차례 패(닢 수). */
function Sangaji({ clue }: { clue: TokensClue }) {
  return (
    <Scene vb="0 0 250 126">
      <rect x="0" y="0" width="250" height="126" rx="4" fill="#2e2a26" />
      <rect x="8" y="12" width="234" height="102" rx="6" fill="#6e5c36" opacity="0.85" />
      {[34, 58, 82].map((y) => (
        <line key={y} x1="14" y1={y} x2="236" y2={y} stroke="#241f1a" strokeWidth="1" opacity="0.15" />
      ))}
      {clue.tokens.map((t, i) => {
        const cx = 38 + i * 58
        const coins = Number((t.tag ?? '').replace(/\D+/g, '')) || 0
        const cw = (coins - 1) * 13
        return (
          <g key={i}>
            <SanRods cx={cx} baseY={72} h={32} pattern={t.text} color="#e8d9b0" rw={4} gap={7.5} />
            {Array.from({ length: coins }).map((_, k) => {
              const x = cx - cw / 2 + k * 13
              return (
                <g key={k}>
                  <circle cx={x} cy="96" r="5.6" fill="#b89040" stroke="#4a3318" strokeWidth="1" />
                  <rect x={x - 1.8} y={94.2} width="3.6" height="3.6" fill="#2e2a26" />
                </g>
              )
            })}
          </g>
        )
      })}
    </Scene>
  )
}

/** 벽의 산가지 숫자표 — 1~9 세로식(다섯을 넘기면 한 획이 위로 눕는다). */
function Sanpyo({ clue }: { clue: TokensClue }) {
  return (
    <div className="dieg-chart">
      <div className="dieg-chart__title">산가지 숫자표 — 하나에서 아홉</div>
      <Scene vb="0 0 252 66">
        {clue.tokens.map((t, i) => {
          const cx = 16 + i * 27.5
          return (
            <g key={i}>
              {i > 0 && <line x1={cx - 13.5} y1="4" x2={cx - 13.5} y2="58" stroke="#8a7c5c" strokeWidth="0.7" opacity="0.5" />}
              <SanRods cx={cx} baseY={36} h={22} pattern={t.text} color={INK} rw={3} gap={5.2} />
              <text x={cx} y="55" textAnchor="middle" fontSize="10" fontFamily="serif" fontWeight="700" fill={INK}>{t.tag}</text>
            </g>
          )
        })}
      </Scene>
    </div>
  )
}

// ── R3 해인사 ────────────────────────────────────────────────────────────

/** 시주 명부 — □시에 든 시주, 냥 수 4건(값축). 차례는 그림자가 안다. */
function AlmsLedger({ clue }: { clue: TokensClue }) {
  return (
    <div className="dieg-paper">
      <div className="dieg-paper__mast">시주 명부</div>
      <div className="dieg-paper__col">
        {clue.tokens.map((t, i) => (
          <p className="dieg-paper__line" key={i}
            style={{ justifyContent: 'space-between', borderBottom: '1px dotted rgba(90,76,52,.45)', paddingBottom: 3 }}>
            <span>{t.tag}에 든 시주</span>
            <span><em>{t.text}</em> 냥</span>
          </p>
        ))}
      </div>
    </div>
  )
}

/** 신상과 해 그림자 — 명문 신상들 + 해가 차례로 짚는 그림자(SVG 그림자 레이어, §7-D8). */
function Shadows({ clue }: { clue: TokensClue }) {
  const tips = [30, 11, -11, -30] // 해가 동→서로 가며 그림자가 도는 방향
  return (
    <Scene vb="0 0 250 130">
      <rect x="0" y="0" width="250" height="92" fill="#e8d9ae" />
      <rect x="0" y="92" width="250" height="38" fill="#b8a87c" />
      {/* 해의 길 */}
      <path d="M18 32 Q125 4 232 32" fill="none" stroke={AMBER} strokeWidth="1.6" strokeDasharray="4 5" />
      <circle cx="32" cy="27" r="7" fill="#d98c2b" stroke="#8a4a14" strokeWidth="1.2" />
      <polygon points="0,-3.2 7,0 0,3.2" transform="translate(231 32) rotate(18)" fill={AMBER} />
      {clue.tokens.map((t, i) => {
        const cx = 38 + i * 58
        const dx = tips[i % tips.length]!
        return (
          <g key={i}>
            {/* 그림자 (오브젝트 레이어) */}
            <polygon points={`${cx - 13},93 ${cx + 13},93 ${cx + dx + 7},117 ${cx + dx - 7},117`}
              fill={NIGHT} opacity="0.5" />
            <text x={cx + dx} y="126.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#3a3424">
              {(t.tag ?? '').replace(/^그림자\s*/, '')}
            </text>
            {/* 신상 */}
            <circle cx={cx} cy="40" r="8" fill="#a8a094" stroke="#5c564c" strokeWidth="1" />
            <rect x={cx - 10} y="47" width="20" height="32" rx="6" fill="#a8a094" stroke="#5c564c" strokeWidth="1" />
            <rect x={cx - 15} y="79" width="30" height="13" fill="#9a9286" stroke="#5c564c" strokeWidth="1" />
            <rect x={cx - 9} y="80.5" width="18" height="10.5" rx="1.4" fill="#e8e0cc" stroke="#5c564c" strokeWidth="0.7" />
            <text x={cx} y="89" textAnchor="middle" fontSize="9" fontFamily="serif" fontWeight="700" fill={INK}>{t.text}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 단청 연꽃 토큰 — 오방색 꽃잎마다 글자 하나(비단조 제시 — 차례는 행렬도가 안다). */
function Dancheong({ clue }: { clue: TokensClue }) {
  const isLight = (c?: string) => c === '백' || c === '황'
  return (
    <Scene vb="0 0 260 100">
      <rect x="0" y="0" width="260" height="100" rx="4" fill="#26322c" />
      {clue.tokens.map((t, i) => {
        const cx = 30 + i * 50, cy = 44
        const hex = t.hex ?? HANJI
        return (
          <g key={i}>
            {[0, 60, 120].map((deg) => (
              <ellipse key={deg} cx="0" cy="0" rx="7.5" ry="16.5" fill={hex}
                stroke={isLight(t.color) ? '#3a3020' : HANJI} strokeWidth="0.9"
                strokeOpacity={isLight(t.color) ? 1 : 0.55}
                transform={`translate(${cx} ${cy}) rotate(${deg})`} />
            ))}
            <circle cx={cx} cy={cy} r="10.5" fill="#f4ecd8" stroke="#3a3020" strokeWidth="1" />
            <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight="700" fill={INK}>{t.text}</text>
            <text x={cx} y="88" textAnchor="middle" fontSize="9" fill={HANJI}>{t.color}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 오방신장 행렬 탱화 — 동→남→중→서→북 1열 행진 + 발치 1~5 번호(순서 관측물, §7-F1). */
function Haengnyeol({ clue }: { clue: TokensClue }) {
  const isLight = (c?: string) => c === '백' || c === '황'
  return (
    <Scene vb="0 0 270 126">
      <rect x="0" y="0" width="270" height="126" rx="4" fill="#e0d0a8" />
      <rect x="3" y="3" width="264" height="120" rx="2" fill="none" stroke="#8a6a3c" strokeWidth="1.2" />
      <text x="234" y="17" textAnchor="middle" fontSize="8.5" fill="#6a542c" fontWeight="700">행렬 →</text>
      <line x1="14" y1="14" x2="206" y2="14" stroke="#8a6a3c" strokeWidth="0.8" opacity="0.5" />
      {clue.tokens.map((t, i) => {
        const cx = 32 + i * 52
        const hex = t.hex ?? HANJI
        return (
          <g key={i}>
            <path d={`M${cx - 6} 34 L${cx} 26 L${cx + 6} 34 Z`} fill="#3a2c14" />
            <circle cx={cx} cy="44" r="8" fill="#e8d2b0" stroke="#3a2c14" strokeWidth="1" />
            <path d={`M${cx - 13} 58 Q${cx} 50 ${cx + 13} 58 L${cx + 16} 96 Q${cx} 102 ${cx - 16} 96 Z`}
              fill={hex} stroke="#3a2c14" strokeWidth="1.2" />
            <text x={cx} y="80" textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight="700"
              fill={isLight(t.color) ? INK : HANJI}>{t.tag}</text>
            <rect x={cx - 8} y="104" width="16" height="13" rx="2" fill="#f4ecd8" stroke="#8a6a3c" strokeWidth="0.9" />
            <text x={cx} y="113.5" textAnchor="middle" fontSize="10" fontWeight="700" fill={INK}>{t.text}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 대웅전 머리초 띠 — 들보에 5색이 같은 차례로 되풀이되는 단청 띠. */
function Meoricho({ clue }: { clue: TokensClue }) {
  const n = Math.max(clue.tokens.length, 1)
  const segW = 244 / n
  return (
    <Scene vb="0 0 260 86">
      <rect x="0" y="8" width="260" height="70" rx="4" fill="#54422c" />
      <line x1="8" y1="18" x2="252" y2="18" stroke="#d9a514" strokeWidth="1.4" opacity="0.6" />
      <line x1="8" y1="56" x2="252" y2="56" stroke="#d9a514" strokeWidth="1.4" opacity="0.6" />
      {clue.tokens.map((t, i) => {
        const x = 8 + i * segW
        return (
          <g key={i}>
            <rect x={x} y="21" width={segW} height="32" fill={t.hex ?? HANJI} stroke="#241c10" strokeWidth="0.7" />
            <text x={x + segW / 2} y="69" textAnchor="middle" fontSize="7.5" fill="#e8d9ae">{t.color}</text>
          </g>
        )
      })}
    </Scene>
  )
}

// ── R4 함경 읍성 감영 ────────────────────────────────────────────────────

/** 사대문의 괘 깃발 — SVG 괘 자형 깃발 4폭 + 방(榜)의 게시 서수(직독 tag). */
function Flags({ clue }: { clue: TokensClue }) {
  return (
    <Scene vb="0 0 260 142">
      <rect x="0" y="0" width="260" height="142" rx="4" fill="#3c3a54" />
      <rect x="0" y="118" width="260" height="24" fill="#4a4438" />
      {clue.tokens.map((t, i) => {
        const px = 24 + i * 62
        const [gate, day] = (t.tag ?? '').split(' · ')
        return (
          <g key={i}>
            <rect x={px - 1.5} y="16" width="3" height="104" fill="#28221c" />
            <circle cx={px} cy="14" r="2.6" fill={AMBER} />
            <path d={`M${px + 2} 22 L${px + 48} 26 Q${px + 52} 39 ${px + 48} 52 L${px + 2} 56 Z`}
              fill="#e8dcc0" stroke="#241f1a" strokeWidth="1" />
            <TrigramGlyph cx={px + 25} y={29} w={27} color={INK} sym={t.text} gap={8.2} bh={4.8} />
            {/* 방(榜) — 게시 서수 */}
            <g transform={`rotate(-3 ${px + 24} 76)`}>
              <rect x={px + 7} y="66" width="36" height="21" rx="1.4" fill={HANJI} stroke="#8a6a3c" strokeWidth="0.9" />
              <text x={px + 25} y="80" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={INK}>{day ?? ''}</text>
            </g>
            <rect x={px - 14} y="121" width="28" height="15" rx="2" fill="#e4d8bc" stroke="#3a2c14" strokeWidth="0.9" />
            <text x={px} y="132" textAnchor="middle" fontSize="9" fontWeight="700" fill={INK}>{gate ?? ''}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 관상감 팔괘도 병풍 — 괘 기호(SVG) + 이름 + 순번 8칸 병기 차트. */
function Palgwaedo({ clue }: { clue: TokensClue }) {
  return (
    <Scene vb="0 0 264 132">
      <rect x="0" y="0" width="264" height="132" rx="3" fill="#3a2c14" />
      {clue.tokens.map((t, i) => {
        const x = 4 + i * 32
        const cx = x + 14
        const [name, num] = (t.tag ?? '').split(' · ')
        return (
          <g key={i}>
            <rect x={x} y="4" width="28" height="124" fill={i % 2 ? '#e2d4ae' : '#ece0c2'} stroke="#6a542c" strokeWidth="1" />
            <TrigramGlyph cx={cx} y={20} w={20} color={INK} sym={t.text} gap={8.6} bh={4.6} />
            <line x1={x + 6} y1="58" x2={x + 22} y2="58" stroke="#8a6a3c" strokeWidth="0.8" opacity="0.6" />
            <text x={cx} y="82" textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight="700" fill={INK}>{name ?? ''}</text>
            <text x={cx} y="110" textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight="700" fill={INK_RED}>{num ?? ''}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 목활자함 — 글자면이 좌우반전된 초성·중성 활자 짝 + 조판틀 칸 차례(찍어야 바로 선다). */
function Types({ clue }: { clue: TokensClue }) {
  return (
    <Scene vb="0 0 250 134">
      <rect x="0" y="0" width="250" height="134" rx="6" fill="#4a3826" />
      {clue.tokens.map((t, i) => {
        const gx = 14 + i * 76
        const [c1, c2] = t.text.split(',')
        return (
          <g key={i}>
            <rect x={gx} y="14" width="68" height="86" rx="4" fill="#3a2c1c" stroke="#1e1610" strokeWidth="1.5" />
            <rect x={gx + 2.5} y="16.5" width="63" height="81" rx="3" fill="none" stroke="#6a542c" strokeWidth="0.9" />
            {[c1, c2].map((ch, k) => {
              const bx = gx + 6 + k * 30
              return (
                <g key={k}>
                  <rect x={bx} y="22" width="26" height="60" rx="2" fill="#8a6a42" stroke="#241a10" strokeWidth="1.1" />
                  <rect x={bx + 3} y="25" width="20" height="54" rx="1.4" fill="#9c7a4e" />
                  <ellipse cx={bx + 13} cy="50" rx="8" ry="14" fill="#241608" opacity="0.12" />
                  {/* 글자면 좌우반전 — 인쇄 원리(찍으면 바로 선다) */}
                  <text transform={`translate(${bx + 13} 60) scale(-1 1)`} textAnchor="middle"
                    fontSize="24" fontFamily="serif" fontWeight="700" fill="#241608">{ch ?? ''}</text>
                </g>
              )
            })}
            <text x={gx + 34} y="115" textAnchor="middle" fontSize="9" fill="#e8dcc0">{t.tag}</text>
          </g>
        )
      })}
    </Scene>
  )
}

/** 조합 격자 인쇄 견본 — 초성+중성이 한 글자가 되는 본보기(정답 자모는 안 쓴다). */
function Gyeokja({ clue }: { clue: TokensClue }) {
  const cell: CSSProperties = {
    border: '1px solid #8a7c5c', borderRadius: 3, padding: '1px 7px',
    fontWeight: 700, fontSize: 15, background: '#e8dfc4', color: INK, fontFamily: 'serif',
  }
  return (
    <div className="dieg-chart">
      <div className="dieg-chart__title">조합 격자 — 인쇄 견본</div>
      {clue.tokens.map((t, i) => {
        const [lhs, res] = t.text.split('=')
        const [c1, c2] = (lhs ?? '').split(',')
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, margin: '5px 0' }}>
            <span style={cell}>{c1}</span>
            <span style={{ color: '#6a5c3c', fontSize: 12 }}>+</span>
            <span style={cell}>{c2}</span>
            <span style={{ color: '#6a5c3c', fontSize: 12 }}>=</span>
            <span style={{
              ...cell, color: INK_RED, border: `1.4px solid ${INK_RED}`,
              background: 'rgba(184,38,71,.07)', transform: 'rotate(-2deg)',
            }}>{res}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── R5 대궐 앞뜰 — L9 여덟 길동 ─────────────────────────────────────────

// 호패 새김·정합 데이터 — clues.json 토큰엔 발목·매듭 관측(tag)만 있고 호패 값이 없다.
// 게임 정합(정답 3719 + 미끼 7종 자리 숫자 공유)을 위해 fixture 의 값을 그대로 옮겨 적는다.
// 출처: maker/game-forge/fixtures/honggildong-game.ts JEUNG_MATRIX·HANJA_DIGITS
// (설계서 §2 L9 8×3 모순 매트릭스). fixture 수정 시 이 표도 동기 필수 — 수동검수 체크리스트 항목.
const JEUNG_HOPAE: Record<string, { hopae: string; fit: boolean }> = {
  '길동-1': { hopae: '3719', fit: true },
  '길동-2': { hopae: '3917', fit: true },
  '길동-3': { hopae: '7193', fit: true },
  '길동-4': { hopae: '1937', fit: false },
  '길동-5': { hopae: '9371', fit: true },
  '길동-6': { hopae: '8719', fit: false },
  '길동-7': { hopae: '3164', fit: false },
  '길동-8': { hopae: '5283', fit: false },
}
const HANJA_DIGIT: Record<string, string> = {
  '1': '一', '2': '二', '3': '三', '4': '四', '5': '五',
  '6': '六', '7': '七', '8': '八', '9': '九',
}

/** 길동 인물 자형 — 발목 짚 가닥 · 환약 주머니 매듭이 정면 렌더에서 관측된다(좌표계: 폭 ±18, 높이 0~66). */
function GilFigure({ straw, knotOk, sel }: { straw: boolean; knotOk: boolean; sel?: boolean }) {
  return (
    <g>
      {sel && <rect x="-16" y="-2" width="32" height="68" rx="6" fill={AMBER} opacity="0.1" stroke={AMBER} strokeWidth="1.8" />}
      {/* 갓 + 얼굴 */}
      <rect x="-4.5" y="0.5" width="9" height="8" rx="2" fill="#14161e" />
      <ellipse cx="0" cy="8.4" rx="10.5" ry="2.3" fill="#14161e" />
      <circle cx="0" cy="13.6" r="5.4" fill="#e6cfa8" stroke="#3a3048" strokeWidth="0.6" />
      {/* 도포 */}
      <path d="M-10 21 Q0 17 10 21 L13.5 50 Q0 54.5 -13.5 50 Z" fill="#76849f" stroke="#2c3142" strokeWidth="1" />
      <path d="M-12 33 Q0 36 12 33" fill="none" stroke="#3a4258" strokeWidth="1.4" />
      {/* 환약 주머니 + 매듭(가지런 vs 어긋남) */}
      <circle cx="6.5" cy="39.5" r="4.2" fill="#a14a5c" stroke="#4a1c28" strokeWidth="0.8" />
      {knotOk ? (
        <g stroke={GOLD_THREAD} strokeWidth="1.1" strokeLinecap="round">
          <line x1="5" y1="33" x2="5" y2="36.6" />
          <line x1="8" y1="33" x2="8" y2="36.6" />
        </g>
      ) : (
        <g stroke={GOLD_THREAD} strokeWidth="1.1" strokeLinecap="round">
          <line x1="4.5" y1="33.4" x2="7" y2="36.8" />
          <line x1="8.5" y1="33" x2="6" y2="37" />
          <line x1="6" y1="32.6" x2="9.8" y2="35.2" />
        </g>
      )}
      {/* 다리 + 짚신 */}
      <rect x="-7" y="50" width="4.5" height="9.5" fill="#cfc6b2" />
      <rect x="2.5" y="50" width="4.5" height="9.5" fill="#cfc6b2" />
      <ellipse cx="-4.8" cy="61" rx="4" ry="1.9" fill="#8a7c5c" />
      <ellipse cx="4.8" cy="61" rx="4" ry="1.9" fill="#8a7c5c" />
      {/* 발목의 짚 가닥(제웅 표식) */}
      {straw && (
        <g stroke="#d9b25a" strokeWidth="1.3" strokeLinecap="round">
          <line x1="-5" y1="56" x2="-10.5" y2="53" />
          <line x1="-4.5" y1="57.4" x2="-10.5" y2="58" />
          <line x1="4.6" y1="56" x2="10.4" y2="53.4" />
          <line x1="5" y1="57.4" x2="10.8" y2="58.2" />
        </g>
      )}
    </g>
  )
}

/** 여덟 길동 — 인터랙티브 감별(L9). 호패는 평소 비표시, 인물을 짚으면 그 호패(한자 숫자)만 렌더. */
function Jeung({ clue }: { clue: TokensClue }) {
  const [sel, setSel] = useState<number | null>(null)
  const selToken = sel === null ? undefined : clue.tokens[sel]
  const selHopae = selToken ? JEUNG_HOPAE[selToken.text] : undefined
  const obs = (tag?: string) => ({
    straw: (tag ?? '').includes('짚'),
    knotOk: (tag ?? '').includes('가지런'),
  })
  return (
    <div>
      <Scene vb="0 0 320 172">
        <rect x="0" y="0" width="320" height="172" rx="5" fill={NIGHT} />
        <rect x="0" y="0" width="320" height="172" rx="5" fill="none" stroke="#2c3450" strokeWidth="1.4" />
        {clue.tokens.map((t, i) => {
          const x = 40 + (i % 4) * 80
          const yo = i < 4 ? 5 : 90
          const o = obs(t.tag)
          return (
            <g key={i} transform={`translate(${x} ${yo})`} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <rect x="-20" y="-3" width="40" height="80" fill="transparent" />
              <GilFigure straw={o.straw} knotOk={o.knotOk} sel={sel === i} />
              <text x="0" y="74.5" textAnchor="middle" fontSize="9" fill={sel === i ? AMBER : '#9aa4c0'}>{t.text}</text>
            </g>
          )
        })}
      </Scene>
      {selToken && selHopae ? (
        <div style={{ marginTop: 10 }}>
          <Scene vb="0 0 210 152">
            <rect x="0" y="0" width="210" height="152" rx="6" fill="#10141f" />
            <g transform="translate(58 12) scale(1.85)">
              <GilFigure straw={obs(selToken.tag).straw} knotOk={obs(selToken.tag).knotOk} />
            </g>
            {/* 호패 — 지목한 인물의 것만 드러난다(한자 숫자 새김) */}
            <g transform="translate(132 20)">
              <line x1="20" y1="-6" x2="20" y2="8" stroke="#6a5a3c" strokeWidth="1.6" />
              <rect x="0" y="2" width="40" height="112" rx="5" fill="#a8854e" stroke="#3c2a14" strokeWidth="1.6" />
              <circle cx="20" cy="12" r="3.2" fill="#10141f" />
              {selHopae.hopae.split('').map((d, k) => (
                <text key={k} x="20" y={37 + k * 22} textAnchor="middle" fontSize="16.5" fontFamily="serif"
                  fontWeight="700" fill="#241608">{HANJA_DIGIT[d] ?? d}</text>
              ))}
            </g>
          </Scene>
          <p style={{ margin: '7px 0 0', fontSize: 12, lineHeight: 1.7, color: '#d8cfae', textAlign: 'center' }}>
            {selToken.text} — {selToken.tag}
            <br />
            {selHopae.fit ? '호패 새김이 몸의 표식과 맞물린다.' : '호패 새김이 몸의 표식과 어긋난다.'}
          </p>
        </div>
      ) : (
        <p style={{ margin: '8px 0 0', fontSize: 11.5, fontStyle: 'italic', color: '#8a90a8', textAlign: 'center' }}>
          인물을 짚으면 품에 가려진 호패를 살필 수 있다.
        </p>
      )}
    </div>
  )
}

// ── 레지스트리 — clues.json variant 20종과 1:1 (빌드 게이트 검증 대상) ──

const BY_VARIANT: Record<string, (p: { clue: TokensClue; discovered: string[] }) => JSX.Element> = {
  bookcase: Bookcase,
  chaekryeok: Chaekryeok,
  pouch: Pouch,
  banjeol: Banjeol,
  lining: Lining,
  yutrecord: YutRecord,
  yutboard: YutBoard,
  georeumsu: Georeumsu,
  sangaji: Sangaji,
  sanpyo: Sanpyo,
  almsledger: AlmsLedger,
  shadows: Shadows,
  dancheong: Dancheong,
  haengnyeol: Haengnyeol,
  meoricho: Meoricho,
  flags: Flags,
  palgwaedo: Palgwaedo,
  types: Types,
  gyeokja: Gyeokja,
  jeung: Jeung,
}

export function Note({ clue }: { clue: NoteClue }) {
  return (
    <div className="dieg-paper">
      <p className="dieg-note__body">{clue.body}</p>
    </div>
  )
}

export function Diegetic({ clue, discovered = [] }: { clue: TokensClue; discovered?: string[] }) {
  const C = clue.variant ? BY_VARIANT[clue.variant] : undefined
  if (C) return <C clue={clue} discovered={discovered} />
  // 폴백: 일반 토큰 칩
  return (
    <div className="tokens">
      {clue.tokens.map((t, i) => (
        <span className="token" key={i} style={t.hex ? { color: t.hex, borderColor: t.hex } : undefined}>{t.text}</span>
      ))}
    </div>
  )
}
