import { useState, useRef } from 'react'

const REGION_OPTIONS = [
  '전체',
  '서울/강남구',
  '서울/성동구',
  '서울/마포구',
  '서울/용산구',
  '부산/수영구',
]

const CATEGORY_OPTIONS = [
  '전체',
  '패션',
  '리빙',
  '푸드',
  '아트',
  '향수',
]

export type SearchFilters = {
  location: string // REGION_OPTIONS 값
  date: string     // yyyy-mm-dd
  category: string // CATEGORY_OPTIONS 값
}

export default function HeroSection({
  onSearch,
}: {
  onSearch: (filters: SearchFilters) => void
}) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '전체',
    date: '',
    category: '전체',
  })

  const dateInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSearch(filters)
  }

  return (
    <section className="relative text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="popup background"
          className="w-full h-full object-cover"
        />
          <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-sm" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-24 grid gap-10 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] items-center">
        {/* 타이틀 */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-sm">
            Discover the Best
            <br />
            Popup Stores
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-100 max-w-xl">
            Search by region, date, and category to plan your popup store visits easily.
            Save your favorites and explore curated recommendations.
          </p>
        </div>
      </div>

      {/* 필터 바: 아래쪽에 겹치게 */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 -mt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1.3fr_1.3fr_0.9fr] gap-3 bg-white rounded-2xl shadow-soft px-4 py-3 items-center">
          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-sm text-slate-500">Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {REGION_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-sm text-slate-500">
              Date
            </label>

            <div
              className="relative h-10"
              onClick={() => {
                // 지원하는 브라우저에서는 바로 달력 오픈
                if (dateInputRef.current?.showPicker) {
                  dateInputRef.current.showPicker()
                } else {
                  dateInputRef.current?.focus()
                }
              }}
            >
              {/* 실제 date 인풋 */}
              <input
                ref={dateInputRef}
                type="date"
                value={filters.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />

              {/* 가짜 UI */}
              <div className="flex h-full w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800">
                {/* 왼쪽: 날짜가 있을 때만 텍스트 보여줌 */}
                <span className="truncate">
                  {filters.date ? filters.date : ''}
                  {/* 필요하면 여기서 포맷 바꿔도 됨 (예: 2025.11.15) */}
                </span>

                {/* 오른쪽: 캘린더 아이콘 */}
                <span className="ml-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-sm text-slate-500">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Search 버튼 */}
          <div className="flex items-end">
            <button
              onClick={handleSubmit}
              className="w-full h-10 rounded-lg bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition
                        focus:outline-none focus-visible:outline-none focus:ring-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
