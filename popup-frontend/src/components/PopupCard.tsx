// src/components/PopupCard.tsx
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import type { PopupItem } from '../types/popup'

export default function PopupCard({ item }: { item: PopupItem }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favored = isFavorite(item.id)

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(item.id)
  }

  const thumbnail = item.thumbnail ?? item.images?.[0] ?? null

  return (
    <div className="relative">
      <Link to={`/popup/${item.id}`} className="block">
        <article className="bg-card border border-line rounded-xl2 shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition cursor-pointer relative">
          {/* 이미지 영역 */}
          <div className="w-full aspect-[4/3] relative bg-slate-200 overflow-hidden">
            {thumbnail && (
              <>
                {/* 블러 배경 */}
                <img
                  src={thumbnail}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-60"
                />
                {/* 실제 이미지 */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={thumbnail}
                    alt={item.title ?? item.name ?? '팝업 이미지'}
                    loading="lazy"
                    className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-md"
                  />
                </div>
              </>
            )}
          </div>

          {/* 찜 버튼 */}
          <button
            onClick={handleFav}
            className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-md text-primary shadow-sm hover:bg-white transition
                      focus:outline-none focus-visible:outline-none focus:ring-0"
          >
            {favored ? '♥' : '♡'}
          </button>

          <div className="p-4">
            <h3 className="font-semibold text-slate-900 line-clamp-1 mb-1">
              {item.title ?? item.name ?? '제목 미정'}
            </h3>
            <p className="text-xs text-textMuted mb-2">
              {item.region ?? item.regionLabel ?? '지역 미정'}
              {item.brand ? ` · ${item.brand}` : ''}
            </p>

            <div className="text-[11px] text-textMuted">
              {item.startDate ?? '???'} ~ {item.endDate ?? '???'}
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}
