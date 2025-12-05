import { useEffect, useState, createContext, useContext } from 'react'
import { fetchMe, logout as apiLogout, startNaverLogin } from '../api/auth'
import type { User } from '../api/auth'

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMe()
      .then((me) => setUser(me))
      .finally(() => setLoading(false))
  }, [])

  const login = () => {
    // 바로 네이버 로그인 페이지로 이동
    startNaverLogin()
  }

  const logout = async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}