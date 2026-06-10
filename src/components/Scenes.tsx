import type { JSX } from 'react'

// 홍길동전(esc_7) 무대 — 가로(16:9) 와이드 룸. 레퍼런스 톤: 쪽빛 밤 + 등롱 주황 + 한지 + 단청.
// 김홍도풍 수묵담채의 단순한 면 분할. 배경 회화(public/rooms/*.png)가 위에 얹히므로
// 셸은 "비교적 빈" 구도 + 분위기 레이어만 책임진다. 물체는 Objects.tsx 가 그린다. viewBox 0 0 160 90.

const NIGHT = '#1a2238', AMBER = '#c9762b', HANJI = '#efe6d0'
const DAN_G = '#2e6e4e', DAN_R = '#b82647'

/** 가장자리 비네트 — cold: 푸른 밤 / 아니면 먹빛 */
function Vignette({ strength = 0.55 }: { strength?: number }) {
  return (
    <>
      <radialGradient id="hgsVig" cx="46%" cy="44%" r="78%">
        <stop offset="52%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#0a0e18" stopOpacity={strength} />
      </radialGradient>
      <rect x="0" y="0" width="160" height="90" fill="url(#hgsVig)" />
    </>
  )
}

/** 등롱(燈籠) — 따뜻한 불빛 웅덩이 */
function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y - 8} x2={x} y2={y - 3} stroke="#241a0e" strokeWidth="0.8" />
      <path d={`M${x - 3.4} ${y - 3} h6.8 l-1 8 h-4.8 z`} fill={AMBER} opacity="0.92" stroke="#5e3414" strokeWidth="0.7" />
      <rect x={x - 3.8} y={y - 3.6} width="7.6" height="1.4" rx="0.6" fill="#3a2412" />
      <ellipse cx={x} cy={y + 1} rx="1.6" ry="2.6" fill="#fff3c4" opacity="0.9" />
      <circle cx={x} cy={y + 1} r="11" fill="#ffd9a0" opacity="0.13" />
    </g>
  )
}

/** R1 별당 — 밤. 한지 창호 든 달빛 · 촛불 · 낮은 좌식 가구의 그늘 */
function Byeoldang(): JSX.Element {
  return (
    <svg className="scene" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hgsBwall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262a3c" /><stop offset="100%" stopColor="#1c2030" />
        </linearGradient>
        <linearGradient id="hgsBfloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3826" /><stop offset="100%" stopColor="#2c2014" />
        </linearGradient>
        <radialGradient id="hgsBcandle" cx="30%" cy="58%" r="55%">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#ffd9a0" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="90" fill="#141826" />
      {/* 뒷벽 — 한지 도배 면, 띠장 */}
      <rect x="0" y="8" width="160" height="54" fill="url(#hgsBwall)" />
      {[40, 80, 120].map((x) => <line key={x} x1={x} y1="8" x2={x} y2="62" stroke="#141826" strokeWidth="1" opacity="0.7" />)}
      <line x1="0" y1="34" x2="160" y2="34" stroke="#141826" strokeWidth="0.8" opacity="0.5" />
      {/* 천장 보 */}
      <rect x="0" y="0" width="160" height="8" fill="#171310" />
      <rect x="0" y="7" width="160" height="2" fill="#241a0e" />
      {/* 창호 — 달빛이 살을 비춘다 (우중앙) */}
      <g>
        <rect x="96" y="14" width="30" height="40" fill="#2c3654" stroke="#11151f" strokeWidth="1.4" />
        <rect x="98" y="16" width="26" height="36" fill="#8fa0c8" opacity="0.5" />
        {[104, 110, 116, 122].map((x) => <line key={x} x1={x} y1="16" x2={x} y2="52" stroke="#11151f" strokeWidth="1" />)}
        {[25, 34, 43].map((y) => <line key={y} x1="98" y1={y} x2="124" y2={y} stroke="#11151f" strokeWidth="1" />)}
        {/* 창살 너머 그림자 — 칼 찬 자객의 실루엣 암시 */}
        <path d="M114 24 q3 5 1 12 q4 2 3 8 l-6 8 l-4 -10 q-2 -8 2 -12 z" fill="#1a2238" opacity="0.55" />
        {/* 달빛이 방바닥까지 */}
        <polygon points="98,54 124,54 138,82 90,82" fill="#8fa0c8" opacity="0.09" />
      </g>
      {/* 방바닥(장판) */}
      <polygon points="0,82 0,62 160,62 160,82" fill="url(#hgsBfloor)" />
      <rect x="0" y="82" width="160" height="8" fill="#1e1610" />
      {[30, 70, 110, 150].map((x, i) => (
        <line key={x} x1={x - i * 2} y1="62" x2={x + i * 3} y2="90" stroke="#1e1610" strokeWidth="0.6" opacity="0.6" />
      ))}
      {/* 좌측 — 서안(낮은 책상)과 촛대 실루엣 */}
      <g>
        <rect x="22" y="56" width="30" height="3" rx="1" fill="#241a0e" />
        <path d="M25 59 l-2 8 M49 59 l2 8" stroke="#241a0e" strokeWidth="1.6" />
        <rect x="40" y="46" width="2.4" height="10" rx="1" fill="#3a2c1a" />
        <ellipse cx="41.2" cy="44" rx="2" ry="3.2" fill="#ffd9a0" opacity="0.95" />
        <ellipse cx="41.2" cy="44.6" rx="0.9" ry="1.6" fill="#fff3c4" opacity="0.95" />
      </g>
      {/* 촛불 빛 웅덩이 + 처마 밖 어둠 */}
      <rect x="0" y="0" width="160" height="90" fill="url(#hgsBcandle)" />
      <Vignette strength={0.6} />
    </svg>
  )
}

/** R2 도적 소굴 — 폭포 뒤 동굴. 물커튼의 냉광 + 횃불의 온광 */
function Cave(): JSX.Element {
  return (
    <svg className="scene" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hgsCrock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262c38" /><stop offset="100%" stopColor="#161c26" />
        </linearGradient>
        <radialGradient id="hgsCtorch" cx="66%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#ffb45e" stopOpacity="0.2" /><stop offset="100%" stopColor="#ffb45e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="90" fill="#0e131c" />
      <rect x="0" y="0" width="160" height="64" fill="url(#hgsCrock)" />
      {/* 천장 바위 이빨 */}
      {[12, 36, 62, 90, 116, 142].map((x, i) => (
        <path key={x} d={`M${x - 8} 0 q8 ${18 + (i % 3) * 7} 8 ${22 + (i % 3) * 8} q1 -${5 + (i % 2) * 3} 8 -${22 + (i % 3) * 8} z`}
          fill="#1a212c" opacity="0.95" />
      ))}
      {/* 벽 바위 면 분할 */}
      <path d="M0 30 q22 6 34 22 l-6 38 H0 z" fill="#1f2632" opacity="0.8" />
      <path d="M160 24 q-26 8 -36 26 l8 40 h28 z" fill="#171d28" opacity="0.9" />
      {/* 폭포 — 좌측 물커튼(입구의 빛) */}
      <g>
        <polygon points="6,0 30,0 34,78 2,78" fill="#3c5a78" opacity="0.5" />
        {[10, 16, 22, 28].map((x, i) => (
          <path key={x} d={`M${x} 0 q${i % 2 ? 2.4 : -2.4} 40 ${i % 2 ? 1 : -1} 78`} stroke="#9ec4d8" strokeWidth="3.4" fill="none" opacity="0.55" />
        ))}
        {[13, 19, 25].map((x) => (
          <path key={x} d={`M${x} 4 q1.6 38 1 72`} stroke="#e8f4fa" strokeWidth="1" fill="none" opacity="0.5" />
        ))}
        <ellipse cx="18" cy="80" rx="20" ry="4.6" fill="#cfe6f2" opacity="0.22" />
        <ellipse cx="20" cy="77" rx="12" ry="2.6" fill="#e8f4fa" opacity="0.18" />
      </g>
      {/* 바닥 — 너른 바위 */}
      <polygon points="0,84 12,62 148,62 160,84" fill="#2c303a" />
      <rect x="0" y="84" width="160" height="6" fill="#20242c" />
      {[44, 80, 116].map((x) => (
        <line key={x} x1={x} y1="62" x2={(x - 80) * 1.4 + 80} y2="90" stroke="#1a1e26" strokeWidth="0.6" opacity="0.7" />
      ))}
      {/* 잔치 자리 — 멍석과 흩어진 윷가락 암시(우측) */}
      <g>
        <ellipse cx="112" cy="74" rx="20" ry="5" fill="#4a3a26" opacity="0.65" />
        {[104, 110, 117].map((x, i) => (
          <rect key={x} x={x} y={71 + (i % 2)} width="7" height="1.6" rx="0.8" fill="#c8b894" opacity="0.7" transform={`rotate(${i * 24 - 20} ${x + 3.5} ${72 + (i % 2)})`} />
        ))}
      </g>
      {/* 횃불 둘 */}
      {[{ x: 64, y: 26 }, { x: 136, y: 30 }].map(({ x, y }) => (
        <g key={x}>
          <rect x={x - 1} y={y + 5} width="2" height="11" rx="1" fill="#241a0e" transform={`rotate(7 ${x} ${y + 10})`} />
          <ellipse cx={x} cy={y + 2} rx="2.8" ry="5" fill="#ffb45e" opacity="0.9" />
          <ellipse cx={x} cy={y + 0.8} rx="1.3" ry="2.6" fill="#fff3c4" opacity="0.9" />
          <circle cx={x} cy={y + 2} r="9" fill="#ffd9a0" opacity="0.15" />
        </g>
      ))}
      <rect x="0" y="0" width="160" height="90" fill="url(#hgsCtorch)" />
      <Vignette strength={0.62} />
    </svg>
  )
}

/** R3 해인사 마당 — 오후. 따뜻한 흙마당 · 석탑 · 대웅전 처마 단청 */
function Haeinsa(): JSX.Element {
  return (
    <svg className="scene" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hgsHsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdb98e" /><stop offset="100%" stopColor="#e8d9b0" />
        </linearGradient>
        <linearGradient id="hgsHground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c2ad84" /><stop offset="100%" stopColor="#a08a62" />
        </linearGradient>
        <radialGradient id="hgsHsun" cx="74%" cy="14%" r="40%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.5" /><stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="90" fill="url(#hgsHsky)" />
      {/* 먼 산 두 겹 */}
      <path d="M0 36 q20 -14 38 -6 q16 -12 34 -4 q14 -8 30 -2 q18 -10 36 0 q12 -4 22 2 V58 H0 z" fill="#8a9a80" opacity="0.55" />
      <path d="M0 44 q26 -10 50 -2 q22 -10 46 -2 q22 -8 44 0 q10 -2 20 2 V60 H0 z" fill="#6e8068" opacity="0.6" />
      {/* 흙마당 */}
      <rect x="0" y="56" width="160" height="34" fill="url(#hgsHground)" />
      <path d="M0 56 h160" stroke="#8a7656" strokeWidth="0.8" opacity="0.6" />
      {[[30, 66], [74, 74], [120, 64], [96, 82], [48, 84]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={7 + (i % 3) * 3} ry="1.4" fill="#8a7656" opacity="0.35" />
      ))}
      {/* 석탑(좌) — 기단 + 3층 */}
      <g>
        <rect x="20" y="60" width="26" height="5" fill="#9a9d90" stroke="#5e6156" strokeWidth="0.8" />
        <rect x="23" y="52" width="20" height="8" fill="#8e9184" stroke="#5e6156" strokeWidth="0.8" />
        {[0, 1, 2].map((t) => (
          <g key={t}>
            <rect x={26 + t * 2.4} y={44 - t * 9} width={14 - t * 4.8} height="6" fill="#8e9184" stroke="#5e6156" strokeWidth="0.7" />
            <rect x={24 + t * 2.4} y={42 - t * 9} width={18 - t * 4.8} height="2.4" fill="#7b7e72" stroke="#5e6156" strokeWidth="0.6" />
          </g>
        ))}
        <line x1="33" y1="17" x2="33" y2="24" stroke="#5e6156" strokeWidth="1.2" />
        {/* 탑 그림자 — 오후 해 */}
        <path d="M20 65 l-14 7 h24 z" fill="#5e5240" opacity="0.3" />
      </g>
      {/* 대웅전 처마 모서리(우상) — 단청 띠 */}
      <g>
        <path d="M104 4 L160 0 V18 L112 20 q-6 -2 -8 -8 q0 -6 0 -8 z" fill="#3a4148" />
        <path d="M104 4 q-7 8 -14 10 q10 2 16 -2" fill="#3a4148" />
        <rect x="108" y="18" width="52" height="4.6" fill={DAN_G} />
        <rect x="108" y="22.6" width="52" height="1.8" fill={DAN_R} />
        {[118, 132, 146].map((x) => <rect key={x} x={x} y="24.4" width="4.6" height="6" fill="#8a3b2c" />)}
        {/* 풍경(風磬) */}
        <line x1="104" y1="14" x2="104" y2="20" stroke="#3a3026" strokeWidth="0.7" />
        <path d="M101.6 20 h4.8 l-2.4 4.6 z" fill="#82662a" />
      </g>
      {/* 잔치 멍석(우하) — 비교적 비워 둠 */}
      <ellipse cx="118" cy="78" rx="22" ry="4.6" fill="#b09a6e" opacity="0.5" />
      <rect x="0" y="0" width="160" height="90" fill="url(#hgsHsun)" />
      <Vignette strength={0.3} />
    </svg>
  )
}

/** R4 함경 읍성 감영 — 저녁. 노을 하늘 · 성벽 여장 · 문루 실루엣 · 방(榜) */
function Gamyeong(): JSX.Element {
  return (
    <svg className="scene" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hgsGsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3050" /><stop offset="62%" stopColor="#6e4a4a" /><stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <linearGradient id="hgsGground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4034" /><stop offset="100%" stopColor="#2e2820" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(#hgsGsky)" />
      <circle cx="36" cy="38" r="7" fill="#e8b06a" opacity="0.75" />
      <circle cx="36" cy="38" r="13" fill="#e8b06a" opacity="0.18" />
      {/* 성벽 — 여장(凹凸) 능선 */}
      <g>
        <path d="M0 44 h160 v18 H0 z" fill="#3c3830" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={2 + i * 16.4} y="38" width="9.6" height="7" fill="#3c3830" />
        ))}
        <line x1="0" y1="44.6" x2="160" y2="44.6" stroke="#241f18" strokeWidth="0.8" opacity="0.8" />
        {[18, 52, 86, 120, 152].map((x) => <line key={x} x1={x} y1="46" x2={x} y2="62" stroke="#241f18" strokeWidth="0.6" opacity="0.6" />)}
      </g>
      {/* 문루(우) — 석축 홍예 + 겹처마 실루엣 */}
      <g>
        <rect x="108" y="34" width="48" height="28" fill="#332e26" />
        <path d="M122 62 V48 q10 -10 20 0 v14 z" fill="#1c1812" />
        <path d="M104 34 q28 -8 56 0 l-4 -7 q-24 -7 -48 0 z" fill="#23282e" />
        <path d="M100 27 q32 -9 64 0 l-5 -7 q-27 -8 -54 0 z" fill="#1c2026" />
        <path d="M100 27 q-4 0 -7 -4 M164 27 q4 0 7 -4" stroke="#1c2026" strokeWidth="2.4" fill="none" />
        {/* 깃대 */}
        <line x1="114" y1="34" x2="114" y2="16" stroke="#241f18" strokeWidth="1" />
        <path d="M114 16 h9 q-1.6 3 0 6 h-9 z" fill={DAN_R} opacity="0.85" />
      </g>
      {/* 거리 바닥 */}
      <rect x="0" y="62" width="160" height="28" fill="url(#hgsGground)" />
      {[36, 80, 124].map((x) => (
        <line key={x} x1={x} y1="62" x2={(x - 80) * 1.4 + 80} y2="90" stroke="#241f18" strokeWidth="0.6" opacity="0.55" />
      ))}
      <line x1="0" y1="74" x2="160" y2="74" stroke="#241f18" strokeWidth="0.5" opacity="0.5" />
      {/* 성벽의 방(榜) — 한지 게시 두 장(좌) */}
      <g>
        <rect x="22" y="48" width="9" height="12" fill={HANJI} opacity="0.9" transform="rotate(-2 26 54)" />
        <rect x="40" y="49" width="9" height="12" fill={HANJI} opacity="0.82" transform="rotate(1.6 44 55)" />
        {[50.5, 53.5, 56.5].map((y) => <line key={y} x1="24" y1={y} x2="29" y2={y} stroke="#6a5436" strokeWidth="0.6" opacity="0.8" />)}
        {[51.5, 54.5, 57.5].map((y) => <line key={y} x1="42" y1={y} x2="47" y2={y} stroke="#6a5436" strokeWidth="0.6" opacity="0.8" />)}
      </g>
      <Lantern x={66} y={52} />
      <Vignette strength={0.48} />
    </svg>
  )
}

/** R5 대궐 앞뜰 — 밤 뇌우. 박석 · 근정문 실루엣 · 빗줄기 · 번개 잔광 */
function Daegwol(): JSX.Element {
  return (
    <svg className="scene" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hgsDsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1020" /><stop offset="100%" stopColor={NIGHT} />
        </linearGradient>
        <linearGradient id="hgsDstone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4050" /><stop offset="100%" stopColor="#262c3a" />
        </linearGradient>
        <radialGradient id="hgsDflash" cx="58%" cy="22%" r="46%">
          <stop offset="0%" stopColor="#cfe0ff" stopOpacity="0.32" /><stop offset="100%" stopColor="#cfe0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="90" fill="url(#hgsDsky)" />
      {/* 번개 잔광 + 구름 머리 */}
      <rect x="0" y="0" width="160" height="60" fill="url(#hgsDflash)" />
      <path d="M0 10 q18 -8 36 -2 q14 -8 30 -2 q18 -8 36 0 q16 -6 32 0 q14 -4 26 2 V0 H0 z" fill="#080c18" opacity="0.9" />
      <path d="M92 12 l-6 11 h5 l-7 12" stroke="#cfe0ff" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
      {/* 근정문 실루엣 — 석축 기단 + 홍예 셋 + 겹처마 */}
      <g>
        <rect x="34" y="40" width="92" height="20" fill="#10131e" />
        {[52, 80, 108].map((x) => <path key={x} d={`M${x - 7} 60 V50 q7 -8 14 0 v10 z`} fill="#060810" />)}
        <path d="M30 40 q50 -10 100 0 l-5 -8 q-45 -9 -90 0 z" fill="#0c1018" />
        <path d="M26 32 q54 -12 108 0 l-6 -8 q-48 -10 -96 0 z" fill="#0a0d16" />
        <path d="M26 32 q-5 1 -9 -4 M134 32 q5 1 9 -4" stroke="#0a0d16" strokeWidth="2.6" fill="none" />
        {/* 단청 띠 흔적 — 번개에 잠깐 비치는 색 */}
        <rect x="38" y="41" width="84" height="2" fill={DAN_G} opacity="0.4" />
        <rect x="38" y="43" width="84" height="1" fill={DAN_R} opacity="0.32" />
        {/* 처마 끝 취두 */}
        <path d="M30 24 q2 -4 6 -4 M130 24 q-2 -4 -6 -4" stroke="#0a0d16" strokeWidth="2" fill="none" />
      </g>
      {/* 박석 앞뜰 — 원근 격자 */}
      <polygon points="0,90 0,66 160,66 160,90" fill="url(#hgsDstone)" />
      <line x1="0" y1="66" x2="160" y2="66" stroke="#171c28" strokeWidth="0.9" />
      {[20, 50, 80, 110, 140].map((x) => (
        <line key={x} x1={x} y1="66" x2={(x - 80) * 1.5 + 80} y2="90" stroke="#171c28" strokeWidth="0.7" opacity="0.75" />
      ))}
      {[73, 81].map((y, i) => <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="#171c28" strokeWidth="0.6" opacity={0.7 - i * 0.2} />)}
      {/* 빗물 고임 — 차가운 반사 */}
      <ellipse cx="52" cy="80" rx="14" ry="2.2" fill="#8fa0c8" opacity="0.14" />
      <ellipse cx="116" cy="74" rx="10" ry="1.8" fill="#8fa0c8" opacity="0.12" />
      {/* 빗줄기 — 사선 정적 레이어 */}
      <g opacity="0.5">
        {Array.from({ length: 22 }).map((_, i) => {
          const x = (i * 23) % 160 + (i % 3) * 4
          const y = (i * 37) % 70
          return <line key={i} x1={x} y1={y} x2={x - 3.4} y2={y + 12} stroke="#aab8d8" strokeWidth="0.5" opacity="0.4" />
        })}
      </g>
      <Vignette strength={0.6} />
    </svg>
  )
}

const REGISTRY: Record<string, () => JSX.Element> = {
  'room-byeoldang': Byeoldang,
  'room-cave': Cave,
  'room-haeinsa': Haeinsa,
  'room-gamyeong': Gamyeong,
  'room-daegwol': Daegwol,
}

export function Scene({ roomId }: { roomId: string }) {
  const C = REGISTRY[roomId] ?? Byeoldang
  return (
    <>
      <C />
      {/* 떠다니는 먼지·불티 */}
      <div className="bubbles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ left: `${6 + i * 12}%`, animationDelay: `${i * 1.9}s`, animationDuration: `${10 + (i % 4) * 3}s` }} />
        ))}
      </div>
    </>
  )
}
