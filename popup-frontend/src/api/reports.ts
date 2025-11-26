import { api } from './client'
import { getOrCreateClientId } from '../lib/clientId'

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

  // 운영자 답변용
  answer?: string | null
  answeredAt?: string | null

  // 필요하면 운영자 쪽에서만 확인할 clientId
  clientId?: string | null
}

// 제보 등록 (유저용, 로그인/비로그인 공통)
export function createReport(payload: ReportPayload) {
  const clientId = getOrCreateClientId()

  return api<{ ok: boolean }>('/api/reports', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      clientId, // 백엔드 저장용
    }),
  })
}

// 운영자용 제보 목록 (모든 글 보기)
export function fetchReports(key: string) {
  return api<{ reports: ReportItem[] }>(
    `/api/reports?key=${encodeURIComponent(key)}`
  )
}

// 운영자용 답변 저장
export function saveReportAnswer(id: number, key: string, answer: string) {
  return api<{ ok: boolean }>(
    `/api/reports/${id}/answer?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      body: JSON.stringify({ answer }),
    }
  )
}

// 유저용: "내 제보만" 가져오기 (브라우저 clientId 기반)
export function fetchMyReports() {
  const clientId = getOrCreateClientId()
  if (!clientId) {
    return Promise.resolve({ reports: [] as ReportItem[] })
  }

  return api<{ reports: ReportItem[] }>(
    `/api/reports/mine?clientId=${encodeURIComponent(clientId)}`
  )
}