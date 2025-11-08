import { useEffect, useRef, useState } from 'react'
import type { PopupItem } from '../lib/types'
import PopupCard from './PopupCard'

export default function GridSection({ title, items }: { title: string; items: PopupItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [showArrows, setShowArrows] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      setShowArrows(el.scrollWidth > el.clientWidth + 8)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items])

  const scrollByViewport = (dir: 'left'|'right') => {
    const el = wrapRef.current
    if (!el) return
    const amount = Math.floor(el.clientWidth * 0.9)
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {showArrows && (
          <div className="hidden sm:flex gap-2">
            <IconButton label="이전" onClick={() => scrollByViewport('left')}>
              <ChevronLeft />
            </IconButton>
            <IconButton label="다음" onClick={() => scrollByViewport('right')}>
              <ChevronRight />
            </IconButton>
          </div>
        )}
      </div>

      <div
        ref={wrapRef}
        className="relative -mx-2 px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex gap-5 snap-x snap-mandatory">
          {items.map((it) => (
            <div
              key={it.id}
              className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%]"
            >
              <PopupCard item={it} />
            </div>
          ))}
        </div>
      </div>

      {/* 모바일에선 하단 버튼으로 제공 */}
      {showArrows && (
        <div className="mt-3 flex sm:hidden justify-center gap-3">
          <IconButton label="이전" onClick={() => scrollByViewport('left')}><ChevronLeft /></IconButton>
          <IconButton label="다음" onClick={() => scrollByViewport('right')}><ChevronRight /></IconButton>
        </div>
      )}
    </section>
  )
}

function IconButton({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="h-8 w-8 grid place-items-center rounded-full border border-line bg-card hover:shadow-soft"
    >
      {children}
    </button>
  )
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
