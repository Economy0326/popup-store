// src/routes/PopupDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NaverMap from '../components/NaverMap'
import GridSection from '../components/GridSection'
import { getCategoryLabel } from '../lib/categoryMap'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import type { PopupItem } from '../types/popup'
import {
  fetchPopupDetail,
  fetchSimilarPopups,
  fetchNearbyPopups,
} from '../api/popups'

export default function PopupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()

  const [popup, setPopup] = useState<PopupItem | null>(null)
  const [similarByCategory, setSimilarByCategory] = useState<PopupItem[]>([])
  const [nearbyByRegion, setNearbyByRegion] = useState<PopupItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    const numericId = Number(id)

    async function load() {
      try {
        const [detail, similar, nearby] = await Promise.all([
          fetchPopupDetail(numericId),
          fetchSimilarPopups(numericId),
          fetchNearbyPopups(numericId),
        ])

        setPopup(detail)
        setSimilarByCategory(similar.items ?? [])
        setNearbyByRegion(nearby.items ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <div className="bg-bg min-h-[60vh] flex items-center justify-center text-sm text-textMuted">
        로딩 중입니다...
      </div>
    )
  }

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

  const favored = isFavorite(Number(popup.id))
  const categoryLabel = getCategoryLabel(popup.category)

  // hero용 대표 이미지 결정
  const images: string[] = (popup.images ?? []) as string[]
  const heroImage = images[0] ?? popup.thumbnail ?? null
  
  return (
    <div className="bg-bg min-h-[60vh]">
      {/* Hero 영역 */}
      <div className="w-full bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
          <div className="relative w-full aspect-[16/9]">
            {heroImage && (
              <>
                {/* 뒤 카드: cover + blur */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <img
                    src={heroImage}
                    alt={popup.title ?? popup.name ?? '팝업 대표 이미지'}
                    className="w-full h-full object-cover blur-md scale-110"
                  />
                  <div className="absolute inset-0 bg-black/35" />
                </div>
              </>
            )}

            {/* 앞 카드: 실제 이미지는 contain으로 안 잘리게 */}
            <div className="absolute inset-4 md:inset-6 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-slate-950/80 border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={popup.title ?? popup.name ?? '팝업 대표 이미지'}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-textMuted">
                    대표 이미지가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
        {/* 헤더 영역 (타이틀 + 즐겨찾기 버튼) */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              Popup Store
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              {popup.title}
            </h1>
            <p className="text-sm text-textMuted mt-1">
              {popup.regionLabel ?? popup.address ?? '지역 정보 준비 중'}
            </p>
          </div>

          {/* ♥ 즐겨찾기 버튼 + 로그인 때만 뜸 */}
          {user && (
            <button
              onClick={() => toggleFavorite(Number(popup.id))}
              className={`mt-1 px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition
                ${
                  favored
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-slate-700 border-line hover:bg-slate-50'
                }`}
            >
              <span>{favored ? '♥' : '♡'}</span>
              <span>{favored ? '즐겨찾기됨' : '즐겨찾기'}</span>
            </button>
          )}
        </div>

        {/* 태그 / 기간 / 카테고리 / 지역 */}
        <div className="flex flex-wrap gap-3 text-xs text-textMuted">
          {(popup.startDate || popup.endDate) && (
            <span className="px-3 py-1 rounded-full bg-white border border-line">
              {popup.startDate ?? '미정'} ~ {popup.endDate ?? '미정'}
            </span>
          )}

          {categoryLabel && (
            <span className="px-3 py-1 rounded-full bg-white border border-line">
              #{categoryLabel}
            </span>
          )}

          {popup.regionLabel && (
            <span className="px-3 py-1 rounded-full bg-white border border-line">
              {popup.regionLabel}
            </span>
          )}
        </div>

        {/* 공식 사이트 링크 */}
        {popup.webSiteLink && (
          <div className="mt-1">
            <a
              href={popup.webSiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-xs text-blue-700 border border-blue-100 hover:bg-blue-100"
            >
              공식 사이트 바로가기
              <span aria-hidden>↗</span>
            </a>
          </div>
        )}

        {/* 소개 섹션 */}
        <section className="mt-3">
          <h2 className="text-sm font-semibold mb-1">팝업 소개</h2>
          <p className="text-sm text-textMuted leading-relaxed whitespace-pre-line">
            {popup.description ||
              '브랜드 컨셉과 한정 컬렉션을 경험할 수 있는 팝업스토어입니다. 현장 이벤트, 굿즈, 포토존 등 자세한 내용은 공식 채널을 통해 확인해 주세요.'}
          </p>
        </section>

        {/* 지도 섹션 */}
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

      {/* 비슷한 / 가까운 팝업 그리드 섹션들 */}
      <div className="mt-4 space-y-4 pb-10">
        {similarByCategory.length > 0 && (
          <GridSection
            title="카테고리 맞춤 팝업스토어"
            items={similarByCategory}
          />
        )}

        {nearbyByRegion.length > 0 && (
          <GridSection
            title="주변 지역 맞춤 팝업스토어"
            items={nearbyByRegion}
          />
        )}
      </div>
    </div>
  )
}
