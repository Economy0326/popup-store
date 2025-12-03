import { useState, useMemo, useEffect } from 'react'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import MonthSelector from '../components/MonthSelector'
import type { PopupItem } from '../types/popup'
import { fetchHomeInitial, fetchHomeMonthly, searchPopups } from '../api/popups'

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  )

  // latest / popular 는 월이 바뀌어도 그대로라서 따로 저장
  const [homeBase, setHomeBase] = useState<{
    latest: PopupItem[]
    popular: PopupItem[]
  } | null>(null)

  // month별 monthly 캐시
  const [monthlyByMonth, setMonthlyByMonth] = useState<
    // Record<key, value>
    Record<string, PopupItem[]>
  >({})

  const [searchResult, setSearchResult] = useState<PopupItem[] | null>(null)

  const [loadingHome, setLoadingHome] = useState(true)
  const [loadingMonthly, setLoadingMonthly] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentYear = new Date().getFullYear()
  const currentMonthKey = `${currentYear}-${String(selectedMonth).padStart(2, '0')}`

  // 첫 진입: /api/home 한 번 호출 (latest + popular + 이번 달 monthly)
  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoadingHome(true)
        setError(null)

        const res = await fetchHomeInitial()

        setHomeBase({
          latest: res.latest ?? [],
          popular: res.popular ?? [],
        })

        // 서버는 이번 달 monthly 를 같이 내려줌
        setMonthlyByMonth((prev) => ({
          ...prev,
          // ?? => null 이나 undefined 일 때 빈 배열로 처리
          [currentMonthKey]: res.monthly ?? [],
        }))
      } catch (e: any) {
        console.error(e)
        setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      } finally {
        setLoadingHome(false)
      }
    }

    loadInitial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) //의존성 빈 배열 => 최초 마운트 때만 실행

  // 월 변경 시: /api/home?month=YYYY-MM 으로 monthly만 가져오기
  useEffect(() => {
    if (searchResult) return                      // 검색 모드일 땐 월별 로딩 안 함
    if (monthlyByMonth[currentMonthKey]) return   // 이미 캐시 되어 있으면 안 불러옴
    if (!homeBase) return                         // 초기 데이터도 없으면 대기

    const loadMonthly = async () => {
      try {
        setLoadingMonthly(true)
        setError(null)

        const res = await fetchHomeMonthly({ month: currentMonthKey })

        setMonthlyByMonth((prev) => ({
          ...prev,
          [currentMonthKey]: res.monthly ?? [],
        }))
      } catch (e: any) {
        console.error(e)
        setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      } finally {
        setLoadingMonthly(false)
      }
    }

    loadMonthly()
  }, [currentMonthKey, searchResult, homeBase, monthlyByMonth])

  const monthly = monthlyByMonth[currentMonthKey] ?? []

  // regionOptions: 홈 데이터에서 regionLabel 모아서 사용
  const regionOptions = useMemo(() => {
    if (!homeBase) return []
    const set = new Set<string>()

    homeBase.latest.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    homeBase.popular.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    monthly.forEach((i) => i.regionLabel && set.add(i.regionLabel))

    return Array.from(set).sort()
  }, [homeBase, monthly])

  const isInitialLoading = loadingHome && !homeBase && !searchResult

  const handleSearch = async (next: SearchFilters) => {
    try {
      setLoadingHome(true)
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
    } finally {
      setLoadingHome(false)
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
                    <div className="flex items-center gap-3">
                      {loadingMonthly && (
                        <span className="text-xs text-textMuted">
                          해당 월 팝업을 불러오는 중...
                        </span>
                      )}
                      <MonthSelector
                        selected={selectedMonth}
                        onChange={setSelectedMonth}
                      />
                    </div>
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
