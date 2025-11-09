import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { mockPersonalized, mockMonthly } from '../lib/mock'
import type { PopupItem } from '../lib/types'
import NaverMap from '../components/NaverMap'

export default function PopupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isFav, setIsFav] = useState(false)

  const popup: PopupItem | undefined = useMemo(() => {
    const all: PopupItem[] = [...mockPersonalized, ...mockMonthly]
    return all.find((p) => p.id === id)
  }, [id])

  if (!popup) {
    return (
      <div className="bg-bg min-h-[60vh] flex flex-col items-center justify-center text-sm text-textMuted">
        <p>해당 팝업 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700"
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    )
  }

  const toggleFav = () => setIsFav((v) => !v)

  return (
    <div className="bg-bg min-h-[60vh]">
      {/* 상단 이미지 */}
      <div className="w-full h-64 md:h-80 bg-slate-200 overflow-hidden">
        {popup.thumbnail && (
          <img
            src={popup.thumbnail}
            alt={popup.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              Popup Store
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              {popup.title}
            </h1>
            <p className="text-sm text-textMuted mt-1">
              {popup.brand && `${popup.brand} · `}
              {popup.region ?? popup.address ?? '지역 정보 준비 중'}
            </p>
          </div>
          <button
            onClick={toggleFav}
            className={`mt-1 px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 ${
              isFav
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-slate-700 border-line'
            }`}
          >
            <span>♥</span>
            <span>{isFav ? '즐겨찾기됨' : '즐겨찾기'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-textMuted">
          <span className="px-3 py-1 rounded-full bg-white border border-line">
            {popup.startDate} ~ {popup.endDate}
          </span>
          {popup.category && (
            <span className="px-3 py-1 rounded-full bg-white border border-line">
              #{popup.category}
            </span>
          )}
          {popup.region && (
            <span className="px-3 py-1 rounded-full bg-white border border-line">
              {popup.region}
            </span>
          )}
        </div>

        <section className="mt-2">
          <h2 className="text-sm font-semibold mb-1">팝업 소개</h2>
          <p className="text-sm text-textMuted leading-relaxed">
            {popup.description ||
              '브랜드 컨셉과 한정 컬렉션을 경험할 수 있는 팝업스토어입니다. 현장 이벤트, 굿즈, 포토존 등 자세한 내용은 공식 채널을 통해 확인해 주세요.'}
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-sm font-semibold mb-1">위치 / 지도</h2>
          <p className="text-sm text-textMuted mb-2">
            {popup.address || '상세 주소 정보는 추후 업데이트 예정입니다.'}
          </p>

          {popup.lat && popup.lon ? (
            <div className="w-full h-56 rounded-xl2 overflow-hidden">
              <NaverMap lat={popup.lat} lon={popup.lon} />
            </div>
          ) : (
            <div className="w-full h-56 rounded-xl2 bg-slate-200 flex items-center justify-center text-xs text-textMuted">
              좌표 정보가 없어 지도를 표시할 수 없습니다.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
