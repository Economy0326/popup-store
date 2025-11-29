import { api } from './client'
import type { PopupItem } from '../types/popup'

// 홈 화면
export async function fetchHomePopups(params?: { month?: string }) {
  let path = '/api/popups/home'

  if (params?.month) {
    const qs = new URLSearchParams({ month: params.month })
    path += `?${qs.toString()}`
  }

  return api<{
    latest: PopupItem[]
    popular: PopupItem[]
    monthly: PopupItem[]
  }>(path)
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

  return api<{
    items: PopupItem[]
    total: number
    page: number
    pageSize: number
  }>(`/api/popups?${query.toString()}`)
}

// 상세페이지
export async function fetchPopupDetail(id: number) {
  return api<PopupItem>(`/api/popups/${id}`)
}

// 비슷한 팝업 (카테고리 기준)
export async function fetchSimilarPopups(id: number) {
  return api<{ items: PopupItem[] }>(`/api/popups/${id}/similar`)
}

// 가까운 팝업 (주변 지역 기준)
export async function fetchNearbyPopups(id: number) {
  return api<{ items: PopupItem[] }>(`/api/popups/${id}/nearby`)
}
