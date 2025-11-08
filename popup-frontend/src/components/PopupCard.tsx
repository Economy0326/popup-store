import type { PopupItem } from '../lib/types'

export default function PopupCard({ item }: { item: PopupItem }) {
  return (
    <article className="bg-card border border-line rounded-xl2 shadow-soft overflow-hidden hover:-translate-y-0.5 transition">
      {item.thumbnail && (
        <img src={item.thumbnail} alt={item.title} className="h-44 sm:h-48 w-full object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1 mb-1">{item.title}</h3>
        <p className="text-sm text-textMuted mb-2">
          {item.region ?? '지역 미정'}{item.brand ? ` · ${item.brand}` : ''}
        </p>
        <div className="flex items-center justify-between text-xs text-textMuted">
          <span>{item.startDate ?? '???'} ~ {item.endDate ?? '???'}</span>
          <button className="px-3 py-1 rounded-full bg-primary text-white">자세히</button>
        </div>
      </div>
    </article>
  )
}
