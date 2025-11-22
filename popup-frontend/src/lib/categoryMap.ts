export const CATEGORY_LABEL_MAP: Record<string, string> = {
  fashion: '패션',
  beauty: '뷰티',
  food: '식품/디저트',
  character: '캐릭터/굿즈',
  exhibition: '전시/아트',
  entertainment: '엔터테인먼트',
  lifestyle: '라이프스타일/리빙',
  theme_park: '테마파크/체험',
  animation: '애니메이션/만화',
  tech: 'IT/테크',
  culture: '문화/출판',
  sports: '스포츠/피트니스',
  etc: '기타',
} as const

export function getCategoryLabel(category?: string | null) {
  if (!category) return null
  return CATEGORY_LABEL_MAP[category] ?? category
}
