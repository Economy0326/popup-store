import { useRef } from 'react'
import { CATEGORY_LABEL_MAP } from '../lib/categoryMap'

// value = 코드, label = 한글
const CATEGORY_OPTIONS = [
  { value: '전체', label: '전체' },
  ...Object.entries(CATEGORY_LABEL_MAP).map(([value, label]) => ({
    value, // fashion, beauty, ...
    label, // 패션, 뷰티, ...
  })),
]

export type SearchFilters = {
  location: string // 예: '전체' 또는 '서울 성동구'
  date: string     // yyyy-mm-dd
  category: string // '전체' 또는 카테고리 코드 (fashion, beauty, ...)
}

export default function HeroSection({
  onSearch,
  regionOptions,
  value,
  onChange,
}: {
  onSearch: (filters: SearchFilters) => void
  regionOptions: string[]   // '서울 성동구', '서울 강남구' ...
  value: SearchFilters
  onChange: (next: SearchFilters) => void
}) {
  const filters = value
  const dateInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = <K extends keyof SearchFilters>(key: K, v: SearchFilters[K]) => {
    onChange({ ...filters, [key]: v })
  }

  const handleSubmit = () => {
    // 제출 시 정규화(공백/전체 처리)
    const normalized: SearchFilters = {
      location: filters.location.trim() === '' ? '전체' : filters.location.trim(),
      date: filters.date,
      category: filters.category,
    }
    onSearch(normalized)
  }

  // regionOptions가 비어있을 때를 위한 기본 추천값
  const effectiveRegionOptions =
    regionOptions.length > 0
      ? regionOptions
      : ['서울 성동구', '서울 강남구', '부산 수영구']

  return (
    <section className="relative text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="팝업 스토어 배경"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
      </div>

      {/* 텍스트 + 필터를 같은 흐름으로 배치 */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-14 pb-12 sm:pt-16 sm:pb-14">
        {/* 텍스트 영역 */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-sm break-keep">
            요즘 가장 인기 있는
            <br />
            팝업을 한눈에
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-100/90 max-w-xl">
            지역·날짜·카테고리로 원하는 팝업을 쉽게 찾아보세요.
            <br className="hidden md:block" />
            관심 팝업은 찜해두고 나만의 리스트를 만들어 보세요.
          </p>
        </div>

        {/* 필터바 */}
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1.3fr_1.3fr_0.9fr] gap-3 bg-white/98 rounded-2xl shadow-xl px-4 py-3 items-center border border-white/60">
            {/* 지역 */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-white text-slate-500">
                지역
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.location === '전체' ? '' : filters.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  list="region-list"
                  placeholder="전체"
                  className="h-9 w-full px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <datalist id="region-list">
                  {effectiveRegionOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* 날짜 */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-white text-slate-500">
                날짜
              </label>

              <div
                className="relative h-9"
                onClick={() => {
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
                  <span className="truncate">
                    {filters.date ? filters.date : ''}
                  </span>

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

            {/* 카테고리 */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-white text-slate-500">
                카테고리
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 검색 버튼 */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-slate-500 invisible">
                검색
              </span>
              <button
                onClick={handleSubmit}
                className="w-full h-9 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-md font-bold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition
                          focus:outline-none focus-visible:outline-none"
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
