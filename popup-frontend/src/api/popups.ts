import { api } from './client'
import type { PopupItem } from '../types/popup'
import { mapPopup, type RawPopup } from './mappers'

// 홈 화면 (최신/인기/월별)
export async function fetchHomePopups() {
  const res = await api<{
    latest: RawPopup[]
    popular: RawPopup[]
    monthly: RawPopup[]
  }>('/api/popups/home')

  return {
    latest: res.latest.map(mapPopup),
    popular: res.popular.map(mapPopup),
    monthly: res.monthly.map(mapPopup),
  } satisfies {
    latest: PopupItem[]
    popular: PopupItem[]
    monthly: PopupItem[]
  }
}

// 검색 / 필터
export async function searchPopups(params: {
  region?: string
  category?: string
  date?: string
  keyword?: string
  sort?: string
  page?: number
  pageSize?: number
}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, String(v))
    }
  })

  const res = await api<{
    items: RawPopup[]
    total: number
    page: number
    pageSize: number
  }>(`/api/popups?${query.toString()}`)

  return {
    ...res,
    items: res.items.map(mapPopup),
  } satisfies {
    items: PopupItem[]
    total: number
    page: number
    pageSize: number
  }
}

// 상세페이지
export async function fetchPopupDetail(id: number) {
  const raw = await api<RawPopup>(`/api/popups/${id}`)
  return mapPopup(raw)
}

// 비슷한 팝업
export async function fetchSimilarPopups(id: number) {
  const res = await api<{ items: RawPopup[] }>(`/api/popups/${id}/similar`)
  return { items: res.items.map(mapPopup) }
}

// 가까운 팝업
export async function fetchNearbyPopups(id: number) {
  const res = await api<{ items: RawPopup[] }>(`/api/popups/${id}/nearby`)
  return { items: res.items.map(mapPopup) }
}