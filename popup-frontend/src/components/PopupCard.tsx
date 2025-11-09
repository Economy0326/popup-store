import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import type { PopupItem } from '../lib/types'

export default function PopupCard({ item }: { item: PopupItem }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <div className="relative">
      <Link
        to={`/popup/${item.id}`}
        className="block"
      >
        <article className="bg-card border border-line rounded-xl2 shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition cursor-pointer relative">
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-44 sm:h-48 w-full object-cover"
            />
          )}

          {/* 찜 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(item.id)
            }}
            className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full px-2 py-1 text-md text-blue-600 shadow-sm hover:bg-white transition
                      focus:outline-none focus-visible:outline-none focus:ring-0"
          >
            {isFavorite(item.id) ? '♥' : '♡'}
          </button>

          <div className="p-4">
            <h3 className="font-semibold text-slate-900 line-clamp-1 mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-textMuted mb-2">
              {item.region ?? '지역 미정'}
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
