export type PopupItem = {
  id: string
  title: string
  brand?: string
  startDate?: string
  endDate?: string
  region?: string         // '서울/성동구' 등
  lat?: number
  lon?: number
  address?: string
  category?: string
  thumbnail?: string
  isFavorited?: boolean
}
