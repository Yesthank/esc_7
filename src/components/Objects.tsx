import type { JSX } from 'react'

// 물체 = 히트박스. 회화 배경 위에 얹히는 "소품"이므로 한지·옻칠 나무·돌·놋쇠 질감으로 마감한다.
// 홍길동전(esc_7) 테마: 쪽빛 밤 + 등롱 주황 + 한지 + 단청 적/녹. 김홍도풍 수묵담채의 단순·가독 우선.
// (그라디언트 id 는 hgo- 프리픽스 고정 — 동일 정의의 중복은 무해)
const HANJI = '#efe6d0', HANJI_D = '#cbbd9a', NIGHT = '#1a2238', AMBER = '#c9762b'
const DAN_G = '#2e6e4e', DAN_R = '#b82647', DAN_B = '#1e4c9a', DAN_Y = '#d9a514'
const WOOD = '#6b4a2c', WOOD_D = '#412e1a', LACQ = '#2b2014', INK = '#33291c'
const STONE = '#7b7e72', STONE_D = '#4d5046', BRASS = '#c9a14b', BRASS_D = '#82662a'
const STRAW = '#c8a14e'

type Kind =
  | 'bookcase' | 'almanac' | 'pouch' | 'banjeol' | 'lining'
  | 'yutrecord' | 'yutboard' | 'georeumsu' | 'sangaji' | 'sanpyo'
  | 'ledger' | 'sinsang' | 'lotus' | 'taenghwa' | 'meoricho'
  | 'flags' | 'palgwae' | 'typecase' | 'gyeokja'
  | 'jeung' | 'note' | 'pouchreturn'
  | 'mungap' | 'pouchbox' | 'stonedial' | 'grainchest' | 'almsbox'
  | 'sacredcab' | 'gatelock' | 'typelock' | 'hopaedial' | 'cipherbook'
  | 'walldoor' | 'falldoor' | 'templedoor' | 'northgate'

const KIND_BY_LABEL: Record<string, Kind> = {
  // R1 별당
  '서가의 책갑': 'bookcase',
  '문갑 자물쇠': 'mungap',
  '책상 위 책력': 'almanac',
  '어머니의 복주머니': 'pouch',
  '언문 반절표 족자': 'banjeol',
  '복주머니 함': 'pouchbox',
  '복주머니 안감': 'lining',
  '담장 뒷문': 'walldoor',
  // R2 도적 소굴
  '바위의 윷 기록': 'yutrecord',
  '바위에 새긴 윷판': 'yutboard',
  '돌문 윷판': 'stonedial',
  '귀퉁이의 걸음수 새김': 'georeumsu',
  '노름판의 산가지': 'sangaji',
  '벽의 산가지 숫자표': 'sanpyo',
  '군량 궤': 'grainchest',
  '폭포 뒤 통로': 'falldoor',
  // R3 해인사
  '시주 명부': 'ledger',
  '신상과 해 그림자': 'sinsang',
  '시주함': 'almsbox',
  '단청 연꽃 토큰': 'lotus',
  '오방신장 행렬 탱화': 'taenghwa',
  '대웅전 머리초 띠': 'meoricho',
  '성물장 자물쇠': 'sacredcab',
  '일주문 뒷길': 'templedoor',
  // R4 감영
  '사대문의 괘 깃발': 'flags',
  '관상감 팔괘도 병풍': 'palgwae',
  '문루 자물쇠': 'gatelock',
  '목활자함': 'typecase',
  '조합 격자 인쇄 견본': 'gyeokja',
  '활자함 자물쇠': 'typelock',
  '북문': 'northgate',
  // R5 대궐 앞뜰
  '여덟 길동': 'jeung',
  '간수의 증언': 'note',
  '화공의 메모': 'note',
  '호패 다이얼': 'hopaedial',
  '돌려받은 복주머니': 'pouchreturn',
  '어머니의 책': 'cipherbook',
}

export const CLUE_KEY_BY_LABEL: Record<string, string> = {
  '서가의 책갑': 'hg-ganji',
  '책상 위 책력': 'hg-chaekryeok',
  '어머니의 복주머니': 'hg-pouch',
  '언문 반절표 족자': 'hg-banjeol',
  '복주머니 안감': 'hg-lining',
  '바위의 윷 기록': 'hg-yut',
  '바위에 새긴 윷판': 'hg-yutboard',
  '귀퉁이의 걸음수 새김': 'hg-georeumsu',
  '노름판의 산가지': 'hg-sangaji',
  '벽의 산가지 숫자표': 'hg-sanpyo',
  '시주 명부': 'hg-shadow',
  '신상과 해 그림자': 'hg-sinsang',
  '단청 연꽃 토큰': 'hg-obang',
  '오방신장 행렬 탱화': 'hg-haengnyeol',
  '대웅전 머리초 띠': 'hg-meoricho',
  '사대문의 괘 깃발': 'hg-trigram',
  '관상감 팔괘도 병풍': 'hg-palgwae',
  '목활자함': 'hg-type',
  '조합 격자 인쇄 견본': 'hg-gyeokja',
  '여덟 길동': 'hg-jeung',
  '간수의 증언': 'hg-gansu',
  '화공의 메모': 'hg-hwagong',
  // 인터스티셜에서 돌려받은 그 복주머니 — 안감 좌표 단서를 R5 에서 다시 수첩에 띄운다(R1 복선 회수).
  '돌려받은 복주머니': 'hg-lining',
  '어머니의 책': 'honggildong-cipher',
}

type P = { open?: boolean; solved?: boolean }
const S = (vb: string, c: JSX.Element) => (
  <svg className="object-art" viewBox={vb} preserveAspectRatio="xMidYMid meet" aria-hidden="true">{c}</svg>
)

/** 공용 그라디언트 정의 */
const Defs = () => (
  <defs>
    <linearGradient id="hgoWood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#82603a" /><stop offset="55%" stopColor={WOOD} /><stop offset="100%" stopColor={WOOD_D} />
    </linearGradient>
    <linearGradient id="hgoLacq" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#4a3826" /><stop offset="60%" stopColor={LACQ} /><stop offset="100%" stopColor="#1a130a" />
    </linearGradient>
    <linearGradient id="hgoHanji" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={HANJI} /><stop offset="100%" stopColor={HANJI_D} />
    </linearGradient>
    <linearGradient id="hgoStone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#8e9184" /><stop offset="60%" stopColor={STONE} /><stop offset="100%" stopColor={STONE_D} />
    </linearGradient>
    <linearGradient id="hgoBrass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#e7c878" /><stop offset="45%" stopColor={BRASS} /><stop offset="100%" stopColor={BRASS_D} />
    </linearGradient>
    <radialGradient id="hgoGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.5" /><stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
    </radialGradient>
  </defs>
)

/** 놋 장석 못 */
const Stud = ({ x, y, r = 1.6 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={BRASS_D} />
    <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.42} fill="#efd9a0" opacity="0.85" />
  </g>
)

/** 해정 체크 표 */
const Check = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path d={`M${x - 6 * s} ${y} l${4.6 * s} ${5.4 * s} l${8 * s} -${10 * s}`} fill="none"
    stroke="#9fd49a" strokeWidth={2.6 * s} strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
)

/** 다이얼 창 줄 — solved: 호박빛 채움 */
const Windows = ({ xs, y, w = 12, h = 18, solved, glyphs }: { xs: number[]; y: number; w?: number; h?: number; solved?: boolean; glyphs?: string[] }) => (
  <g>
    {xs.map((x, i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} rx="2" fill={NIGHT} stroke={BRASS_D} strokeWidth="1" />
        <rect x={x + 1.2} y={y + 1.2} width={w - 2.4} height={h * 0.26} rx="1.2" fill="#cfe0ff" opacity="0.08" />
        {solved
          ? <rect x={x + 1.2} y={y + 1.2} width={w - 2.4} height={h - 2.4} rx="1.4" fill={AMBER} opacity="0.3" />
          : null}
        {solved && glyphs?.[i] && (
          <text x={x + w / 2} y={y + h / 2 + h * 0.18} textAnchor="middle" fontSize={h * 0.52}
            fontFamily="serif" fill="#efd9a0">{glyphs[i]}</text>
        )}
      </g>
    ))}
  </g>
)

/** 맹꽁이 걸쇠 — solved: 젖혀져 열림 */
const Shackle = ({ cx, top, solved }: { cx: number; top: number; solved?: boolean }) => (
  <g transform={solved ? `rotate(38 ${cx + 18} ${top + 13})` : undefined}>
    <path d={`M${cx - 18} ${top + 13} q0 -13 18 -13 q18 0 18 13`} fill="none" stroke="#8a8a7a" strokeWidth="6" />
    <path d={`M${cx - 18} ${top + 13} q0 -13 18 -13`} fill="none" stroke="#d8d8c8" strokeWidth="1.6" opacity="0.6" />
  </g>
)

/** 괘(трigram) — SVG 전용 렌더(유니코드 금지). lines: 위→아래, true=양(통획) false=음(끊긴 획) */
const Tri = ({ x, y, w = 14, lines, color = INK, sw = 2.2 }: { x: number; y: number; w?: number; lines: [boolean, boolean, boolean]; color?: string; sw?: number }) => (
  <g>
    {lines.map((solid, i) => {
      const ly = y + i * (sw + 2.4)
      return solid
        ? <line key={i} x1={x} y1={ly} x2={x + w} y2={ly} stroke={color} strokeWidth={sw} strokeLinecap="butt" />
        : (
          <g key={i}>
            <line x1={x} y1={ly} x2={x + w * 0.42} y2={ly} stroke={color} strokeWidth={sw} />
            <line x1={x + w * 0.58} y1={ly} x2={x + w} y2={ly} stroke={color} strokeWidth={sw} />
          </g>
        )
    })}
  </g>
)

/** 산가지 묶음 — SVG 전용(획 굵기 보장). n: 1~9 */
const Rods = ({ x, y, n, h = 14, color = INK }: { x: number; y: number; n: number; h?: number; color?: string }) => {
  const over = n > 5
  const sticks = over ? n - 5 : n
  return (
    <g>
      {over && <line x1={x - 1} y1={y - 3.4} x2={x + sticks * 3.6 - 1.6} y2={y - 3.4} stroke={color} strokeWidth="2" strokeLinecap="round" />}
      {Array.from({ length: sticks }).map((_, i) => (
        <line key={i} x1={x + i * 3.6} y1={y} x2={x + i * 3.6} y2={y + h} stroke={color} strokeWidth="2" strokeLinecap="round" />
      ))}
    </g>
  )
}

/* ───────────────────────── R1 별당 ───────────────────────── */

/** 서가의 책갑 — 천간 표지 4질, 차례 잃은 채 */
const Bookcase = (_: P) => S('0 0 110 84', (
  <g>
    <Defs />
    <rect x="6" y="8" width="98" height="70" rx="2" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1.4" />
    <rect x="10" y="64" width="90" height="4" fill={WOOD_D} />
    {/* 책갑 4질 — 丁1 · 甲4 · 戊6 · 乙2 (비단조) */}
    {[
      { x: 14, ch: '丁', n: '1', c: '#5c7a8a' }, { x: 36, ch: '甲', n: '4', c: '#7a5c4a' },
      { x: 58, ch: '戊', n: '6', c: '#5c6e52' }, { x: 80, ch: '乙', n: '2', c: '#8a6a4e' },
    ].map(({ x, ch, n, c }, i) => (
      <g key={i} transform={`rotate(${[-2, 1.5, -1, 2][i]} ${x + 8} 44)`}>
        <rect x={x} y="18" width="16" height="46" rx="1.6" fill={c} stroke="#1f1810" strokeWidth="1" />
        <rect x={x} y="18" width="16" height="6" fill="#1f1810" opacity="0.35" />
        <rect x={x + 3} y="27" width="10" height="14" rx="1" fill="url(#hgoHanji)" />
        <text x={x + 8} y="38" textAnchor="middle" fontSize="9" fontFamily="serif" fill={INK}>{ch}</text>
        <circle cx={x + 8} cy="52" r="4.6" fill="none" stroke={HANJI_D} strokeWidth="0.9" opacity="0.85" />
        <text x={x + 8} y="55" textAnchor="middle" fontSize="6.4" fontFamily="serif" fill={HANJI}>{n}</text>
      </g>
    ))}
  </g>
))

/** 책상 위 책력 — 천간 10자 3열 병기 펼침면 */
const Almanac = (_: P) => S('0 0 104 76', (
  <g transform="rotate(-2 52 38)">
    <Defs />
    <path d="M9 13 h88 v52 h-88 z" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="8" y="12" width="88" height="52" rx="2" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.2" />
    <line x1="52" y1="12" x2="52" y2="64" stroke="#a8946a" strokeWidth="1" opacity="0.8" />
    {/* 좌면: 甲갑1 · 乙을2 · 丙병3 / 우면: 丁정4 · … */}
    {[['甲', '갑', '1'], ['乙', '을', '2'], ['丙', '병', '3']].map(([h, k, n], r) => (
      <g key={r}>
        <text x="17" y={26 + r * 13} fontSize="8" fontFamily="serif" fill={INK}>{h}</text>
        <text x="29" y={26 + r * 13} fontSize="6" fontFamily="serif" fill="#6a5436">{k}</text>
        <text x="40" y={26 + r * 13} fontSize="6.4" fontFamily="serif" fill={DAN_R}>{n}</text>
      </g>
    ))}
    {[['丁', '정', '4'], ['戊', '무', '5'], ['己', '기', '6']].map(([h, k, n], r) => (
      <g key={r}>
        <text x="59" y={26 + r * 13} fontSize="8" fontFamily="serif" fill={INK}>{h}</text>
        <text x="71" y={26 + r * 13} fontSize="6" fontFamily="serif" fill="#6a5436">{k}</text>
        <text x="82" y={26 + r * 13} fontSize="6.4" fontFamily="serif" fill={DAN_R}>{n}</text>
      </g>
    ))}
    <text x="88" y="60" textAnchor="end" fontSize="5.6" fontFamily="serif" fill="#6a5436">…癸10</text>
  </g>
))

/** 어머니의 복주머니 — 수실이 자음을 꿴다 (ㅈ→ㅅ→ㄱ→ㅁ) */
const Pouch = (_: P) => S('0 0 90 96', (
  <g>
    <Defs />
    {/* 끈·매듭 */}
    <path d="M45 8 q-7 5 -4 10 M45 8 q7 5 4 10" stroke={DAN_R} strokeWidth="1.8" fill="none" />
    <circle cx="45" cy="9" r="2.2" fill={DAN_R} />
    {/* 주머니 본체(주름) */}
    <path d="M24 26 q-9 14 -8 34 q1 22 29 24 q28 -2 29 -24 q1 -20 -8 -34 q-10 -8 -21 -8 q-11 0 -21 8 z"
      fill="#9a3552" stroke="#5e1e32" strokeWidth="1.6" />
    <path d="M30 22 q-4 12 -3 20 M60 22 q4 12 3 20 M45 18 v14" stroke="#5e1e32" strokeWidth="1" opacity="0.6" fill="none" />
    {/* 수실 한 가닥이 네 낱자를 잇는다 — 진한 첫 매듭(ㅈ) */}
    <polyline points="32,46 58,42 36,64 56,70" fill="none" stroke={DAN_Y} strokeWidth="1.4" strokeDasharray="2.6 1.8" opacity="0.95" />
    <circle cx="32" cy="46" r="3" fill={DAN_Y} />
    {[
      { x: 32, y: 46, ch: 'ㅈ' }, { x: 58, y: 42, ch: 'ㅅ' },
      { x: 36, y: 64, ch: 'ㄱ' }, { x: 56, y: 70, ch: 'ㅁ' },
    ].map(({ x, y, ch }, i) => (
      <text key={i} x={x} y={y - 4.6} textAnchor="middle" fontSize="8.4" fontFamily="serif" fontWeight="700"
        fill={HANJI} stroke="#5e1e32" strokeWidth="0.4">{ch}</text>
    ))}
    {/* 술 장식 */}
    <path d="M45 84 v7 M41 84 l-2 6 M49 84 l2 6" stroke={DAN_Y} strokeWidth="1.2" strokeLinecap="round" />
  </g>
))

/** 언문 반절표 족자 — 서당 가나다 차트 */
const Banjeol = (_: P) => S('0 0 80 100', (
  <g>
    <Defs />
    <rect x="14" y="6" width="52" height="5" rx="2.4" fill="url(#hgoWood)" />
    <rect x="16" y="11" width="48" height="76" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.2" />
    <rect x="14" y="87" width="52" height="5" rx="2.4" fill="url(#hgoWood)" />
    {['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'].map((ch, i) => (
      <g key={ch}>
        <text x={24 + (i % 2) * 22} y={28 + Math.floor(i / 2) * 22} textAnchor="middle" fontSize="10"
          fontFamily="serif" fill={INK}>{ch}</text>
        <text x={24 + (i % 2) * 22} y={37 + Math.floor(i / 2) * 22} textAnchor="middle" fontSize="5.4"
          fontFamily="serif" fill={DAN_R}>{i + 1}</text>
      </g>
    ))}
    <text x="40" y="74" textAnchor="middle" fontSize="6.4" fontFamily="serif" fill="#6a5436">…ㅎ14</text>
    <line x1="40" y1="2" x2="40" y2="6" stroke="#6a5436" strokeWidth="1" />
  </g>
))

/** 복주머니 안감 — 뒤집힌 안감, 바늘땀 수 쌍(비강조 추상) */
const Lining = (_: P) => S('0 0 96 76', (
  <g>
    <Defs />
    <path d="M16 20 q-6 18 2 34 q10 14 30 14 q20 0 30 -14 q8 -16 2 -34 q-16 -10 -32 -10 q-16 0 -32 10 z"
      fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.4" />
    <path d="M20 24 q-4 14 2 28 M76 24 q4 14 -2 28" stroke="#c4b48e" strokeWidth="1" fill="none" opacity="0.8" />
    {/* 짝지은 바늘땀 — 앞 수 : 뒤 수 */}
    {[[30, 34], [48, 30], [62, 40], [36, 50], [56, 56]].map(([x, y], i) => (
      <g key={i} transform={`rotate(${(i % 3) * 8 - 8} ${x} ${y})`}>
        <path d={`M${x! - 6} ${y} l4 -3 l-1 4 z`} fill={DAN_R} opacity="0.9" />
        <text x={x! + 1} y={y! + 1.6} fontSize="4.6" fontFamily="serif" fill="#8a4a5a">:</text>
        <path d={`M${x! + 4} ${y} l4 3 l-1 -4 z`} fill={DAN_B} opacity="0.85" />
      </g>
    ))}
    <path d="M30 64 q18 5 36 0" stroke={DAN_Y} strokeWidth="1.2" fill="none" strokeDasharray="2 1.6" opacity="0.9" />
  </g>
))

/* ───────────────────────── R2 도적 소굴 ───────────────────────── */

/** 바위의 윷 기록 — 네 판의 끗 글자 */
const YutRecord = (_: P) => S('0 0 104 76', (
  <g>
    <Defs />
    <path d="M8 16 q14 -10 44 -9 q34 1 44 12 q4 24 -6 44 q-26 8 -52 6 q-22 -2 -32 -10 q-6 -22 2 -43 z"
      fill="url(#hgoStone)" stroke="#3a3d34" strokeWidth="1.6" />
    {['걸', '모', '개', '윷'].map((ch, i) => (
      <g key={i}>
        <text x={22 + i * 20} y="44" textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight="700"
          fill="#2e3128" stroke="#9a9d90" strokeWidth="0.4">{ch}</text>
        <text x={22 + i * 20} y="56" textAnchor="middle" fontSize="5" fontFamily="serif" fill="#3e4138">{['첫', '둘', '셋', '넷'][i]}</text>
      </g>
    ))}
    {/* 출발 칸의 말 */}
    <circle cx="88" cy="58" r="4.6" fill="url(#hgoBrass)" stroke="#5c441c" strokeWidth="1" />
    <path d="M84 64 l-4 4" stroke="#3e4138" strokeWidth="1" />
  </g>
))

/** 바위에 새긴 윷판 — 길과 칸 숫자 */
const YutBoard = (_: P) => S('0 0 96 96', (
  <g>
    <Defs />
    <circle cx="48" cy="48" r="42" fill="url(#hgoStone)" stroke="#3a3d34" strokeWidth="1.6" />
    {/* 바깥 고리 20칸 + 십자 지름길 */}
    {Array.from({ length: 20 }).map((_, i) => {
      const a = (i * 18 - 90) * (Math.PI / 180)
      return <circle key={i} cx={48 + 33 * Math.cos(a)} cy={48 + 33 * Math.sin(a)} r="2.4" fill="#2e3128" opacity="0.9" />
    })}
    {[[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy], i) => (
      <g key={i}>
        <circle cx={48 + dx! * 16} cy={48 + dy! * 16} r="2" fill="#2e3128" opacity="0.8" />
      </g>
    ))}
    <circle cx="48" cy="48" r="3" fill="#2e3128" />
    {/* 출발 칸 표시 + 말 */}
    <path d="M48 88 v-5 l-3 3 m3 -3 l3 3" stroke={DAN_Y} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <circle cx="48" cy="81" r="3.6" fill="url(#hgoBrass)" stroke="#5c441c" strokeWidth="0.9" />
    {/* 칸 숫자 몇 점만(패임) */}
    {[['6', 72, 70], ['3', 81, 48], ['8', 72, 26], ['1', 48, 15]].map(([n, x, y], i) => (
      <text key={i} x={x} y={Number(y) + 2} textAnchor="middle" fontSize="6" fontFamily="serif" fill="#23261e" opacity="0.9">{n}</text>
    ))}
  </g>
))

/** 귀퉁이의 걸음수 새김 — 도1 개2 걸3 윷4 모5 */
const Georeumsu = (_: P) => S('0 0 100 56', (
  <g transform="rotate(-2 50 28)">
    <Defs />
    <rect x="6" y="8" width="88" height="40" rx="3" fill="url(#hgoStone)" stroke="#3a3d34" strokeWidth="1.4" />
    {['도', '개', '걸', '윷', '모'].map((ch, i) => (
      <g key={ch}>
        <text x={17 + i * 17} y="29" textAnchor="middle" fontSize="9" fontFamily="serif" fill="#2e3128">{ch}</text>
        <text x={17 + i * 17} y="41" textAnchor="middle" fontSize="6.4" fontFamily="serif" fill="#23261e">{i + 1}</text>
      </g>
    ))}
  </g>
))

/** 노름판의 산가지 — 묶음 4 + 엽전 차례 패 */
const Sangaji = (_: P) => S('0 0 116 72', (
  <g>
    <Defs />
    <path d="M6 20 l52 -10 l52 10 l-8 44 l-88 0 z" fill="#4a3a26" stroke="#2c2014" strokeWidth="1.4" />
    <path d="M10 22 l48 -8 l48 8" stroke="#5e4a30" strokeWidth="1" fill="none" opacity="0.7" />
    {/* 묶음: || · ≡| · ≡||| · |||| (엽전 2·3·1·4닢) */}
    {[
      { x: 18, n: 2, coins: 2 }, { x: 42, n: 6, coins: 3 },
      { x: 66, n: 8, coins: 1 }, { x: 92, n: 4, coins: 4 },
    ].map(({ x, n, coins }, i) => (
      <g key={i}>
        <Rods x={x} y={30} n={n} color={HANJI} />
        {Array.from({ length: coins }).map((_, c) => (
          <g key={c}>
            <circle cx={x + 3 + c * 6.4} cy={54} r="2.8" fill="url(#hgoBrass)" stroke="#5c441c" strokeWidth="0.8" />
            <rect x={x + 1.9 + c * 6.4} y={52.9} width="2.2" height="2.2" fill="#4a3a26" />
          </g>
        ))}
      </g>
    ))}
  </g>
))

/** 벽의 산가지 숫자표 — 1~9 세로식 */
const Sanpyo = (_: P) => S('0 0 110 80', (
  <g transform="rotate(1.5 55 40)">
    <Defs />
    <path d="M7 7 h96 v66 h-96 z" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="6" y="6" width="96" height="66" rx="2" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.2" />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 12 + (i % 5) * 19, y = i < 5 ? 14 : 46
      return (
        <g key={i}>
          <Rods x={x + 2} y={y} n={i + 1} h={11} />
          <text x={x + 8} y={y + 21} textAnchor="middle" fontSize="5.8" fontFamily="serif" fill={DAN_R}>{i + 1}</text>
        </g>
      )
    })}
  </g>
))

/* ───────────────────────── R3 해인사 ───────────────────────── */

/** 시주 명부 — 시각과 냥 네 줄 */
const Ledger = (_: P) => S('0 0 100 80', (
  <g transform="rotate(-2 50 40)">
    <Defs />
    <path d="M11 9 h80 v62 h-80 z" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="10" y="8" width="80" height="62" rx="2" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.2" />
    <rect x="10" y="8" width="6" height="62" fill={DAN_B} opacity="0.65" />
    {[['인시', '닷 냥'], ['사시', '두 냥'], ['신시', '아홉 냥'], ['해시', '석 냥']].map(([t, a], r) => (
      <g key={r}>
        <text x="24" y={22 + r * 13} fontSize="6.6" fontFamily="serif" fill={INK}>{t}</text>
        <line x1="42" y1={20 + r * 13} x2="58" y2={20 + r * 13} stroke="#b4a47e" strokeWidth="1" opacity="0.8" />
        <text x="62" y={22 + r * 13} fontSize="6.6" fontFamily="serif" fill={INK}>{a}</text>
      </g>
    ))}
  </g>
))

/** 신상과 해 그림자 — 기단 부조 신상 + 그림자 부채꼴 */
const Sinsang = (_: P) => S('0 0 104 84', (
  <g>
    <Defs />
    {/* 해 */}
    <circle cx="88" cy="14" r="7" fill={DAN_Y} opacity="0.9" />
    <circle cx="88" cy="14" r="11" fill="url(#hgoGlow)" />
    {/* 기단과 신상 넷(시각 글자 명문) */}
    <rect x="6" y="58" width="92" height="10" rx="1.6" fill="url(#hgoStone)" stroke="#3a3d34" strokeWidth="1.2" />
    {['신', '사', '인', '해'].map((ch, i) => (
      <g key={ch}>
        <rect x={12 + i * 22} y="34" width="14" height="24" rx="2" fill="url(#hgoStone)" stroke="#3a3d34" strokeWidth="1" />
        <circle cx={19 + i * 22} cy="40" r="3.4" fill="#5e6156" />
        <text x={19 + i * 22} y="54" textAnchor="middle" fontSize="6" fontFamily="serif" fill="#23261e">{ch}</text>
      </g>
    ))}
    {/* 해 그림자 — 첫째 신상을 짚는 중 */}
    <path d="M19 58 l-8 16 h16 z" fill={NIGHT} opacity="0.45" />
    <path d="M30 74 q26 4 56 0" stroke={NIGHT} strokeWidth="1.2" fill="none" opacity="0.25" strokeDasharray="3 2" />
    <path d="M84 72 l6 2 l-5 3" fill="none" stroke={NIGHT} strokeWidth="1.2" opacity="0.35" />
  </g>
))

/** 단청 연꽃 토큰 — 오방색 다섯 닢 */
const Lotus = (_: P) => S('0 0 120 56', (
  <g>
    <Defs />
    <ellipse cx="60" cy="46" rx="54" ry="6" fill="#1a130a" opacity="0.3" />
    {[
      { c: DAN_Y, ch: '대' }, { c: NIGHT, ch: '경' }, { c: DAN_B, ch: '팔' },
      { c: HANJI, ch: '장' }, { c: DAN_R, ch: '만' },
    ].map(({ c, ch }, i) => {
      const x = 14 + i * 23, dark = c === HANJI || c === DAN_Y
      return (
        <g key={i} transform={`rotate(${[-6, 4, -3, 5, -4][i]} ${x + 9} 32)`}>
          <path d={`M${x} 38 q-3 -10 4 -16 q4 -4 5 -9 q1 5 5 9 q7 6 4 16 q-9 5 -18 0 z`}
            fill={c} stroke={dark ? '#7a5e20' : '#0e1422'} strokeWidth="1.2" />
          <text x={x + 9} y="34.6" textAnchor="middle" fontSize="7.4" fontFamily="serif" fontWeight="700"
            fill={dark ? INK : HANJI}>{ch}</text>
        </g>
      )
    })}
  </g>
))

/** 오방신장 행렬 탱화 — 동→북 1열 행진, 발치 번호 */
const Taenghwa = (_: P) => S('0 0 116 84', (
  <g>
    <Defs />
    <rect x="5" y="5" width="106" height="74" rx="2" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.6" />
    <rect x="10" y="10" width="96" height="64" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1" />
    {[
      { c: DAN_B }, { c: DAN_R }, { c: DAN_Y }, { c: HANJI_D }, { c: NIGHT },
    ].map(({ c }, i) => {
      const x = 20 + i * 18.6
      return (
        <g key={i}>
          {/* 행진하는 신장 — 같은 방향으로 걷는 단순 인물형 */}
          <circle cx={x} cy="26" r="4.6" fill="#caa57c" stroke="#6a4a2c" strokeWidth="0.8" />
          <path d={`M${x - 6} 32 q6 -4 12 0 l-1.4 18 q-4.6 3 -9.2 0 z`} fill={c} stroke="#3a3026" strokeWidth="0.9" />
          <path d={`M${x - 4} 52 l-2.4 8 M${x + 4} 52 l4 7`} stroke="#3a3026" strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M${x + 5} 36 l7 -4`} stroke="#3a3026" strokeWidth="1.4" strokeLinecap="round" />
          <text x={x} y="70" textAnchor="middle" fontSize="6" fontFamily="serif" fill={DAN_R}>{i + 1}</text>
        </g>
      )
    })}
  </g>
))

/** 대웅전 머리초 띠 — 5색 반복 패턴 */
const Meoricho = (_: P) => S('0 0 130 40', (
  <g>
    <Defs />
    <rect x="4" y="8" width="122" height="24" rx="2" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.4" />
    {Array.from({ length: 10 }).map((_, i) => (
      <rect key={i} x={9 + i * 11.2} y="12" width="9.6" height="16" rx="1.2"
        fill={[DAN_B, DAN_R, DAN_Y, HANJI, NIGHT][i % 5]} stroke="#2a2014" strokeWidth="0.7" />
    ))}
    <path d="M9 20 h112" stroke="#2a2014" strokeWidth="0.5" opacity="0.4" />
  </g>
))

/* ───────────────────────── R4 감영 ───────────────────────── */

/** 사대문의 괘 깃발 — 깃대 4, SVG 괘 */
const Flags = (_: P) => S('0 0 124 88', (
  <g>
    <Defs />
    {[
      { lines: [true, false, true] as [boolean, boolean, boolean], tag: '동' },
      { lines: [false, true, false] as [boolean, boolean, boolean], tag: '남' },
      { lines: [true, true, true] as [boolean, boolean, boolean], tag: '서' },
      { lines: [false, false, false] as [boolean, boolean, boolean], tag: '북' },
    ].map(({ lines, tag }, i) => {
      const x = 10 + i * 29
      return (
        <g key={i}>
          <line x1={x} y1="8" x2={x} y2="84" stroke={WOOD_D} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx={x} cy="7" r="1.8" fill={BRASS} />
          <path d={`M${x + 1} 12 h24 q-3 7 0 14 h-24 z`} fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1" />
          <Tri x={x + 6} y={15} w={13} lines={lines} sw={2} />
          <text x={x + 12} y="40" textAnchor="middle" fontSize="6" fontFamily="serif" fill={HANJI_D}>{tag}</text>
        </g>
      )
    })}
  </g>
))

/** 관상감 팔괘도 병풍 — 4폭, 괘+이름+순번 */
const Palgwae = (_: P) => S('0 0 132 80', (
  <g>
    <Defs />
    {[0, 1, 2, 3].map((p) => (
      <g key={p} transform={`translate(${6 + p * 30} ${p % 2 ? 4 : 6}) rotate(${p % 2 ? 1 : -1})`}>
        <rect x="0" y="0" width="29" height="68" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1" />
        <rect x="3" y="3" width="23" height="62" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="0.8" />
        {[0, 1].map((r) => {
          const k = p * 2 + r
          const L: [boolean, boolean, boolean][] = [
            [true, true, true], [false, true, true], [true, false, true], [false, false, true],
            [true, true, false], [false, true, false], [true, false, false], [false, false, false],
          ]
          const name = ['건', '태', '리', '진', '손', '감', '간', '곤'][k]
          return (
            <g key={r}>
              <Tri x={7.5} y={9 + r * 30} w={14} lines={L[k]} sw={2.2} />
              <text x={11} y={28 + r * 30} fontSize="5.6" fontFamily="serif" fill={INK}>{name}</text>
              <text x={20} y={28 + r * 30} fontSize="5.6" fontFamily="serif" fill={DAN_R}>{k + 1}</text>
            </g>
          )
        })}
      </g>
    ))}
  </g>
))

/** 목활자함 — 거울 반전 활자 3쌍, 조판틀 칸 차례 */
const Typecase = (_: P) => S('0 0 112 72', (
  <g>
    <Defs />
    <rect x="5" y="9" width="102" height="56" rx="3" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.6" />
    {[['ㅎ', 'ㅏ', '첫째'], ['ㄹ', 'ㅣ', '둘째'], ['ㄹ', 'ㅏ', '셋째']].map(([c1, c2, tag], i) => {
      const x = 12 + i * 33
      return (
        <g key={i}>
          <rect x={x} y="14" width="28" height="38" rx="2" fill={LACQ} stroke="#15100a" strokeWidth="1" />
          {/* 활자 두 알 — 글자면 좌우반전 */}
          {[c1, c2].map((ch, j) => (
            <g key={j}>
              <rect x={x + 3 + j * 12.4} y="19" width="10.4" height="13" rx="1" fill="#8a6a44" stroke="#3a2c18" strokeWidth="0.8" />
              <text x={x + 8.2 + j * 12.4} y="29.4" textAnchor="middle" fontSize="8" fontFamily="serif" fontWeight="700"
                fill={INK} transform={`scale(-1 1) translate(${-(2 * (x + 8.2 + j * 12.4))} 0)`}>{ch}</text>
            </g>
          ))}
          <text x={x + 14} y="46" textAnchor="middle" fontSize="5.4" fontFamily="serif" fill={HANJI_D}>{tag} 칸</text>
        </g>
      )
    })}
    <Stud x={9} y={13} /><Stud x={103} y={13} /><Stud x={9} y={61} /><Stud x={103} y={61} />
  </g>
))

/** 조합 격자 인쇄 견본 — 초성×중성=글자 */
const Gyeokja = (_: P) => S('0 0 96 76', (
  <g transform="rotate(2 48 38)">
    <Defs />
    <path d="M9 7 h78 v62 h-78 z" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="8" y="6" width="78" height="62" rx="2" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.2" />
    {[['ㄱ', 'ㅏ', '가'], ['ㄴ', 'ㅗ', '노'], ['ㅅ', 'ㅓ', '서']].map(([a, b, r], i) => (
      <g key={i}>
        <text x="20" y={24 + i * 16} textAnchor="middle" fontSize="8" fontFamily="serif" fill={INK}>{a}</text>
        <text x="31" y={23 + i * 16} textAnchor="middle" fontSize="6" fontFamily="serif" fill="#6a5436">+</text>
        <text x="42" y={24 + i * 16} textAnchor="middle" fontSize="8" fontFamily="serif" fill={INK}>{b}</text>
        <text x="54" y={23 + i * 16} textAnchor="middle" fontSize="6" fontFamily="serif" fill="#6a5436">=</text>
        <text x="68" y={24 + i * 16} textAnchor="middle" fontSize="9.4" fontFamily="serif" fontWeight="700" fill={DAN_R}>{r}</text>
      </g>
    ))}
  </g>
))

/* ───────────────────────── R5 대궐 앞뜰 ───────────────────────── */

/** 여덟 길동 — 같은 얼굴, 발목 짚·매듭만 다르다 (호패는 품에 가려 비표시) */
const Jeung = (_: P) => S('0 0 152 76', (
  <g>
    <Defs />
    <ellipse cx="76" cy="68" rx="72" ry="5" fill="#0a0e18" opacity="0.4" />
    {/* fixture JEUNG_MATRIX: straw(발목 짚)=2·5·6·8, knot 어긋남=3·5·7·8 */}
    {[
      { straw: false, knots: 1 }, { straw: true, knots: 1 }, { straw: false, knots: 2 }, { straw: false, knots: 1 },
      { straw: true, knots: 2 }, { straw: true, knots: 1 }, { straw: false, knots: 2 }, { straw: true, knots: 2 },
    ].map(({ straw, knots }, i) => {
      const x = 12 + i * 18.6
      return (
        <g key={i}>
          {/* 갓 */}
          <ellipse cx={x} cy="14.6" rx="6.4" ry="1.6" fill="#10131c" />
          <path d={`M${x - 3.4} 14.6 q0 -5 3.4 -5 q3.4 0 3.4 5 z`} fill="#10131c" />
          <circle cx={x} cy="19" r="3.8" fill="#caa57c" stroke="#6a4a2c" strokeWidth="0.7" />
          {/* 도포 */}
          <path d={`M${x - 6} 25 q6 -3.4 12 0 l-1.6 26 q-4.4 2.6 -8.8 0 z`} fill="#3e4a66" stroke="#1c2230" strokeWidth="0.8" />
          <path d={`M${x} 25 v10`} stroke="#1c2230" strokeWidth="0.7" opacity="0.8" />
          {/* 환약 주머니 끈 매듭(품에서 비져나온) */}
          {Array.from({ length: knots }).map((_, k) => (
            <circle key={k} cx={x + 3.2 - k * 2.4} cy={36 + k * 2.6} r="1.3" fill={DAN_R} />
          ))}
          {/* 다리 */}
          <path d={`M${x - 2.6} 51 v9 M${x + 2.6} 51 v9`} stroke="#d8d2c0" strokeWidth="2.6" strokeLinecap="round" />
          {/* 발목 짚 가닥 */}
          {straw && (
            <path d={`M${x - 4.4} 57 l-3 3 M${x - 2} 58 l-2 4 M${x + 4.4} 57 l3 3`}
              stroke={STRAW} strokeWidth="1.1" strokeLinecap="round" />
          )}
          <ellipse cx={x} cy="62" rx="4.6" ry="1.2" fill="#0a0e18" opacity="0.5" />
        </g>
      )
    })}
  </g>
))

/** 조서·메모 — 한지 쪽지 + 관인 */
const Note = (_: P) => S('0 0 90 70', (
  <g transform="rotate(3 45 35)">
    <Defs />
    <path d="M14 12 h58 l4 8 v34 l-6 4 H18 l-4 -6 z" fill="#1a130a" opacity="0.4" transform="translate(1.4 1.4)" />
    <path d="M14 12 h58 l4 8 v34 l-6 4 H18 l-4 -6 z" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1" />
    {[22, 29, 36, 43].map((y) => <line key={y} x1="20" y1={y} x2={64 - (y % 5) * 2} y2={y} stroke="#8a7c5c" strokeWidth="1.1" opacity="0.75" />)}
    <rect x="56" y="44" width="9" height="9" rx="1" fill="none" stroke={DAN_R} strokeWidth="1.3" opacity="0.85" />
    <path d="M58 47 h5 M58 50 h5" stroke={DAN_R} strokeWidth="0.9" opacity="0.85" />
  </g>
))

/** 돌려받은 복주머니 — 입이 벌어져 책 모서리가 보인다 */
const PouchReturn = (_: P) => S('0 0 90 92', (
  <g>
    <Defs />
    <path d="M45 10 q-8 4 -5 9 M45 10 q8 4 5 9" stroke={DAN_R} strokeWidth="1.6" fill="none" />
    <path d="M26 28 q-9 13 -8 31 q1 21 27 23 q26 -2 27 -23 q1 -18 -8 -31 q-9 -8 -19 -8 q-10 0 -19 8 z"
      fill="#9a3552" stroke="#5e1e32" strokeWidth="1.6" />
    <path d="M31 24 q-3 10 -2 17 M59 24 q3 10 2 17" stroke="#5e1e32" strokeWidth="1" opacity="0.6" fill="none" />
    {/* 벌어진 입 + 책 모서리 */}
    <path d="M33 26 q12 7 24 0 q-3 6 -12 6 q-9 0 -12 -6 z" fill="#3c1220" />
    <g transform="rotate(-8 45 22)">
      <rect x="38" y="14" width="14" height="12" rx="1" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1" />
      <line x1="40.5" y1="16" x2="40.5" y2="24" stroke={DAN_R} strokeWidth="1" opacity="0.8" />
    </g>
    <path d="M45 82 v7 M41 82 l-2 6 M49 82 l2 6" stroke={DAN_Y} strokeWidth="1.2" strokeLinecap="round" />
  </g>
))

/* ───────────────────────── 자물쇠 (solved 2상태) ───────────────────────── */

/** 문갑 자물쇠 — 옻칠 문갑 + 4 다이얼 */
const Mungap = ({ solved }: P) => S('0 0 96 92', (
  <g>
    <Defs />
    <rect x="7" y="17" width="84" height="68" rx="4" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="6" y="16" width="84" height="68" rx="4" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1.6" />
    <rect x="6" y="46" width="84" height="2" fill="#15100a" opacity="0.8" />
    {/* 학 자개 문양 */}
    <path d="M18 30 q6 -7 13 -3 q-4 5 -10 5 z" fill="#cfd8d4" opacity="0.55" />
    <Windows xs={[26, 41, 56, 71]} y={52} w={11} h={17} solved={solved} />
    {!solved && [26, 41, 56, 71].map((x) => (
      <text key={x} x={x + 5.5} y={64.5} textAnchor="middle" fontSize="9" fontFamily="serif" fill={BRASS}>－</text>
    ))}
    {/* 앞바탕 + 들쇠 */}
    <rect x="40" y="22" width="16" height="18" rx="2.4" fill="url(#hgoBrass)" stroke="#5c441c" strokeWidth="1" />
    {solved
      ? <path d="M48 28 q7 4 7 10" fill="none" stroke="#5c441c" strokeWidth="2.2" strokeLinecap="round" />
      : <circle cx="48" cy="31" r="3.2" fill="none" stroke="#5c441c" strokeWidth="2" />}
    {solved && <Check x={48} y={36} />}
    <Stud x={11} y={21} /><Stud x={85} y={21} /><Stud x={11} y={79} /><Stud x={85} y={79} />
  </g>
))

/** 복주머니 함 — 자개 함 + 4 다이얼 */
const PouchBox = ({ solved }: P) => S('0 0 96 88', (
  <g>
    <Defs />
    <rect x="9" y="25" width="80" height="56" rx="4" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    {/* 뚜껑 — solved 면 살짝 열림 */}
    <g transform={solved ? 'rotate(-7 12 30)' : undefined}>
      <rect x="8" y="16" width="80" height="12" rx="3" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1.4" />
      <path d="M20 22 q5 -4 10 0 M56 22 q5 -4 10 0" stroke="#cfd8d4" strokeWidth="1" opacity="0.5" fill="none" />
    </g>
    <rect x="8" y="28" width="80" height="52" rx="3" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1.4" />
    <Windows xs={[18, 33.5, 49, 64.5]} y={38} w={12} h={18} solved={solved} />
    {!solved && [18, 33.5, 49, 64.5].map((x) => (
      <text key={x} x={x + 6} y={51.5} textAnchor="middle" fontSize="9.4" fontFamily="serif" fill={BRASS}>－</text>
    ))}
    <rect x="42" y="62" width="12" height="12" rx="2" fill="url(#hgoBrass)" stroke="#5c441c" strokeWidth="1" />
    {solved ? <Check x={48} y={67} s={0.8} /> : <rect x="46.8" y="66" width="2.4" height="5.4" rx="1" fill="#5c441c" />}
    <Stud x={13} y={33} /><Stud x={83} y={33} /><Stud x={13} y={75} /><Stud x={83} y={75} />
  </g>
))

/** 돌문 윷판 — 바위 원반 다이얼 */
const StoneDial = ({ solved }: P) => S('0 0 96 96', (
  <g>
    <Defs />
    <circle cx="48" cy="50" r="44" fill="#1a130a" opacity="0.4" />
    <circle cx="48" cy="48" r="44" fill="url(#hgoStone)" stroke="#2e3128" strokeWidth="2" />
    <circle cx="48" cy="48" r="30" fill={STONE_D} stroke="#2e3128" strokeWidth="1.4" />
    {/* 윷판 점 */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * 30 - 90) * (Math.PI / 180)
      return <circle key={i} cx={48 + 37 * Math.cos(a)} cy={48 + 37 * Math.sin(a)} r="1.8" fill="#2e3128" opacity="0.85" />
    })}
    <Windows xs={[27, 38, 49, 60]} y={40} w={9} h={15} solved={solved} />
    {!solved && [27, 38, 49, 60].map((x) => (
      <text key={x} x={x + 4.5} y={51.6} textAnchor="middle" fontSize="8" fontFamily="serif" fill={HANJI_D}>－</text>
    ))}
    {solved
      ? <g><circle cx="48" cy="68" r="6" fill="none" stroke={DAN_G} strokeWidth="2" opacity="0.9" /><Check x={48} y={66} s={0.7} /></g>
      : <g><circle cx="48" cy="68" r="6" fill="none" stroke={BRASS} strokeWidth="2" /><rect x="46.8" y="68" width="2.4" height="6" rx="1" fill={BRASS} /></g>}
  </g>
))

/** 군량 궤 — 쇠 띠 두른 나무 궤 + 4 다이얼 */
const GrainChest = ({ solved }: P) => S('0 0 104 84', (
  <g>
    <Defs />
    <rect x="9" y="23" width="88" height="56" rx="4" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <path d="M8 32 q44 -18 88 0 v44 H8 z" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.6" />
    <path d="M8 32 q44 -18 88 0" fill="none" stroke="#2c2014" strokeWidth="2.2" />
    {[20, 52, 84].map((x) => <rect key={x} x={x} y="20" width="5" height="56" rx="2" fill="#3a3a36" />)}
    {/* 볏섬 둘 */}
    <path d="M16 70 q3 -8 9 -8 q6 0 9 8 z" fill={STRAW} opacity="0.8" />
    <Windows xs={[32, 44, 56, 68]} y={42} w={10} h={16} solved={solved} />
    {!solved && [32, 44, 56, 68].map((x) => (
      <text key={x} x={x + 5} y={54.4} textAnchor="middle" fontSize="8.4" fontFamily="serif" fill={BRASS}>－</text>
    ))}
    {solved ? <Check x={52} y={66} s={0.9} /> : <circle cx="52" cy="68" r="3.6" fill="none" stroke={BRASS_D} strokeWidth="1.6" />}
  </g>
))

/** 시주함 — 투입구 함 + 4 다이얼 */
const AlmsBox = ({ solved }: P) => S('0 0 92 92', (
  <g>
    <Defs />
    <rect x="11" y="15" width="72" height="70" rx="4" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="10" y="14" width="72" height="70" rx="4" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.6" />
    {/* 투입구 + 시주 묵서 */}
    <rect x="28" y="20" width="36" height="5" rx="2.4" fill="#1c140c" />
    <text x="46" y="40" textAnchor="middle" fontSize="9" fontFamily="serif" fill={HANJI} opacity="0.9">시주</text>
    <Windows xs={[18, 32, 46, 60]} y={46} w={11} h={17} solved={solved} />
    {!solved && [18, 32, 46, 60].map((x) => (
      <text key={x} x={x + 5.5} y={58.8} textAnchor="middle" fontSize="9" fontFamily="serif" fill={BRASS}>－</text>
    ))}
    {solved
      ? <g><rect x="20" y="72" width="52" height="4" rx="2" fill={AMBER} opacity="0.5" /><Check x={46} y={71} s={0.8} /></g>
      : <circle cx="46" cy="73" r="3.6" fill="none" stroke={BRASS_D} strokeWidth="1.6" />}
    <Stud x={15} y={19} /><Stud x={77} y={19} /><Stud x={15} y={79} /><Stud x={77} y={79} />
  </g>
))

/** 성물장 자물쇠 — 단청 장 + 글자 자물쇠(한글 입력) */
const SacredCab = ({ solved }: P) => S('0 0 96 100', (
  <g>
    <Defs />
    <rect x="9" y="9" width="80" height="84" rx="3" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="8" y="8" width="80" height="84" rx="3" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1.6" />
    {/* 단청 머리초 테 */}
    <rect x="12" y="12" width="72" height="6" fill={DAN_G} />
    <rect x="12" y="12" width="72" height="2" fill={DAN_R} />
    {/* 문짝 두 짝 */}
    <rect x="14" y="22" width="33" height="62" rx="1.6" fill="url(#hgoWood)" stroke="#2c2014" strokeWidth="1" />
    <rect x="49" y="22" width="33" height="62" rx="1.6" fill="url(#hgoWood)" stroke="#2c2014" strokeWidth="1" />
    <path d="M20 30 q6 -5 12 0 q-6 5 -12 0 z" fill={DAN_G} opacity="0.8" />
    <path d="M64 30 q6 -5 12 0 q-6 5 -12 0 z" fill={DAN_R} opacity="0.8" />
    {/* 글자창 다섯 */}
    <Windows xs={[17, 30, 43, 56, 69]} y={48} w={10} h={14} solved={solved} />
    {!solved && [17, 30, 43, 56, 69].map((x) => (
      <text key={x} x={x + 5} y={58.6} textAnchor="middle" fontSize="7.4" fontFamily="serif" fill={BRASS}>？</text>
    ))}
    {/* 빗장 자물쇠 */}
    <rect x="38" y="68" width="20" height="12" rx="2.4" fill="url(#hgoBrass)" stroke="#5c441c" strokeWidth="1" />
    {solved ? <Check x={48} y={72} s={0.8} /> : <rect x="46.8" y="72" width="2.4" height="5" rx="1" fill="#5c441c" />}
    {solved && <rect x="46" y="22" width="4" height="62" fill={AMBER} opacity="0.35" />}
  </g>
))

/** 문루 자물쇠 — 맹꽁이 자물쇠 + 4 다이얼 */
const GateLock = ({ solved }: P) => S('0 0 90 100', (
  <g>
    <Defs />
    <Shackle cx={45} top={13} solved={solved} />
    <rect x="15" y="25" width="62" height="64" rx="7" fill="#1a130a" opacity="0.4" transform="translate(1.4 1.4)" />
    <rect x="14" y="24" width="62" height="64" rx="7" fill="url(#hgoBrass)" stroke="#5c441c" strokeWidth="2" />
    <rect x="19" y="29" width="52" height="54" rx="5" fill="none" stroke="#5c441c" strokeWidth="0.9" opacity="0.6" />
    <Windows xs={[20, 33, 46, 59]} y={42} w={11} h={17} solved={solved} />
    {!solved && [20, 33, 46, 59].map((x) => (
      <text key={x} x={x + 5.5} y={54.8} textAnchor="middle" fontSize="9" fontFamily="serif" fill="#efd9a0">－</text>
    ))}
    <circle cx="45" cy="74" r="4.4" fill={NIGHT} stroke="#5c441c" strokeWidth="1" />
    {solved && <Check x={45} y={71} s={0.9} />}
  </g>
))

/** 활자함 자물쇠 — 조판틀 + 글자 자물쇠(한글 입력) */
const TypeLock = ({ solved }: P) => S('0 0 96 92', (
  <g>
    <Defs />
    <rect x="9" y="13" width="80" height="72" rx="3" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <rect x="8" y="12" width="80" height="72" rx="3" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.6" />
    {/* 조판틀 격자 */}
    {[0, 1, 2, 3].map((i) => <line key={i} x1={16 + i * 21} y1="18" x2={16 + i * 21} y2="44" stroke="#2c2014" strokeWidth="0.8" opacity="0.7" />)}
    <rect x="14" y="18" width="68" height="26" rx="1.6" fill="none" stroke="#2c2014" strokeWidth="1.2" />
    {/* 먹솔 */}
    <rect x="70" y="48" width="13" height="4" rx="2" fill={LACQ} transform="rotate(-18 76 50)" />
    <Windows xs={[20, 39, 58]} y={52} w={14} h={18} solved={solved} />
    {!solved && [20, 39, 58].map((x) => (
      <text key={x} x={x + 7} y={65.6} textAnchor="middle" fontSize="8.4" fontFamily="serif" fill={BRASS}>？</text>
    ))}
    {solved ? <Check x={48} y={76} s={0.8} /> : <circle cx="48" cy="77" r="3.4" fill="none" stroke={BRASS_D} strokeWidth="1.6" />}
  </g>
))

/** 호패 다이얼 — 호패 모양 패, solved: 한자 숫자 三七一九 */
const HopaeDial = ({ solved }: P) => S('0 0 80 108', (
  <g>
    <Defs />
    <path d="M25 9 q15 -8 30 0 v88 q-15 8 -30 0 z" fill="#1a130a" opacity="0.4" transform="translate(1.6 1.6)" />
    <path d="M24 8 q16 -8 32 0 v88 q-16 8 -32 0 z" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.8" />
    <circle cx="40" cy="15" r="2.6" fill="none" stroke={BRASS_D} strokeWidth="1.4" />
    {/* 세로 4창 — solved 에만 호패 숫자(한자) 렌더 */}
    <Windows xs={[33]} y={24} w={14} h={16} solved={solved} glyphs={['三']} />
    <Windows xs={[33]} y={42} w={14} h={16} solved={solved} glyphs={['七']} />
    <Windows xs={[33]} y={60} w={14} h={16} solved={solved} glyphs={['一']} />
    <Windows xs={[33]} y={78} w={14} h={16} solved={solved} glyphs={['九']} />
    {!solved && [24, 42, 60, 78].map((y) => (
      <text key={y} x="40" y={y + 12} textAnchor="middle" fontSize="9" fontFamily="serif" fill={BRASS}>－</text>
    ))}
    {solved && <Check x={40} y={98} s={0.7} />}
  </g>
))

/** 어머니의 책(사이퍼) — 끈으로 봉한 수기, solved: 펼쳐져 등롱빛 */
const CipherBook = ({ solved }: P) => S('0 0 100 84', (
  <g>
    <Defs />
    <rect x="13" y="59" width="74" height="14" rx="2" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1.2" />
    {solved ? (
      <g>
        {/* 펼친 책 */}
        <path d="M50 28 q-18 -7 -32 0 l3 30 q14 -6 29 0 q15 -6 29 0 l3 -30 q-14 -7 -32 0 z"
          fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.4" />
        <line x1="50" y1="28" x2="50" y2="58" stroke="#a8946a" strokeWidth="1.2" />
        {[34, 40, 46].map((y) => (
          <g key={y}>
            <line x1="25" y1={y} x2="44" y2={y} stroke="#8a7c5c" strokeWidth="1" opacity="0.8" />
            <line x1="56" y1={y} x2="75" y2={y} stroke="#8a7c5c" strokeWidth="1" opacity="0.8" />
          </g>
        ))}
        <ellipse cx="50" cy="42" rx="34" ry="18" fill="url(#hgoGlow)" />
        <Check x={50} y={68} s={0.8} />
      </g>
    ) : (
      <g>
        {/* 접혀 봉해진 수기 — 매듭 끈 */}
        <rect x="26" y="26" width="48" height="34" rx="2.4" fill="url(#hgoHanji)" stroke="#a8946a" strokeWidth="1.4" />
        <rect x="26" y="26" width="6" height="34" fill={DAN_R} opacity="0.7" />
        {[33, 40, 47].map((y) => <line key={y} x1="38" y1={y} x2="68" y2={y} stroke="#8a7c5c" strokeWidth="1" opacity="0.6" />)}
        <path d="M50 22 v42 M30 43 h40" stroke={DAN_R} strokeWidth="2" opacity="0.9" />
        <circle cx="50" cy="43" r="3.4" fill={DAN_R} />
        <path d="M47 46 l-4 5 M53 46 l4 5" stroke={DAN_R} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    )}
  </g>
))

/* ───────────────────────── 문 (open 2상태) ───────────────────────── */

/** 담장 뒷문 — 토담 사이 판문. 열림: 쪽빛 밤 + 등롱빛 */
const WallDoor = ({ open }: P) => S('0 0 76 110', (
  <g>
    <Defs />
    <rect x="7" y="5" width="64" height="102" rx="4" fill="#1a130a" opacity="0.4" />
    {/* 토담 + 기와 */}
    <rect x="6" y="14" width="64" height="92" fill="#9a8a6c" stroke="#5e5238" strokeWidth="1.6" />
    <path d="M2 14 q18 -7 36 0 q18 -7 36 0 v-4 q-18 -7 -36 0 q-18 -7 -36 0 z" fill="#3a4148" stroke="#23282e" strokeWidth="1" />
    {open ? (
      <g>
        <path d="M16 30 h44 v72 h-44 z" fill="#0c1322" />
        <path d="M16 30 h44 v72 h-44 z" fill={NIGHT} opacity="0.5" />
        {/* 문짝이 안으로 젖혀짐 */}
        <path d="M16 30 l12 6 v66 l-12 0 z" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1" />
        <ellipse cx="42" cy="64" rx="10" ry="16" fill="#ffd9a0" opacity="0.14" />
        <circle cx="46" cy="42" r="2" fill="#dfe8f2" opacity="0.8" />
      </g>
    ) : (
      <g>
        <rect x="16" y="30" width="44" height="72" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.4" />
        {[28, 38, 48].map((x) => <line key={x} x1={x} y1="32" x2={x} y2="100" stroke={WOOD_D} strokeWidth="1" opacity="0.7" />)}
        <rect x="14" y="58" width="48" height="7" rx="2" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1" />
        <Stud x={20} y={61.5} /><Stud x={56} y={61.5} />
        <circle cx="38" cy="78" r="5.4" fill="none" stroke={BRASS} strokeWidth="1.6" opacity="0.9" />
        <rect x="36.8" y="78" width="2.4" height="7" rx="1" fill={BRASS} opacity="0.9" />
      </g>
    )}
  </g>
))

/** 폭포 뒤 통로 — 닫힘: 물커튼 / 열림: 갈라진 물줄기와 횃불빛 */
const FallDoor = ({ open }: P) => S('0 0 76 110', (
  <g>
    <Defs />
    <rect x="7" y="5" width="64" height="102" rx="6" fill="#0c1018" opacity="0.5" />
    <path d="M6 16 q32 -16 64 0 V106 H6 z" fill="#1c2634" stroke="#11161e" strokeWidth="1.6" />
    {open ? (
      <g>
        {/* 갈라진 폭포 — 가운데 어두운 통로 */}
        <path d="M24 14 q-7 46 -10 90 L6 104 V16 q9 -4 18 -2 z" fill="#8fb6cc" opacity="0.75" />
        <path d="M52 14 q7 46 10 90 l8 0 V16 q-9 -4 -18 -2 z" fill="#8fb6cc" opacity="0.75" />
        <path d="M26 20 q-5 40 -8 82 M50 20 q5 40 8 82" stroke="#e8f4fa" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M26 16 h24 v88 h-24 z" fill="#0a0e16" />
        <ellipse cx="38" cy="62" rx="8" ry="14" fill="#ffb45e" opacity="0.2" />
        <ellipse cx="38" cy="100" rx="22" ry="4" fill="#cfe6f2" opacity="0.4" />
      </g>
    ) : (
      <g>
        {/* 물커튼 */}
        {[14, 24, 34, 44, 54].map((x, i) => (
          <path key={x} d={`M${x} 14 q${i % 2 ? 3 : -3} 46 ${i % 2 ? 1 : -1} 90`}
            stroke="#9ec4d8" strokeWidth="7" fill="none" opacity="0.8" />
        ))}
        {[19, 29, 39, 49].map((x) => (
          <path key={x} d={`M${x} 18 q2 44 1 84`} stroke="#e8f4fa" strokeWidth="1.4" fill="none" opacity="0.6" />
        ))}
        <ellipse cx="38" cy="102" rx="26" ry="5" fill="#cfe6f2" opacity="0.5" />
        <circle cx="38" cy="74" r="5.4" fill="none" stroke={BRASS} strokeWidth="1.6" opacity="0.85" />
        <rect x="36.8" y="74" width="2.4" height="7" rx="1" fill={BRASS} opacity="0.85" />
      </g>
    )}
  </g>
))

/** 일주문 뒷길 — 단청 보 아래 사잇길. 열림: 오후빛 길 */
const TempleDoor = ({ open }: P) => S('0 0 76 110', (
  <g>
    <Defs />
    {/* 기둥 둘 + 단청 보 */}
    <rect x="8" y="22" width="9" height="84" fill="#8a3b2c" stroke="#4a1f16" strokeWidth="1.2" />
    <rect x="59" y="22" width="9" height="84" fill="#8a3b2c" stroke="#4a1f16" strokeWidth="1.2" />
    <path d="M2 22 q36 -10 72 0 v-6 q-36 -10 -72 0 z" fill="#3a4148" stroke="#23282e" strokeWidth="1" />
    <rect x="8" y="22" width="60" height="7" fill={DAN_G} />
    <rect x="8" y="22" width="60" height="2.4" fill={DAN_R} />
    {open ? (
      <g>
        <path d="M17 29 h42 v77 h-42 z" fill="#d8c9a0" opacity="0.9" />
        <path d="M28 106 q10 -40 10 -70 q0 30 10 70 z" fill="#b89a6a" opacity="0.8" />
        <path d="M22 44 q8 4 14 0 M44 56 q7 4 13 0" stroke="#8a7a56" strokeWidth="1" fill="none" opacity="0.6" />
        <ellipse cx="38" cy="36" rx="14" ry="8" fill="#fff3c4" opacity="0.35" />
      </g>
    ) : (
      <g>
        <rect x="17" y="29" width="42" height="77" fill="url(#hgoWood)" stroke={WOOD_D} strokeWidth="1.4" />
        {[28, 38, 48].map((x) => <line key={x} x1={x} y1="31" x2={x} y2="104" stroke={WOOD_D} strokeWidth="1" opacity="0.7" />)}
        <rect x="15" y="60" width="46" height="7" rx="2" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1" />
        <circle cx="38" cy="80" r="5.4" fill="none" stroke={BRASS} strokeWidth="1.6" opacity="0.9" />
        <rect x="36.8" y="80" width="2.4" height="7" rx="1" fill={BRASS} opacity="0.9" />
      </g>
    )}
  </g>
))

/** 북문 — 성문 홍예. 열림: 두 짝이 벌어져 저녁빛 */
const NorthGate = ({ open }: P) => S('0 0 80 110', (
  <g>
    <Defs />
    {/* 성벽 석축 + 홍예 */}
    <rect x="4" y="10" width="72" height="96" fill="url(#hgoStone)" stroke="#3a3d34" strokeWidth="1.6" />
    {[26, 44, 62, 80].map((y, r) => (
      <g key={y}>
        <line x1="4" y1={y} x2="76" y2={y} stroke="#3a3d34" strokeWidth="0.8" opacity="0.8" />
        {[0, 1].map((i) => (
          <line key={i} x1={4 + ((i + (r % 2 ? 0.5 : 0)) * 36) % 72 + 18} y1={y} x2={4 + ((i + (r % 2 ? 0.5 : 0)) * 36) % 72 + 18} y2={y + 18} stroke="#3a3d34" strokeWidth="0.7" opacity="0.6" />
        ))}
      </g>
    ))}
    <path d="M14 106 V52 q26 -26 52 0 v54 z" fill="#23261e" stroke="#3a3d34" strokeWidth="1.4" />
    {open ? (
      <g>
        <path d="M18 106 V54 q22 -22 44 0 v52 z" fill="#1c1410" />
        {/* 벌어진 두 짝 */}
        <path d="M18 54 l13 8 v44 h-13 z" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1" />
        <path d="M62 54 l-13 8 v44 h13 z" fill="url(#hgoLacq)" stroke="#15100a" strokeWidth="1" />
        <ellipse cx="40" cy="80" rx="9" ry="18" fill={AMBER} opacity="0.25" />
        <path d="M34 106 q6 -22 6 -34 q0 12 6 34 z" fill={AMBER} opacity="0.18" />
      </g>
    ) : (
      <g>
        <path d="M18 106 V54 q22 -22 44 0 v52 z" fill="url(#hgoLacq)" />
        <line x1="40" y1="36" x2="40" y2="104" stroke="#15100a" strokeWidth="1.6" />
        {[48, 64, 80].map((y) => (
          <g key={y}>
            <Stud x={28} y={y} r={1.8} /><Stud x={52} y={y} r={1.8} />
          </g>
        ))}
        <rect x="22" y="70" width="36" height="6" rx="2" fill="#3a3a36" stroke="#1e1e1c" strokeWidth="0.9" />
        <circle cx="40" cy="88" r="5.4" fill="none" stroke={BRASS} strokeWidth="1.6" opacity="0.9" />
        <rect x="38.8" y="88" width="2.4" height="7" rx="1" fill={BRASS} opacity="0.9" />
      </g>
    )}
  </g>
))

const REGISTRY: Record<Kind, (p: P) => JSX.Element> = {
  bookcase: Bookcase, almanac: Almanac, pouch: Pouch, banjeol: Banjeol, lining: Lining,
  yutrecord: YutRecord, yutboard: YutBoard, georeumsu: Georeumsu, sangaji: Sangaji, sanpyo: Sanpyo,
  ledger: Ledger, sinsang: Sinsang, lotus: Lotus, taenghwa: Taenghwa, meoricho: Meoricho,
  flags: Flags, palgwae: Palgwae, typecase: Typecase, gyeokja: Gyeokja,
  jeung: Jeung, note: Note, pouchreturn: PouchReturn,
  mungap: Mungap, pouchbox: PouchBox, stonedial: StoneDial, grainchest: GrainChest, almsbox: AlmsBox,
  sacredcab: SacredCab, gatelock: GateLock, typelock: TypeLock, hopaedial: HopaeDial, cipherbook: CipherBook,
  walldoor: WallDoor, falldoor: FallDoor, templedoor: TempleDoor, northgate: NorthGate,
}

export function ObjectArt({ label, active, solved }: { label?: string; active?: boolean; solved?: boolean }) {
  if (!label) return null
  const kind = KIND_BY_LABEL[label]
  if (!kind) return null
  const C = REGISTRY[kind]
  return C ? <C open={active} solved={solved} /> : null
}
