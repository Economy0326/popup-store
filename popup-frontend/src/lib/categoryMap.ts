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

// 여러 개 카테고리 코드 → 한글 라벨 배열
export function getCategoryLabels(codes?: string[] | null): string[] {
  if (!codes || codes.length === 0) return []
  return codes.map((code) => CATEGORY_LABEL_MAP[code] ?? code)
}
