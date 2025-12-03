// src/routes/FavoritesPage.tsx
import { useEffect, useMemo, useState } from 'react'
import GridSection from '../components/GridSection'
import FavoritesMap from '../components/FavoritesMap'
import type { PopupItem } from '../types/popup'
import { useAuth } from '../hooks/useAuth'
import LoginRequired from '../components/LoginRequired'
import { api } from '../api/client'

type FavoritesResponse = { items: PopupItem[] }

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()

  const [items, setItems] = useState<PopupItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 로그인된 경우에만 즐겨찾기 데이터 로딩
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await api<FavoritesResponse>('/api/users/me/favorites')
        setItems(res.items ?? [])
      } catch (e: any) {
        setError(e.message ?? '즐겨찾기 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [authLoading, user])

  const favoriteWithCoords = useMemo(
    () =>
      items.filter(
        (it) => typeof it.lat === 'number' && typeof it.lon === 'number'
      ),
    [items]
  )

  // 로그인 상태 확인 중
  if (authLoading) {
    return (
      <div className="bg-bg min-h-[60vh] flex items-center justify-center text-sm text-textMuted">
        로그인 상태를 확인하는 중입니다...
      </div>
    )
  }

  // 비로그인 → 공통 로그인 필요 컴포넌트 사용
  if (!user) {
    return (
      <LoginRequired
        title="로그인 후 즐겨찾기를 사용할 수 있어요"
        description={
          '찜한 팝업 목록은 로그인한 사용자에게만 제공됩니다.\n네이버 로그인을 통해 계속 진행해 주세요.'
        }
      />
    )
  }

  // 로그인 + 데이터 로딩 중
  if (loading) {
    return (
      <div className="bg-bg min-h-[60vh] flex flex-col items-center justify-center text-sm text-textMuted">
        즐겨찾기한 팝업을 불러오는 중입니다...
      </div>
    )
  }

  // 에러
  if (error) {
    return (
      <div className="bg-bg min-h-[60vh] flex flex-col items-center justify-center text-sm text-textMuted">
        <p>{error}</p>
      </div>
    )
  }

  // 정상 렌더
  return (
    <div className="bg-bg min-h-[60vh]">
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-4 space-y-2">
        <h1 className="text-2xl font-semibold">내 즐겨찾기 팝업스토어</h1>
        <p className="text-sm text-textMuted">
          즐겨찾기한 팝업스토어를 지도와 리스트로 확인하세요.
        </p>
      </section>

      {favoriteWithCoords.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 sm:px-8 pb-6">
          <FavoritesMap items={favoriteWithCoords} />
        </section>
      )}

      {items.length > 0 ? (
        <GridSection
          title="즐겨찾기한 팝업"
          items={items}
          variant="grid"
          pageSize={12}
        />
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-16 text-center text-textMuted text-sm">
          아직 즐겨찾기한 팝업이 없습니다.
          <br />
          메인 페이지에서 마음에 드는 팝업을 ♥ 아이콘으로 저장해 보세요.
        </section>
      )}
    </div>
  )
}
