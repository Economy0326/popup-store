import { useState, useMemo, useEffect } from 'react'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import MonthSelector from '../components/MonthSelector'
import type { PopupItem } from '../types/popup'
import { searchPopups } from '../api/popups'

const MAX_NEW_DAYS = 7 // 최근 7일 이내만 "최신" 섹션에 표시

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const [all, setAll] = useState<PopupItem[]>([])
  const [searchResult, setSearchResult] = useState<PopupItem[] | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 최초 진입 시 전체 리스트 한 번 로딩
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await searchPopups({})
        setAll(res.items)
      } catch (e: any) {
        setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPopups()
  }, [])

  // all에서 regionLabel만 뽑아서 추천 옵션으로 사용
  const regionOptions = useMemo(() => {
    const set = new Set<string>()
    all.forEach((item) => {
      if (item.regionLabel) set.add(item.regionLabel)
    })
    return Array.from(set).sort()
  }, [all])

  // 검색 버튼 눌렀을 때: 서버 검색 + 검색 결과 모드 진입
  const handleSearch = async (next: SearchFilters) => {
    setFilters(next)

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
      setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      setSearchResult([])
    } finally {
      setLoading(false)
    }
  }

  // 홈 3섹션용 필터
  const applyFilters = (items: PopupItem[] | any): PopupItem[] => {
    if (!filters) return Array.isArray(items) ? items : []

    const src: PopupItem[] = Array.isArray(items) ? items : []

    return src.filter((item) => {
      const addressSource = item.address ?? item.regionLabel ?? ''

      const matchLocation =
        filters.location === '전체' ||
        filters.location === '' ||
        (addressSource && addressSource.includes(filters.location))

      const matchCategory =
        filters.category === '전체' ||
        (item.categories &&
          item.categories.includes(filters.category))

      const matchDate =
        !filters.date ||
        (!item.startDate && !item.endDate) ||
        (item.startDate &&
          item.endDate &&
          filters.date >= item.startDate &&
          filters.date <= item.endDate)

      return matchLocation && matchCategory && matchDate
    })
  }

  // 새로 들어온 팝업: updated 기준으로 N일 이내 + 최신순
  const latest = useMemo(() => {
    const now = new Date()
    const srcAll = Array.isArray(all) ? all : []

    const withinRange = srcAll.filter((item) => {
      if (!item.updated) return false
      const updated = new Date(item.updated)
      if (Number.isNaN(updated.getTime())) return false

      const diffMs = now.getTime() - updated.getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)

      return diffDays >= 0 && diffDays <= MAX_NEW_DAYS
    })

    withinRange.sort((a, b) => {
      const aTime = a.updated ? new Date(a.updated).getTime() : 0
      const bTime = b.updated ? new Date(b.updated).getTime() : 0
      return bTime - aTime
    })

    return applyFilters(withinRange)
  }, [all, filters])

  // 인기: 나중에 백엔드에서 인기순 정렬된 리스트를 주면 그대로 사용
  const popular = useMemo(() => {
    const srcAllForPopular = Array.isArray(all) ? all : []
    const sorted = [...srcAllForPopular]
    return applyFilters(sorted)
  }, [all, filters])

  // 선택한 월의 팝업
  const monthly = useMemo(() => {
    const srcAllForMonthly = Array.isArray(all) ? all : []

    const filtered = srcAllForMonthly.filter((item) => {
      if (!item.startDate && !item.endDate) return false

      const selected = selectedMonth

      const start = item.startDate ? new Date(item.startDate) : null
      const end = item.endDate ? new Date(item.endDate) : null

      if (start && Number.isNaN(start.getTime())) return false
      if (end && Number.isNaN(end.getTime())) return false

      if (start && end) {
        const startMonth = start.getMonth() + 1
        const endMonth = end.getMonth() + 1
        return selected >= startMonth && selected <= endMonth
      }

      const baseDate = start ?? end
      if (!baseDate) return false
      const month = baseDate.getMonth() + 1
      return month === selected
    })

    return applyFilters(filtered)
  }, [all, filters, selectedMonth])

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
            ) : (
              // 홈 기본 모드: 3개 섹션
              <>
                <GridSection title="새로 들어온 팝업스토어" items={latest} />
                <GridSection title="인기 있는 팝업스토어" items={popular} />
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
