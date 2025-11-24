import { useState, useMemo, useEffect } from 'react'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import MonthSelector from '../components/MonthSelector'
import type { PopupItem } from '../types/popup'

const MAX_NEW_DAYS = 7 // 최근 7일 이내만 "최신" 섹션에 표시

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const [all, setAll] = useState<PopupItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/popups')
        if (!res.ok) {
          throw new Error('팝업 목록을 불러오지 못했습니다.')
        }
        const data = await res.json()
        setAll(data.items)
        
      } catch (e: any) {
        setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPopups()
  }, [])

  const handleSearch = (next: SearchFilters) => {
    setFilters(next)
  }

  // 필터 적용 함수: items가 배열이 아닐 경우 안전하게 처리합니다.
  // (서버 응답이 예상과 달라 객체가 들어오는 경우에 대비)
  const applyFilters = (items: PopupItem[] | any): PopupItem[] => {
    if (!filters) return Array.isArray(items) ? items : []

    // items가 배열이 아닌 경우 빈 배열로 처리하여 .filter 호출 에러를 방지
    const src: PopupItem[] = Array.isArray(items) ? items : []

    return src.filter((item) => {
      const addressSource = item.address ?? item.region ?? ''

      // Location: "전체"가 아니면 address/region에 포함되는지
      const matchLocation =
        filters.location === '전체' ||
        (addressSource && addressSource.includes(filters.location))

      // Category: "전체"가 아니면 category 일치
      const matchCategory =
        filters.category === '전체' ||
        (item.category && item.category === filters.category)

      // Date: 선택된 날짜가 팝업 기간 사이에 있는지
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

    // all이 배열인지 확인하고 아니면 빈 배열로 대체
    const srcAll = Array.isArray(all) ? all : []

    const withinRange = srcAll.filter((item) => {
      if (!item.updated) return false
      const updated = new Date(item.updated)
      if (Number.isNaN(updated.getTime())) return false

      const diffMs = now.getTime() - updated.getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)

      // 미래 날짜는 제외, N일 이내만
      return diffDays >= 0 && diffDays <= MAX_NEW_DAYS
    })

    // updated 내림차순 정렬
    withinRange.sort((a, b) => {
      const aTime = a.updated ? new Date(a.updated).getTime() : 0
      const bTime = b.updated ? new Date(b.updated).getTime() : 0
      return bTime - aTime
    })

    return applyFilters(withinRange)
  }, [all, filters])

  // 인기: 나중에 favorite_count / weekly_view_count 기반으로 API 정렬 예정
  const popular = useMemo(() => {
    // 인기 목록도 all이 배열인지 확인
    const srcAllForPopular = Array.isArray(all) ? all : []
    const sorted = [...srcAllForPopular] // TODO: 백엔드에서 인기순 정렬된 리스트를 주면 그대로 사용
    return applyFilters(sorted)
  }, [all, filters])

  // 선택한 월의 팝업: startDate / endDate와 "월이 겹치는" 아이템만
  const monthly = useMemo(() => {
    const srcAllForMonthly = Array.isArray(all) ? all : []

    const filtered = srcAllForMonthly.filter((item) => {
      if (!item.startDate && !item.endDate) return false

      const selected = selectedMonth

      const start = item.startDate ? new Date(item.startDate) : null
      const end = item.endDate ? new Date(item.endDate) : null

      // 날짜 파싱 실패 방지
      if (start && Number.isNaN(start.getTime())) return false
      if (end && Number.isNaN(end.getTime())) return false

      // 둘 다 있으면 구간으로 판정
      if (start && end) {
        const startMonth = start.getMonth() + 1
        const endMonth = end.getMonth() + 1
        return selected >= startMonth && selected <= endMonth
      }

      // 하나만 있을 때는 해당 월이 같은지만 체크
      const baseDate = start ?? end
      if (!baseDate) return false
      const month = baseDate.getMonth() + 1
      return month === selected
    })

    return applyFilters(filtered)
  }, [all, filters, selectedMonth])

  return (
    <div className="bg-bg">
      <HeroSection onSearch={handleSearch} />

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
      </div>
    </div>
  )
}
