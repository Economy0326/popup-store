import { useEffect, useRef, useState } from 'react'
import type { PopupItem } from '../types/popup'
import PopupCard from './PopupCard'
import PopupCardSkeleton from './PopupCardSkeleton'

type GridSectionProps = {
  title: string
  items: PopupItem[]
  variant?: 'carousel' | 'grid'
  pageSize?: number
  rightSlot?: React.ReactNode
  loading?: boolean
  skeletonCount?: number
  gridClassName?: string
}

export default function GridSection({
  title,
  items,
  variant = 'carousel',
  pageSize,
  rightSlot,
  loading = false,
  skeletonCount = 6,
  gridClassName,
}: GridSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [showArrows, setShowArrows] = useState(false)

  const [visibleCount, setVisibleCount] = useState(() =>
    pageSize ? Math.min(pageSize, items.length) : items.length
  )

  useEffect(() => {
    setVisibleCount(pageSize ? Math.min(pageSize, items.length) : items.length)
  }, [items, pageSize])

  const visibleItems = items.slice(0, visibleCount)
  const canLoadMore = visibleCount < items.length

  useEffect(() => {
    if (variant !== 'carousel') {
      setShowArrows(false)
      return
    }

    const el = wrapRef.current
    if (!el) return

    const update = () => {
      setShowArrows(el.scrollWidth > el.clientWidth + 8)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items, variant])

  const scrollByViewport = (dir: 'left' | 'right') => {
    const el = wrapRef.current
    if (!el) return
    const amount = Math.floor(el.clientWidth * 0.9)
    el.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const handleLoadMore = () => {
    if (!pageSize) return
    setVisibleCount((prev) => Math.min(prev + pageSize, items.length))
  }

  return (
    <section className="relative mx-auto max-w-7xl px-6 sm:px-8 py-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold whitespace-nowrap">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          {rightSlot}
        </div>
      </div>

      {variant === 'carousel' ? (
        <div className="relative">
          <div
            ref={wrapRef}
            className="relative -mx-2 px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex gap-5 snap-x snap-mandatory">
              {visibleItems.map((it) => (
                <div
                  key={it.id}
                  className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%]"
                >
                  <PopupCard item={it} />
                </div>
              ))}
            </div>
          </div>

          {/* 카드 양쪽 화살표 (데스크탑/태블릿 이상) */}
          {showArrows && (
            <>
              <button
                aria-label="이전"
                onClick={() => scrollByViewport('left')}
                className="hidden sm:grid place-items-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full h-11 w-11 rounded-full border border-line bg-card shadow-soft"
              >
                <ChevronLeft large />
              </button>
              <button
                aria-label="다음"
                onClick={() => scrollByViewport('right')}
                className="hidden sm:grid place-items-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-11 w-11 rounded-full border border-line bg-card shadow-soft"
              >
                <ChevronRight large />
              </button>
            </>
          )}
        </div>
      ) : (
        // 3 x N 그리드
        <div
          className={
            gridClassName ??
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8'
          }
        >
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <PopupCardSkeleton key={i} />
              ))
            : visibleItems.map((it) => (
                <PopupCard key={it.id} item={it} />
              ))}
        </div>
      )}

      {/* 모바일에서는 아래쪽에 화살표 */}
      {variant === 'carousel' && showArrows && (
        <div className="mt-3 flex sm:hidden justify-center gap-3">
          <IconButton label="이전" onClick={() => scrollByViewport('left')}>
            <ChevronLeft />
          </IconButton>
          <IconButton label="다음" onClick={() => scrollByViewport('right')}>
            <ChevronRight />
          </IconButton>
        </div>
      )}

      {pageSize && canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm rounded-full border border-line bg-card hover:shadow-soft"
          >
            더보기
          </button>
        </div>
      )}
    </section>
  )
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
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

function ChevronLeft({ large }: { large?: boolean }) {
  const size = large ? 22 : 18
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight({ large }: { large?: boolean }) {
  const size = large ? 22 : 18
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
