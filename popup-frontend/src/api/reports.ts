import { api } from './client'

export type ReportPayload = {
  name: string
  address: string
  description: string
}

export type ReportItem = {
  id: number
  name: string
  address: string
  description: string
  reportedAt: string
}

// 제보 등록
export function createReport(payload: ReportPayload) {
  return api<{ ok: boolean }>('/api/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// 운영자용 제보 목록
export function fetchReports(key: string) {
  return api<{ reports: ReportItem[] }>(
    `/api/reports?key=${encodeURIComponent(key)}`
  )
}