export type PopupItem = {
  id: number
  name: string
  address: string
  lat: number        // mapy → 위도 또는 변환된 값
  lon: number        // mapx → 경도
  startDate: string  // 'YYYY-MM-DD'
  endDate: string
  description?: string
  webSiteLink?: string
  weeklyViewCount?: number
  favoriteCount?: number
  images: string[]   // 이미지 URL 배열
  updated?: string   // 크롤링 기준 최신 업데이트 시간

  // 하나의 팝업에 여러 카테고리 코드가 올 수 있음
  // 예: ['fashion', 'beauty']
  categories?: string[]

  // 주소에서 전처리된 지역 라벨
  // 예: '서울 성동구', '경기도 안성시'
  regionLabel?: string

  //로그인 유저 기준 즐겨찾기 여부
  isFavorited?: boolean

  // 프론트(UI)에서만 쓰는 파생 필드
  title?: string              // 기본적으로 name을 복사해서 사용
  thumbnail?: string | null   // images[0]를 편하게 쓰려고
}
