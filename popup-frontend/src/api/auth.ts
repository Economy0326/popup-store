import { api, API_BASE } from './client'

// 백엔드에서 내려주는 유저 타입 (필요 최소 필드만)
export type User = {
  id: number
  email?: string | null
  nickname?: string | null
  profileImage?: string | null
}

// 현재 로그인 유저 정보
export async function fetchMe() {
  try {
    return await api<User | null>('/api/users/me')
  } catch (err) {
    // 보통 401(로그인 안 된 상태)일 때 여기로 들어옴 → null 처리
    return null
  }
}

// 로그아웃
export function logout() {
  return api<{ ok: boolean }>('/auth/logout', {
    method: 'POST',
  })
}

// 네이버 로그인 시작 (브라우저 리다이렉트)
export function startNaverLogin() {
  // 프론트와 API 도메인이 같다면 그냥 '/auth/naver'도 가능
  window.location.href = `${API_BASE}/auth/naver`
}