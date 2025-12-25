import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

interface MonthSelectorProps {
  selected: number
  onChange: (month: number) => void
  /** 스크롤을 맞출 대상 엘리먼트 id (HomePage에서 달아줌) */
  scrollTargetId?: string
}

export default function MonthSelector({
  selected,
  onChange,
  scrollTargetId = 'monthly-section',
}: MonthSelectorProps) {
  const [expanded, setExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const interactedRef = useRef(false)

  // 버튼 감안해서 2줄 높이
  const twoLineMaxHeight = 92

  const handleClick = (m: number) => {
    interactedRef.current = true
    onChange(m)
  }

  // 3줄 이상이면 "더보기" 보여주기 판단
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return

    const measure = () => {
      // scrollHeight가 2줄 높이보다 크면 toggle 필요
      setShowToggle(el.scrollHeight > twoLineMaxHeight + 2)
      // expanded=false인데 내용이 2줄 이하로 줄어들면 toggle 숨김 + expanded 초기화
      if (el.scrollHeight <= twoLineMaxHeight + 2) setExpanded(false)
    }

    measure()

    // 리사이즈 대응(회전/브라우저 바 변화)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // 월 선택 시 항상 같은 위치로 스크롤 (iOS에서 가끔 씹히는 케이스 rAF 2번)
  useEffect(() => {
    if (!interactedRef.current) return
    if (typeof window === 'undefined') return

    const target = document.getElementById(scrollTargetId)
    if (!target) return

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }, [selected, scrollTargetId])

  return (
    <div className="w-full" ref={containerRef}>
      <div
        ref={contentRef}
        className={[
          'flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1',
          showToggle && !expanded ? 'overflow-hidden' : '',
        ].join(' ')}
        style={showToggle && !expanded ? { maxHeight: twoLineMaxHeight } : undefined}
      >
        {MONTHS.map((m) => {
          const isActive = selected === m

          return (
            <button
              key={m}
              type="button"
              onClick={() => handleClick(m)}
              className={`
                w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11
                rounded-full border
                flex items-center justify-center
                transition-all duration-200 transform
                outline-none focus:outline-none focus-visible:outline-none focus:ring-0
                ${
                  isActive
                    ? 'bg-primary border-primary text-white scale-110'
                    : 'bg-card border-line text-textMuted hover:scale-110 hover:bg-primary hover:border-primary hover:text-white'
                }
              `}
            >
              <span className="text-xs sm:text-sm md:text-sm font-bold">{m}</span>
            </button>
          )
        })}
      </div>

      {showToggle && (
        <div className="flex justify-center mt-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs sm:text-sm text-textMuted hover:text-text px-2 py-1"
          >
            {expanded ? '접기' : '더보기'}
          </button>
        </div>
      )}
    </div>
  )
}
