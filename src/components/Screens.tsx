import { useState } from 'react'
import type { GameConfig } from '../engine/types'
import { formatTime } from '../engine/asset'
import { loadSave } from '../engine/useGame'
import { RotateHint } from './RotateHint'

/** /2img 생성 아트 배경 — 파일이 없으면 조용히 생략(폴백: 기존 그라디언트). */
function ScreenArt({ name }: { name: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <>
      <img className="screen__art" src={`${import.meta.env.BASE_URL}art/${name}.png`} alt=""
        draggable={false} onError={() => setOk(false)} />
      <div className="screen__scrim" />
    </>
  )
}

function Emblem() {
  return (
    <svg className="emblem" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="#c9762b" strokeWidth="1" opacity="0.6" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#c9762b" strokeWidth="0.5" opacity="0.35" />
      {/* 호패 — 끈 구멍 + 세로 한자, 단청 테두리 */}
      <rect x="44" y="28" width="32" height="74" rx="5" fill="#efe6d0" stroke="#2e6e4e" strokeWidth="2.4" />
      <rect x="48" y="32" width="24" height="66" rx="3" fill="none" stroke="#b03a2e" strokeWidth="1" opacity="0.7" />
      <circle cx="60" cy="38" r="3" fill="#1a2238" stroke="#c9762b" strokeWidth="1" />
      <path d="M60 35 C56 28 50 23 44 20" fill="none" stroke="#c9762b" strokeWidth="1.6" strokeLinecap="round" />
      <text x="60" y="58" textAnchor="middle" fontFamily="Gowun Batang, serif" fontSize="14" fontWeight="700" fill="#1a2238">洪</text>
      <text x="60" y="76" textAnchor="middle" fontFamily="Gowun Batang, serif" fontSize="14" fontWeight="700" fill="#1a2238">吉</text>
      <text x="60" y="94" textAnchor="middle" fontFamily="Gowun Batang, serif" fontSize="14" fontWeight="700" fill="#1a2238">童</text>
      {/* 까마귀 한 마리 — 호패 위에 앉다 (흉조) */}
      <path d="M66 28 q1 -7 8 -8.5 q6.5 -1.2 9.5 2.5 q1 1.6 0.6 3.6 l7 2 l-7.4 1.2 q-1.4 4 -6.6 4.8 q-6.6 1 -11.1 -2.1 z"
        fill="#141a2c" stroke="#c9762b" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M66 28 l-11 -2.4 l12 -2.8 z" fill="#141a2c" stroke="#c9762b" strokeWidth="0.7" strokeLinejoin="round" />
      <circle cx="79.5" cy="22.5" r="1.1" fill="#efe6d0" />
      <circle cx="60" cy="60" r="44" fill="url(#emg)" opacity="0.25" />
      <defs>
        <radialGradient id="emg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#c9762b" stopOpacity="0.4" /><stop offset="100%" stopColor="#c9762b" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function TitleScreen({
  config,
  onStart,
  onResume,
}: {
  config: GameConfig
  onStart: () => void
  onResume: () => void
}) {
  const [hasSave] = useState(() => loadSave() !== null)
  return (
    <div className="screen screen--title">
      <ScreenArt name="intro" />
      <Emblem />
      <h1 className="title">{config.title}</h1>
      <p className="title__sub">— 아버님을 아버님이라 부르지 못하고 —</p>
      {config.description && <p className="title__desc">{config.description}</p>}
      <div className="title__actions">
        <button className="btn btn--primary" onClick={onStart}>담을 넘는다</button>
        {hasSave && (
          <button className="btn btn--resume" onClick={onResume}>이어하기 — 그 밤의 골목으로</button>
        )}
      </div>
      <p className="title__credit">
        허균 「홍길동전」 — 김유정 고쳐씀(1935, 퍼블릭도메인) 오마주<br />
        <span>maker 파이프라인으로 생성·검증 · 자물쇠 {config.puzzles.length}개 · 제한시간 {Math.floor(config.timeLimit / 60)}분 · 단서는 수첩에 기록된다 · 📱 기기를 가로로 눕혀 플레이</span>
      </p>
      {/* 가로 권유는 타이틀에서만 — 게임 중에는 띄우지 않는다(esc_5 환류) */}
      <RotateHint />
    </div>
  )
}

// 활빈당 결의 — 원작 六장 정합(불의의 재물만 빼앗고, 백성의 것은 추호도 범하지 않는다).
const HWALBIN = ['굶주린 백성의 것은 한 톨도 건드리지 않는다', '빼앗는 자의 곳간만 연다', '받은 것을 돌려준다 — 굶는 백성에게']

export function ClearScreen({
  config,
  remaining,
  hintsUsed,
  onRestart,
}: {
  config: GameConfig
  remaining: number
  hintsUsed: number
  onRestart: () => void
}) {
  const used = config.timeLimit - remaining
  return (
    <div className="screen screen--clear">
      <ScreenArt name="ending" />
      <span className="screen__kicker">새벽 — 구름 위</span>
      {/* 풀어낸 세 답이 하나의 허락으로 — 타이틀 드롭 */}
      <div className="assemble" aria-hidden="true">
        <span className="assemble__token assemble__token--1">팔만대장경</span>
        <span className="assemble__token assemble__token--2">하리라</span>
        <span className="assemble__token assemble__token--3">아버지</span>
      </div>
      <h2 className="assemble__drop">호부호형(呼父呼兄)</h2>
      <p className="screen__message">{config.clearMessage}</p>
      <div className="grudge">
        <span className="grudge__head">활빈(活貧) — 무리의 결의 셋</span>
        <div className="grudge__names" style={{ flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          {HWALBIN.map((n, i) => (
            <em key={n} style={{ animationDelay: `${1.2 + i * 0.5}s` }}>{n}</em>
          ))}
        </div>
        <span className="grudge__vow">그래서, 이름이 활빈이다.</span>
      </div>
      <div className="screen__stats">
        <span>여정 시간 <b>{formatTime(used)}</b></span>
        <span>남은 시간 <b>{formatTime(remaining)}</b></span>
        <span>속삭임 <b>{hintsUsed}회</b></span>
      </div>
      <p className="screen__mirror">어떤 이는 이름을 버렸고(esc_4), 어떤 이는 이름을 되찾았다(esc_6) — 당신은 끝내, 부르지 못하던 말을 불렀다.</p>
      <button className="btn btn--primary" onClick={onRestart}>다시 그 밤으로</button>
    </div>
  )
}

export function FailScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="screen screen--fail">
      <ScreenArt name="fail" />
      <span className="screen__kicker">동이 튼다 — 포승줄</span>
      <p className="screen__message">
        관군의 횃불이 사방에서 좁혀 온다 — 너무 늦었다.<br />
        포승줄이 손목을 물고, 함거가 진짜 너를 싣고 구른다.<br />
        끝내, <b>그 말</b>은 입 밖에 나오지 못했다.
      </p>
      <button className="btn btn--primary" onClick={onRestart}>다시 그 밤으로</button>
    </div>
  )
}
