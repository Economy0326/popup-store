import { useState } from 'react'

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
            <label className="text-[10px] font-medium text-slate-500">Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
            <label className="text-[10px] font-medium text-slate-500">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-slate-500">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
              className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition
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
