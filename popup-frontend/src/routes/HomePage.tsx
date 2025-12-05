import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  const location = useLocation()

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1
  const initialMonthKey = `${thisYear}-${String(thisMonth).padStart(2, '0')}`

  // 유저가 선택한 달 (UI용)
  const [selectedMonth, setSelectedMonth] = useState(thisMonth)

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

  // 검색 결과 전체(현재 페이지 아이템 + page/pageSize/total)
  const [searchResult, setSearchResult] = useState<SearchResultState>(null)

  // 어떤 필터로 검색 중인지 저장해두기 (페이지 이동 시 재사용)
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)

  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 현재 선택된 키 (데이터 요청용)
  const currentMonthKey = `${thisYear}-${String(selectedMonth).padStart(
    2,
    '0'
  )}`

  // 공통으로 쓰는 홈 데이터 로더 함수
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

      // 처음/리셋 시에는 보여주는 달도 현재 달
      setDisplayMonthKey(initialMonthKey)
    } catch (e: any) {
      console.error(e)
      setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
    } finally {
      setInitialLoading(false)
    }
  }

  // 로고에서 "/?reset=1"로 들어온 경우: 검색 + 홈 데이터까지 완전 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const shouldReset = params.get('reset') === '1'

    if (!shouldReset) return

    // 검색 관련 상태 초기화
    setSearchResult(null)
    setSearchFilters(null)

    // 월 선택도 현재 달로 초기화
    setSelectedMonth(thisMonth)
    setDisplayMonthKey(initialMonthKey)

    // 홈 데이터도 다시 불러오기 (api/popups/home 재호출)
    // 로고 = 항상 최신 홈 화면
    loadHome()
  }, [location.search])

  // 첫 진입: /api/popups/home (latest + popular + 이번 달 monthly)
  useEffect(() => {
    // 이미 reset 효과에서 호출했다면, homeBase 가 null 이 아닐 수 있음
    // 하지만 그냥 한 번 더 불러도 큰 문제는 없음.
    if (!homeBase) {
      loadHome()
    }
  }, []) // 의존성 빈배열 => 최초 1번만

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

        // 데이터 다 받았을 때만 화면에 보여주는 달을 교체
        setDisplayMonthKey(currentMonthKey)
      } catch (e: any) {
        console.error(e)
        // 에러 나도 그냥 이전 달 데이터 계속 보여주면 됨
      }
    }

    loadMonthly()
  }, [currentMonthKey, searchResult, homeBase, monthlyByMonth])

  // 화면에 실제로 뿌리는 monthly 는 항상 displayMonthKey 기준
  const monthly = monthlyByMonth[displayMonthKey] ?? []

  // regionOptions: latest + popular + "현재 화면에 보이는 달"의 monthly 기준
  const regionOptions = useMemo(() => {
    if (!homeBase) return []
    const set = new Set<string>()

    homeBase.latest.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    homeBase.popular.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    monthly.forEach((i) => i.regionLabel && set.add(i.regionLabel))

    return Array.from(set).sort()
  }, [homeBase, monthly])

  const isInitialLoading = initialLoading && !homeBase && !searchResult

  // 실제 검색 호출 로직 (초기 검색 + 페이지 이동 둘 다 여기 사용)
  const runSearch = async (filters: SearchFilters, page: number) => {
    try {
      setError(null)

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
    }
  }

  // 검색 버튼 클릭 시
  const handleSearch = async (next: SearchFilters) => {
    // 현재 필터를 저장해두고, 항상 1페이지부터 시작
    setSearchFilters(next)
    await runSearch(next, 1)
  }

  // 페이지 번호 클릭 시
  const handleChangeSearchPage = async (nextPage: number) => {
    if (!searchFilters) return // 필터 정보가 없으면 수행 X
    // 동일 페이지 눌렀을 때는 무시
    if (searchResult && searchResult.page === nextPage) return

    await runSearch(searchFilters, nextPage)
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

    // 일단은 전체를 다 보여주는 단순한 게시판 스타일
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
      <HeroSection onSearch={handleSearch} regionOptions={regionOptions} />

      <div className="mt-10 space-y-6">
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
              // 검색 결과 모드
              searchResult.items.length === 0 ? (
                renderEmptySearch()
              ) : (
                <>
                  <GridSection
                    title="검색 결과"
                    items={searchResult.items}
                    variant="grid"
                    // 서버 페이지네이션 기준에 맞춰 15개
                    pageSize={SEARCH_PAGE_SIZE}
                  />
                  {/* 게시판 스타일 페이지네이션 */}
                  {renderPagination()}
                </>
              )
            ) : homeBase ? (
              // 기본 홈 화면 모드
              <>
                <GridSection
                  title="새로 들어온 팝업스토어"
                  items={homeBase.latest}
                />
                <GridSection
                  title="인기 있는 팝업스토어"
                  items={homeBase.popular}
                />
                <GridSection
                  title={`${selectedMonth}월 팝업스토어`}
                  items={monthly}
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
