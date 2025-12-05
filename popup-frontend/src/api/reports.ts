import { api } from './client'

export type ReportItem = {
  id: number
  userId: number
  name: string
  address: string
  description: string
  createdAt: string
  answer?: string | null
  answeredAt?: string | null
}

export type CreateReportPayload = {
  name: string
  address: string
  description: string
}

// 제보 등록 (로그인 필수, userId는 서버에서 세션으로 판단)
export function createReport(payload: CreateReportPayload) {
  return api<{ ok: boolean; id: number }>('/api/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// 내 제보 목록 (로그인 필수)
export function fetchMyReports() {
  return api<{ reports: ReportItem[] }>('/api/reports/mine')
}

// 운영자용 전체 제보 목록
export function fetchReports(key: string) {
  return api<{ reports: ReportItem[] }>(
    `/api/reports?key=${encodeURIComponent(key)}`
  )
}

// 운영자 답변 저장 (한 번만 허용 – 서버에서 강제)
export function saveReportAnswer(id: number, key: string, answer: string) {
  return api<{ ok: boolean }>(
    `/api/reports/${id}/answer?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      body: JSON.stringify({ answer }),
    }
  )
}

// 내 제보 삭제 (로그인 필수, 본인 것만 – 서버에서 체크)
export function deleteMyReport(id: number) {
  return api<{ ok: boolean }>(`/api/reports/${id}`, {
    method: 'DELETE',
  })
}

// 운영자 삭제
export function adminDeleteReport(id: number, key: string) {
  return api<{ ok: boolean }>(
    `/api/reports/${id}?key=${encodeURIComponent(key)}`,
    {
      method: 'DELETE',
    }
  )
}