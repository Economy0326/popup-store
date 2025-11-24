import { useEffect, useMemo, useState } from 'react'
import GridSection from '../components/GridSection'
import FavoritesMap from '../components/FavoritesMap'
import type { PopupItem } from '../types/popup'

type MeResponse = {
  id: string
  email?: string
  nickname?: string
  favoritePopupIds?: string[]
}

export default function FavoritesPage() {
  const [all, setAll] = useState<PopupItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1) 팝업 전체 목록
        const popupsRes = await fetch('/api/popups')
        if (!popupsRes.ok) {
          throw new Error('팝업 목록을 불러오지 못했습니다.')
        }
        const popups: PopupItem[] = await popupsRes.json()
        setAll(popups)

        // 2) 내 정보 (즐겨찾기)
        const meRes = await fetch('/api/users/me', {
          credentials: 'include',
        })
        if (meRes.ok) {
          const me: MeResponse = await meRes.json()
          setFavorites(me.favoritePopupIds ?? [])
        } else {
          setFavorites([])
        }
      } catch (e: any) {
        setError(e.message ?? '알 수 없는 에러가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 여기서 it.id를 문자열로 변환해서 비교
  // all이 배열이 아닐 수 있으므로 안전하게 처리
  const favoriteItems = useMemo(
    () => {
      const srcAll = Array.isArray(all) ? all : []
      return srcAll.filter((it) => favorites.includes(String(it.id)))
    },
    [all, favorites]
  )

  // favoriteItems가 배열이 아닐 가능성에 대비
  const favoriteWithCoords = useMemo(() => {
    const src = Array.isArray(favoriteItems) ? favoriteItems : []
    return src.filter(
      (it) => typeof it.lat === 'number' && typeof it.lon === 'number'
    )
  }, [favoriteItems])

  if (loading) {
    return (
      <div className="bg-bg min-h-[60vh] flex flex-col items-center justify-center text-sm text-textMuted">
        즐겨찾기한 팝업을 불러오는 중입니다...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-bg min-h-[60vh] flex flex-col items-center justify-center text-sm text-textMuted">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-[60vh]">
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 space-y-2">
        <h1 className="text-2xl font-semibold">내 즐겨찾기 팝업스토어</h1>
        <p className="text-sm text-textMuted">
          즐겨찾기한 팝업스토어를 지도와 리스트로 한 번에 확인하세요.
        </p>
      </section>

      {favoriteWithCoords.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-6">
          <FavoritesMap items={favoriteWithCoords} />
        </section>
      )}

      {favoriteItems.length > 0 ? (
        <GridSection
          title="즐겨찾기한 팝업"
          items={favoriteItems}
          variant="grid"
          pageSize={12}
        />
      ) : (
        <section className="mx-auto max-w-6xl px-4 py-16 text-center text-textMuted text-sm">
          아직 즐겨찾기한 팝업이 없습니다.
          <br />
          메인 페이지에서 마음에 드는 팝업을 ♥ 아이콘으로 저장해 보세요.
        </section>
      )}
    </div>
  )
}