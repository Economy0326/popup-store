const STORAGE_KEY = 'popfitup_report_client_id'

export function getOrCreateClientId() {
  if (typeof window === 'undefined') return '' // SSR 대비

  let id = window.localStorage.getItem(STORAGE_KEY)
  if (!id) {
    // 랜덤 ID 생성
    id = crypto.randomUUID()
    window.localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}