import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import MonthSelector from '../components/MonthSelector'
import type { PopupItem } from '../types/popup'
import { fetchHomeInitial, fetchHomeMonthly, searchPopups } from '../api/popups'

// 검색 결과 페이지당 개수는 15개로 고정
const SEARCH_PAGE_SIZE = 15

type SearchResultState = {
  items: PopupItem[]
  page: number
  pageSize: number
  total: number
} | null

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1
  const initialMonthKey = `${thisYear}-${String(thisMonth).padStart(2, '0')}`

  const [selectedMonth, setSelectedMonth] = useState(thisMonth)
  const [searchLoading, setSearchLoading] = useState(false)

  const [homeBase, setHomeBase] = useState<{
    latest: PopupItem[]
    popular: PopupItem[]
  } | null>(null)

  const [monthlyByMonth, setMonthlyByMonth] = useState<Record<string, PopupItem[]>>({})
  const [displayMonthKey, setDisplayMonthKey] = useState<string>(initialMonthKey)
  const [searchResult, setSearchResult] = useState<SearchResultState>(null)

  const [uiFilters, setUiFilters] = useState<SearchFilters>({
    location: '전체',
    date: '',
    category: '전체',
  })

  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentMonthKey = `${thisYear}-${String(selectedMonth).padStart(2, '0')}`

  // 검색 페이지네이션 클릭으로 "이동"한 경우에만 스크롤하도록 플래그
  const shouldScrollTopRef = useRef(false)

  const readQuery = () => {
    const p = new URLSearchParams(location.search)

    if (p.has('reset')) {
      return {
        hasSearch: false,
        filters: { location: '전체', date: '', category: '전체' } as SearchFilters,
        page: 1,
      }
    }

    const locationFilter = p.get('region') ?? '전체'
    const date = p.get('date') ?? ''
    const category = p.get('category') ?? '전체'
    const page = Number(p.get('page') ?? '1')

    const mode = p.get('mode')
    const hasSearch =
      mode === 'search' || p.has('region') || p.has('date') || p.has('category')

    return {
      hasSearch,
      filters: { location: locationFilter, date, category } as SearchFilters,
      page: Number.isFinite(page) && page >= 1 ? page : 1,
    }
  }

  const loadHome = async () => {
    try {
      setInitialLoading(true)
      setError(null)

      const res = await fetchHomeInitial()

      setHomeBase({
        latest: res.latest ?? [],
        popular: res.popular ?? [],
      })

      setMonthlyByMonth((prev) => ({
        ...prev,
        [initialMonthKey]: res.monthly ?? [],
      }))

      setDisplayMonthKey(initialMonthKey)
    } catch (e: any) {
      console.error(e)
      setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadHome()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchResult) return
    if (!homeBase) return

    if (monthlyByMonth[currentMonthKey]) {
      setDisplayMonthKey(currentMonthKey)
      return
    }

    const loadMonthly = async () => {
      try {
        const res = await fetchHomeMonthly({ month: currentMonthKey })
        setMonthlyByMonth((prev) => ({
          ...prev,
          [currentMonthKey]: res.monthly ?? [],
        }))
        setDisplayMonthKey(currentMonthKey)
      } catch (e: any) {
        console.error(e)
      }
    }

    loadMonthly()
  }, [currentMonthKey, searchResult, homeBase, monthlyByMonth])

  const monthly = monthlyByMonth[displayMonthKey] ?? []

  const regionOptions = useMemo(() => {
    if (!homeBase) return []
    const set = new Set<string>()

    homeBase.latest.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    homeBase.popular.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    monthly.forEach((i) => i.regionLabel && set.add(i.regionLabel))

    return Array.from(set).sort()
  }, [homeBase, monthly])

  const isInitialLoading = initialLoading && !homeBase && !searchResult

  const runSearch = async (filters: SearchFilters, page: number) => {
    try {
      setError(null)
      setSearchLoading(true)

      const res = await searchPopups({
        region:
          filters.location === '전체' || filters.location === ''
            ? undefined
            : filters.location,
        category: filters.category === '전체' ? undefined : filters.category,
        date: filters.date || undefined,
        page,
        pageSize: SEARCH_PAGE_SIZE,
      })

      setSearchResult({
        items: res.items,
        page: res.page,
        pageSize: res.pageSize,
        total: res.total,
      })
    } catch (e: any) {
      console.error(e)
      setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      setSearchResult({
        items: [],
        page,
        pageSize: SEARCH_PAGE_SIZE,
        total: 0,
      })
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    const { hasSearch, filters, page } = readQuery()

    setUiFilters(filters)

    if (!hasSearch) {
      setSearchResult(null)
      setError(null)

      const p = new URLSearchParams(location.search)
      if (p.has('reset') && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      if (!homeBase) loadHome()
      return
    }

    runSearch(filters, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // 검색 결과 페이지가 바뀌고(데이터 반영된 뒤) 스크롤을 올림 -> “될 때/안될 때” 해결
  useEffect(() => {
    if (!searchResult) return
    if (!shouldScrollTopRef.current) return
    if (typeof window === 'undefined') return

    shouldScrollTopRef.current = false

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
  }, [searchResult?.page])

  const handleSearch = (next: SearchFilters) => {
    const p = new URLSearchParams()

    const region = next.location.trim()
    if (region !== '' && region !== '전체') p.set('region', region)
    if (next.date) p.set('date', next.date)
    if (next.category !== '전체') p.set('category', next.category)

    p.set('mode', 'search')
    p.set('page', '1')

    // 검색 버튼은 보통 상단이라 스크롤 플래그 굳이 필요 없지만 통일
    shouldScrollTopRef.current = true
    navigate(`/?${p.toString()}`)
  }

  const handleChangeSearchPage = (nextPage: number) => {
    const p = new URLSearchParams(location.search)
    p.set('page', String(nextPage))
    shouldScrollTopRef.current = true
    navigate(`/?${p.toString()}`)
  }

  const renderEmptySearch = () => (
    <div className="mx-auto max-w-7xl px-6 py-12 text-center text-sm text-textMuted">
      조건에 맞는 팝업스토어가 없어요
      <br />
      필터를 바꾸거나 날짜를 다시 선택해 보세요.
    </div>
  )

  const renderPagination = () => {
    if (!searchResult) return null
    const { total, pageSize, page } = searchResult
    if (!total || total <= pageSize) return null

    const totalPages = Math.ceil(total / pageSize)
    const current = page
    if (totalPages <= 1) return null

    const goTo = (p: number) => {
      if (p < 1 || p > totalPages) return
      if (p === current) return
      handleChangeSearchPage(p)
    }

    // totalPages=2 중복 버그 방지
    if (totalPages === 2) {
      return (
        <div className="w-full px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 1}
              className={`px-3 py-1 rounded-md border ${
                current === 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Prev
            </button>

            <button
              onClick={() => goTo(1)}
              className={`min-w-[36px] px-3 py-1 rounded-md border ${
                current === 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              1
            </button>

            <button
              onClick={() => goTo(2)}
              className={`min-w-[36px] px-3 py-1 rounded-md border ${
                current === 2
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              2
            </button>

            <button
              onClick={() => goTo(current + 1)}
              disabled={current === 2}
              className={`px-3 py-1 rounded-md border ${
                current === 2
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )
    }

    const MAX_MIDDLE = 6
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

    let start = current - Math.floor(MAX_MIDDLE / 2)
    let end = start + MAX_MIDDLE - 1

    // middle은 2 ~ totalPages-1
    start = clamp(start, 2, totalPages - 1)
    end = clamp(end, 2, totalPages - 1)

    const middleCount = end - start + 1
    if (middleCount < MAX_MIDDLE) {
      end = clamp(end + (MAX_MIDDLE - middleCount), 2, totalPages - 1)
      start = clamp(start - (MAX_MIDDLE - (end - start + 1)), 2, totalPages - 1)
    }

    const middlePages: number[] = []
    for (let i = start; i <= end; i++) middlePages.push(i)

    const showLeftDots = start > 2
    const showRightDots = end < totalPages - 1

    return (
      <div className="w-full px-4 py-6">
        {/* 모바일 가로 overflow 방지: w-full + wrap + 가운데정렬 */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2 text-sm">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 1}
            className={`px-3 py-1 rounded-md border ${
              current === 1
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Prev
          </button>

          <div className="flex w-full sm:w-auto flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => goTo(1)}
              className={`min-w-[36px] px-3 py-1 rounded-md border ${
                current === 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              1
            </button>

            {showLeftDots && <span className="px-2 text-slate-400 select-none">…</span>}

            {middlePages.map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`min-w-[36px] px-3 py-1 rounded-md border ${
                  p === current
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}

            {showRightDots && <span className="px-2 text-slate-400 select-none">…</span>}

            <button
              onClick={() => goTo(totalPages)}
              className={`min-w-[36px] px-3 py-1 rounded-md border ${
                current === totalPages
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {totalPages}
            </button>
          </div>

          <button
            onClick={() => goTo(current + 1)}
            disabled={current === totalPages}
            className={`px-3 py-1 rounded-md border ${
              current === totalPages
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  return (
    // 혹시 모를 가로 overflow 안전장치
    <div className="bg-bg overflow-x-hidden">
      <HeroSection
        value={uiFilters}
        onChange={setUiFilters}
        onSearch={handleSearch}
        regionOptions={regionOptions}
      />

      <div className="mt-6 space-y-6">
        {isInitialLoading && (
          <p className="text-center text-sm text-textMuted">
            팝업 정보를 불러오는 중입니다...
          </p>
        )}

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        {!isInitialLoading && !error && (
          <>
            {searchResult ? (
              searchResult.items.length === 0 ? (
                renderEmptySearch()
              ) : (
                <>
                  <GridSection
                    title="검색 결과"
                    items={searchResult.items}
                    variant="grid"
                    pageSize={SEARCH_PAGE_SIZE}
                    loading={searchLoading}
                    skeletonCount={SEARCH_PAGE_SIZE}
                    gridClassName="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5"
                  />
                  {renderPagination()}
                </>
              )
            ) : homeBase ? (
              <>
                <GridSection
                  title="새로 들어온 팝업스토어"
                  items={homeBase.latest}
                  loading={initialLoading}
                  skeletonCount={6}
                />
                <GridSection
                  title="인기 있는 팝업스토어"
                  items={homeBase.popular}
                  loading={initialLoading}
                  skeletonCount={6}
                />

                {/* MonthSelector 스크롤 타겟 */}
                <div id="monthly-section">
                  <GridSection
                    title={`${selectedMonth}월 팝업스토어`}
                    items={monthly}
                    loading={initialLoading}
                    skeletonCount={6}
                    rightSlot={
                      <MonthSelector
                        selected={selectedMonth}
                        onChange={setSelectedMonth}
                        scrollTargetId="monthly-section"
                      />
                    }
                  />
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
