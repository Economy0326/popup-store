import type { PopupItem } from '../types/popup'

// 백엔드가 실제로 내려주는 Raw 응답 타입 (snake_case)
export type RawPopup = {
  id: number
  name: string | null
  address: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  site_link: string | null
  mapx: number | null          // x → lon
  mapy: number | null          // y → lat
  images: string[] | null
  category: string | null       // 이미 한글로 매핑된 카테고리
  region_label: string | null   // 예: "서울시 강남구"

  weekly_view_count?: number | null
  favorite_count?: number | null
  is_favorited?: boolean | null

  // 나중에 백엔드에서 updated_at 내려줄 때 사용 (지금은 없어도 undefined로 들어올 수 있음)
  updated?: string | null
}

// RawPopup → PopupItem 변환
export function mapPopup(raw: RawPopup): PopupItem {
  const images = raw.images ?? []
  const thumbnail = images.length > 0 ? images[0] : null

  return {
    // 원본 필드 매핑 (null-safe하게 기본값 부여)
    id: raw.id,
    name: raw.name ?? '',
    address: raw.address ?? '',
    startDate: raw.start_date ?? '',
    endDate: raw.end_date ?? '',
    description: raw.description,
    webSiteLink: raw.site_link ?? null,
    lat: raw.mapy ?? 0,   // y → lat
    lon: raw.mapx ?? 0,   // x → lon
    images,
    category: raw.category,
    region: raw.region_label ?? raw.address ?? null,
    weeklyViewCount: raw.weekly_view_count ?? null,
    favoriteCount: raw.favorite_count ?? null,
    isFavorited: raw.is_favorited ?? null,
    updated: raw.updated ?? '',

    // UI 편의용 파생 필드
    title: raw.name ?? '',
    thumbnail,
  }
}
