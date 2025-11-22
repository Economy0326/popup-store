import { useEffect, useRef, useState } from 'react'
import type { PopupItem } from '../types/popup'
import PopupCard from './PopupCard'

type GridSectionProps = {
  title: string
  items: PopupItem[]
  variant?: 'carousel' | 'grid'
  pageSize?: number // ex) 12 넘기면 "더 보기" 동작
  rightSlot?: React.ReactNode
}

export default function GridSection({
  title,
  items,
  variant = 'carousel',
  pageSize,
  rightSlot,
}: GridSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [showArrows, setShowArrows] = useState(false)

  // ▶ "더 보기"용 visibleCount
  const [visibleCount, setVisibleCount] = useState(() =>
    pageSize ? Math.min(pageSize, items.length) : items.length
  )

  useEffect(() => {
    // items / pageSize 바뀌면 visibleCount 리셋
    setVisibleCount(pageSize ? Math.min(pageSize, items.length) : items.length)
  }, [items, pageSize])

  const visibleItems = items.slice(0, visibleCount)
  const canLoadMore = visibleCount < items.length

  // ▶ 캐러셀에서만 좌우 화살표 필요
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
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold whitespace-nowrap">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          {rightSlot}
          {variant === 'carousel' && showArrows && (
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
      </div>

      {variant === 'carousel' ? (
        // 홈에서 쓰는 가로 캐러셀
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
      ) : (
        // 즐겨찾기 페이지용 세로 그리드
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleItems.map((it) => (
            <PopupCard key={it.id} item={it} />
          ))}
        </div>
      )}

      {/* 모바일 캐러셀 화살표 */}
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

      {/* "더보기" 버튼 (pageSize가 있을 때만) */}
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

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
