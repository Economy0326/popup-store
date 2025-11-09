import { useState } from 'react'
import HeroSection, { type SearchFilters } from '../components/HeroSection'
import GridSection from '../components/GridSection'
import { mockPersonalized, mockMonthly } from '../lib/mock'
import type { PopupItem } from '../lib/types'

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters | null>(null)

  const handleSearch = (next: SearchFilters) => {
    setFilters(next)
  }

  const applyFilters = (items: PopupItem[]): PopupItem[] => {
    if (!filters) return items

    return items.filter((item) => {
      // Location: "전체"가 아니면 region 문자열에 포함되는지
      const matchLocation =
        filters.location === '전체' ||
        (item.region && item.region.includes(filters.location))

      // Category: "전체"가 아니면 category 일치
      const matchCategory =
        filters.category === '전체' ||
        (item.category && item.category === filters.category)

      // Date: 선택된 날짜가 팝업 기간 사이에 있는지 (대략 체크)
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

  const personalized = applyFilters(mockPersonalized)
  const monthly = applyFilters(mockMonthly)
  const popular = applyFilters([...mockMonthly, ...mockPersonalized])

  return (
    <div className="bg-bg">
      <HeroSection onSearch={handleSearch} />

      <div className="mt-10 space-y-6">
        <GridSection title="사용자 맞춤형 팝업스토어 추천" items={personalized} />
        <GridSection title="11월 팝업스토어 추천" items={monthly} />
        <GridSection title="인기 많은 팝업스토어" items={popular} />
      </div>
    </div>
  )
}
