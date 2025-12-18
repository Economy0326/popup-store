export default function PopupCardSkeleton() {
  return (
    <article className="bg-card border border-line rounded-xl2 shadow-soft overflow-hidden">
      <div className="w-full aspect-[3/2] bg-slate-200 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
      </div>
    </article>
  )
}
