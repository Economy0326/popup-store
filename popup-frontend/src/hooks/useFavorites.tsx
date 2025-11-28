import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchMyFavorites,
  addFavorite,
  removeFavorite,
} from '../api/favorites'
import { useAuth } from './useAuth'

// string이든 number든 둘 다 받을 수 있게
export type IdLike = string | number

type FavoritesContextValue = {
  loading: boolean
  favoriteIds: number[]
  isFavorite: (id: IdLike) => boolean
  toggleFavorite: (id: IdLike) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
)

// 공통 변환 함수: string이면 Number(), 이미 number면 그대로
const toNumber = (id: IdLike): number =>
  typeof id === 'string' ? Number(id) : id

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // 로그인 상태
  const { user, loading: authLoading} = useAuth()

  // 초기 로딩: 로그인된 경우에만 즐겨찾기 요청
  useEffect(() => {
    if (authLoading) return

    // 비로그인 → 즐겨찾기 비워두고 끝
    if (!user) {
      setFavoriteIds([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetchMyFavorites()
      .then((res) => {
        const ids = res.items?.map((i) => Number(i.id)) ?? []
        setFavoriteIds(ids)
      })
      .finally(() => setLoading(false))
  }, [user, authLoading])

  const isFavorite = (id: IdLike) => favoriteIds.includes(toNumber(id))

  const toggleFavorite = async (id: IdLike) => {
    const numId = toNumber(id)

    // 비로그인 → 로그인 안내 후 종료
    if (!user) {
      alert('로그인 후 즐겨찾기를 사용할 수 있어요.')
      return
    }

    if (favoriteIds.includes(numId)) {
      await removeFavorite(numId)
      setFavoriteIds((prev) => prev.filter((x) => x !== numId))
    } else {
      await addFavorite(numId)
      setFavoriteIds((prev) => [...prev, numId])
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ loading, favoriteIds, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites는 FavoritesProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}