import type { PopupItem } from './types'

export const mockPersonalized: PopupItem[] = [
  {
    id: 'p1',
    title: 'LE LABO 성수 팝업',
    brand: 'LE LABO',
    startDate: '2025-11-05',
    endDate: '2025-11-20',
    region: '서울/성동구',
    thumbnail: '/images/popup-fashion.jpg',
  },
  {
    id: 'p2',
    title: '무지 팝업 키친',
    brand: 'MUJI',
    startDate: '2025-11-02',
    endDate: '2025-11-18',
    region: '서울/강남구',
    thumbnail: '/images/popup-living.jpg',
  },
]

export const mockMonthly: PopupItem[] = [
  { id:'m1', title:'어텀 니트 마켓', startDate:'2025-11-01', endDate:'2025-11-10', region:'서울/마포구', lat:37.556, lon:126.923, category:'패션', thumbnail:'https://picsum.photos/seed/knit/600/400' },
  { id:'m2', title:'아트 박스 팝업', startDate:'2025-11-07', endDate:'2025-11-28', region:'부산/수영구', lat:35.163, lon:129.114, category:'아트', thumbnail:'https://picsum.photos/seed/art/600/400' },
  { id:'m3', title:'베이커리 위크', startDate:'2025-11-03', endDate:'2025-11-15', region:'서울/용산구', lat:37.53, lon:126.98, category:'푸드', thumbnail:'https://picsum.photos/seed/bake/600/400' },
]
