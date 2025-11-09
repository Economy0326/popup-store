export type PopupCategory =
  | '패션'
  | '리빙'
  | '푸드'
  | '아트'
  | '향수'
  | '기타'

export type PopupItem = {
  id: string

  // 기본 정보 (필수)
  title: string
  category: PopupCategory
  region: string          // '서울/성동구' 이런 형태
  startDate: string       // 'yyyy-mm-dd'
  endDate: string         // 'yyyy-mm-dd'

  // 부가 정보 (있으면 좋음)
  brand?: string
  description?: string
  address?: string
  lat?: number
  lon?: number
  thumbnail?: string
  isFavorited?: boolean
}
