import GridSection from '../components/GridSection'
import { mockPersonalized, mockMonthly } from '../lib/mock'
import type { PopupItem } from '../lib/types'

const all: PopupItem[] = [...mockPersonalized, ...mockMonthly]

// 임시: 일부를 즐겨찾기라고 가정
const favoriteIds = ['p1', 'm1', 'm3']
const favoriteItems = all.filter((it) => favoriteIds.includes(it.id))

export default function FavoritesPage() {
  return (
    <div className="bg-bg min-h-[60vh]">
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4">
        <h1 className="text-2xl font-semibold mb-2">내 즐겨찾기 팝업스토어</h1>
        <p className="text-sm text-textMuted">
          저장한 팝업스토어를 한 곳에서 확인하고, 지도로 연결할 수 있습니다.
        </p>
      </section>

      {favoriteItems.length > 0 ? (
        <GridSection title="즐겨찾기한 팝업" items={favoriteItems} />
      ) : (
        <section className="mx-auto max-w-6xl px-4 py-16 text-center text-textMuted text-sm">
          아직 즐겨찾기한 팝업이 없습니다.
        </section>
      )}
    </div>
  )
}
