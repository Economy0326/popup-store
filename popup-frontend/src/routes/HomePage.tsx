import { useState, useMemo, useEffect } from 'react'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import MonthSelector from '../components/MonthSelector'
import type { PopupItem } from '../types/popup'
import {
  fetchHomeInitial,
  fetchHomeMonthly,
  searchPopups,
} from '../api/popups'

export default function HomePage() {
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

  const [searchResult, setSearchResult] = useState<PopupItem[] | null>(null)

  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 현재 선택된 키 (데이터 요청용)
  const currentMonthKey = `${thisYear}-${String(selectedMonth).padStart(
    2,
    '0'
  )}`

  // 첫 진입: /api/popups/home (latest + popular + 이번 달 monthly)
  useEffect(() => {
    const loadInitial = async () => {
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

        // 처음에는 보여주는 달도 현재 달
        setDisplayMonthKey(initialMonthKey)
      } catch (e: any) {
        console.error(e)
        setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      } finally {
        setInitialLoading(false)
      }
    }

    loadInitial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 의존성 빈배열 => 최초 1번만

  // 월 변경 시: 새 달 데이터를 백그라운드에서만 불러오기
  useEffect(() => {
    if (searchResult) return           // 검색 모드면 스킵
    if (!homeBase) return              // 초기 로딩 전이면 스킵
    if (monthlyByMonth[currentMonthKey]) return // 이미 캐시됐으면 스킵

    const loadMonthly = async () => {
      try {
        // 여기서도 로딩 텍스트/레이아웃 안 바꿈: 그냥 데이터만 받아옴
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

  const handleSearch = async (next: SearchFilters) => {
    try {
      setError(null)

      const res = await searchPopups({
        region:
          next.location === '전체' || next.location === ''
            ? undefined
            : next.location,
        category: next.category === '전체' ? undefined : next.category,
        date: next.date || undefined,
      })

      setSearchResult(res.items)
    } catch (e: any) {
      console.error(e)
      setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      setSearchResult([])
    }
  }

  const renderEmptySearch = () => (
    <div className="mx-auto max-w-7xl px-6 py-12 text-center text-sm text-textMuted">
      조건에 맞는 팝업스토어가 없어요
      <br />
      필터를 바꾸거나 날짜를 다시 선택해 보세요.
    </div>
  )

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
              searchResult.length === 0 ? (
                renderEmptySearch()
              ) : (
                <GridSection
                  title="검색 결과"
                  items={searchResult}
                  variant="grid"
                  pageSize={12}
                />
              )
            ) : homeBase ? (
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
