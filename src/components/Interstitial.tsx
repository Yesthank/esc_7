import { useState } from 'react'

// 압송 — 함거의 한양 길 → 대궐 앞 시점 전환 — 2비트 전체화면 인터스티셜.
// 아트(/2img)가 없으면 어두운 그라디언트 폴백. 탭(클릭)으로 진행, seenDialogs 로 1회만.

const BEATS = [
  {
    art: 'apsong-1',
    kicker: '압송 — 한양 길',
    text:
      '쇠사슬이 손목을 물고, 함거가 삐걱이며 남으로 구른다.\n' +
      '팔도가 쫓던 도적이 제 발로 잡혔다 — 길가에 구경꾼이 늘어선다.\n' +
      '함거 속 길동은 고개를 숙인 채, 조용히 웃고 있다.',
  },
  {
    art: 'apsong-2',
    kicker: '대궐 앞 — 절하는 백성들',
    text:
      '쇠사슬에 끌려간 것 또한 짚으로 빚은 제웅이었다.\n' +
      '진짜 너는 변장한 채, 절하는 백성들 틈에 섞여 대궐 앞에 선다.\n' +
      '그때 백성 하나가 말없이 손에 쥐여 주고 사라진다 — 별당에서 보았던, 어머니의 복주머니.',
  },
]

function BeatArt({ name }: { name: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <img className="inter__art" src={`${import.meta.env.BASE_URL}art/${name}.png`} alt=""
      draggable={false} onError={() => setOk(false)} />
  )
}

export function Interstitial({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0)
  const beat = BEATS[i]!
  const last = i >= BEATS.length - 1
  const next = () => (last ? onDone() : setI((n) => n + 1))
  return (
    <div className="inter" onClick={next} role="dialog" aria-label="장면 전환">
      <BeatArt key={beat.art} name={beat.art} />
      <div className="inter__scrim" />
      <div className="inter__body">
        <span className="inter__kicker">{beat.kicker}</span>
        {beat.text.split('\n').map((line, k) => (
          <p className="inter__text" key={k}>{line}</p>
        ))}
        <span className="inter__next">{last ? '대궐 앞뜰로 ▸' : '▸'}</span>
      </div>
    </div>
  )
}
