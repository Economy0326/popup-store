import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import MonthSelector from '../components/MonthSelector'
import type { PopupItem } from '../types/popup'
import {
  fetchHomeInitial,
  fetchHomeMonthly,
  searchPopups,
} from '../api/popups'

// 검색 결과 페이지당 개수는 15개로 고정
const SEARCH_PAGE_SIZE = 15

// 검색 결과 + 페이지 정보까지 함께 들고 있을 형태
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

  // 유저가 선택한 달 (UI용)
  const [selectedMonth, setSelectedMonth] = useState(thisMonth)

  // 검색 로딩 상태 
  const [searchLoading, setSearchLoading] = useState(false)

  // latest / popular 는 공통
  const [homeBase, setHomeBase] = useState<{
    latest: PopupItem[]
    popular: PopupItem[]
  } | null>(null)

  // month → monthly 캐시
  const [monthlyByMonth, setMonthlyByMonth] = useState<
    Record<string, PopupItem[]>
  >({})

  // 실제로 화면에 보여주는 month key
  const [displayMonthKey, setDisplayMonthKey] =
    useState<string>(initialMonthKey)

  // 검색 결과 전체
  const [searchResult, setSearchResult] = useState<SearchResultState>(null)

  // HeroSection UI 필터 (URL과 동기화)
  const [uiFilters, setUiFilters] = useState<SearchFilters>({
    location: '전체',
    date: '',
    category: '전체',
  })

  // 초기 로딩 및 에러 상태
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 현재 선택된 키 (데이터 요청용)
  const currentMonthKey = `${thisYear}-${String(selectedMonth).padStart(
    2,
    '0'
  )}`

  // 검색 상태 url 파싱
  const readQuery = () => {
    const p = new URLSearchParams(location.search)

    // reset 파라미터가 있으면 무조건 홈 모드
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

  // 공통 홈 데이터 로더
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

      // 보여주는 달도 현재 달로
      setDisplayMonthKey(initialMonthKey)
    } catch (e: any) {
      console.error(e)
      setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
    } finally {
      setInitialLoading(false)
    }
  }

  // 첫 진입: /api/popups/home (latest + popular + 이번 달 monthly)
  useEffect(() => {
    loadHome()
  }, []) // 최초 1번만

  // 월 변경 시: 새 달 데이터를 백그라운드에서만 불러오기
  useEffect(() => {
    // 검색 모드면 월 데이터는 건들지 않음
    if (searchResult) return
    if (!homeBase) return

    // 이미 캐시된 달이면 API 호출하지 말고 단순히 displayMonthKey만 변경
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

  // 화면에 실제로 뿌리는 monthly 는 항상 displayMonthKey 기준
  const monthly = monthlyByMonth[displayMonthKey] ?? []

  // regionOptions: latest + popular + 현재 달 monthly 기준
  const regionOptions = useMemo(() => {
    if (!homeBase) return []
    const set = new Set<string>()

    homeBase.latest.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    homeBase.popular.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    monthly.forEach((i) => i.regionLabel && set.add(i.regionLabel))

    return Array.from(set).sort()
  }, [homeBase, monthly])

  const isInitialLoading = initialLoading && !homeBase && !searchResult

  // 실제 검색 호출 로직
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


  // URL 바뀔 때마다: 검색 모드면 검색 실행 / 아니면 홈 모드
  useEffect(() => {
    const { hasSearch, filters, page } = readQuery()

    // HeroSection 입력값 URL과 동기화
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
  }, [location.search])

  // 검색 버튼 클릭 시 -> URL 변경
  const handleSearch = (next: SearchFilters) => {
    const p = new URLSearchParams()

    const region = next.location.trim()
    if (region !== '' && region !== '전체') p.set('region', region)
    if (next.date) p.set('date', next.date)
    if (next.category !== '전체') p.set('category', next.category)

    p.set('mode', 'search')

    p.set('page', '1')
    navigate(`/?${p.toString()}`)
  }

  // 페이지 번호 클릭 시 -> URL 변경
  const handleChangeSearchPage = (nextPage: number) => {
    const p = new URLSearchParams(location.search)
    p.set('page', String(nextPage))
    navigate(`/?${p.toString()}`)
  }

  const renderEmptySearch = () => (
    <div className="mx-auto max-w-7xl px-6 py-12 text-center text-sm text-textMuted">
      조건에 맞는 팝업스토어가 없어요
      <br />
      필터를 바꾸거나 날짜를 다시 선택해 보세요.
    </div>
  )

  // 페이지네이션 UI (검색 결과에만 사용)
  const renderPagination = () => {
    if (!searchResult) return null
    const { total, pageSize, page } = searchResult
    if (!total || total <= pageSize) return null

    const totalPages = Math.ceil(total / pageSize)
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
      <div className="flex justify-center gap-2 py-6 text-sm">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handleChangeSearchPage(p)}
            className={`min-w-[32px] rounded-md border px-2 py-1 ${
              p === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-bg">
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

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

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
                <GridSection
                  title={`${selectedMonth}월 팝업스토어`}
                  items={monthly}
                  loading={initialLoading}
                  skeletonCount={6}
                  rightSlot={
                    <MonthSelector
                      selected={selectedMonth}
                      onChange={setSelectedMonth}
                    />
                  }
                />
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
