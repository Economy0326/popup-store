import { useState, useMemo, useEffect } from 'react'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import MonthSelector from '../components/MonthSelector'
import type { PopupItem } from '../types/popup'
import { fetchHomePopups, searchPopups } from '../api/popups'

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  )

  const [homeData, setHomeData] = useState<{
    latest: PopupItem[]
    popular: PopupItem[]
    monthly: PopupItem[]
  } | null>(null)

  const [searchResult, setSearchResult] = useState<PopupItem[] | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 홈 데이터 로딩: /api/popups/home
  useEffect(() => {
    // 검색 결과 모드일 때는 /home 다시 부르지 않음
    if (searchResult) return

    const loadHome = async () => {
      try {
        setLoading(true)
        setError(null)

        const year = new Date().getFullYear()
        const monthString = `${year}-${String(selectedMonth).padStart(2, '0')}`

        const res = await fetchHomePopups({ month: monthString })
        setHomeData(res)
      } catch (e: any) {
        console.error(e)
        setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadHome()
  }, [selectedMonth, searchResult])

  // regionOptions: 홈 데이터에서 regionLabel 모아서 사용
  const regionOptions = useMemo(() => {
    if (!homeData) return []
    const set = new Set<string>()

    homeData.latest.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    homeData.popular.forEach((i) => i.regionLabel && set.add(i.regionLabel))
    homeData.monthly.forEach((i) => i.regionLabel && set.add(i.regionLabel))

    return Array.from(set).sort()
  }, [homeData])

  // 검색 버튼 눌렀을 때: /api/popups 검색 모드
  const handleSearch = async (next: SearchFilters) => {
    try {
      setLoading(true)
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
      setLoading(false)
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
        {loading && (
          <p className="text-center text-sm text-textMuted">
            팝업 정보를 불러오는 중입니다...
          </p>
        )}
        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>
            {searchResult ? (
              // 검색 결과 모드: 3 x N 그리드
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
            ) : homeData ? (
              // 홈 기본 모드: /home 응답 3개 섹션
              <>
                <GridSection
                  title="새로 들어온 팝업스토어"
                  items={homeData.latest}
                />
                <GridSection
                  title="인기 있는 팝업스토어"
                  items={homeData.popular}
                />
                <GridSection
                  title={`${selectedMonth}월 팝업스토어`}
                  items={homeData.monthly}
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
