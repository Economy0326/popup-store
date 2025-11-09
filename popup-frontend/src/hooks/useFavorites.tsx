import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type FavoritesContextValue = {
  favorites: string[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

const STORAGE_KEY = 'popupst:favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  // 초기 로드
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      }
    } catch (e) {
      console.error('load favorites failed', e)
    }
  }, [])

  // 변경 시 저장
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.error('save favorites failed', e)
    }
  }, [favorites])

  const isFavorite = (id: string) => favorites.includes(id)

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    )
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return ctx
}
