export const API_BASE =
  import.meta.env.VITE_API_URL ?? 'https://api.popupst.com'

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // 세션/쿠키 기반 로그인
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(`API Error ${res.status}: ${message}`)
  }

  // 응답이 비어있을 수도 있기 때문에 체크
  const text = await res.text()
  return text ? JSON.parse(text) : (null as T)
}