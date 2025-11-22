// 프론트에서 사용하는 통합 타입
export type PopupItem = {
  id: number

  name: string
  address: string

  lat: number
  lon: number

  startDate: string
  endDate: string

  description: string | null
  webSiteLink: string | null

  weeklyViewCount?: number | null
  favoriteCount?: number | null

  images: string[]      // 최소 1장 이상
  updated: string       // updated_at (백엔드에서 안 주면 ''로 fallback)

  isFavorited?: boolean | null

  // UI 편의용 파생 필드들
  title: string                    // name 그대로 복사
  thumbnail: string | null         // 대표 이미지 (images[0])
  region?: string | null           // 백엔드에서 내려준 region_label 사용
  category?: string | null         // 백엔드에서 한글로 내려준 카테고리
}
