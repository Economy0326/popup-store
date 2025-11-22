import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, loading, login, logout } = useAuth()

  const displayName = user?.nickname ?? user?.email ?? '로그인 완료'

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        {/* 로고 */}
        <Link
          to="/"
          className="text-3xl font-bold text-blue-400 tracking-tight"
        >
          popupst
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center gap-20 text-md text-slate-700">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/favorites" className="hover:text-blue-600">
            Favorites
          </Link>
          <Link to="/register" className="hover:text-blue-600">
            Register
          </Link>
        </nav>

        {/* 오른쪽: 유저 영역 */}
        <div className="flex items-center gap-3">
          {/* 로그인 상태 표시 (닉네임/이메일) */}
          {!loading && user && (
            <span className="hidden sm:inline text-xs text-slate-600">
              {displayName}
            </span>
          )}

          {/* 데스크탑 로그인/로그아웃 버튼 */}
          {!loading && user ? (
            <button
              onClick={logout}
              className="hidden md:inline-flex px-4 py-1.5 rounded-full border border-blue-600 text-blue-800 text-sm hover:bg-blue-50 transition
                      focus:outline-none focus-visible:outline-none focus:ring-0"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={login}
              className="hidden md:inline-flex px-4 py-1.5 rounded-full border border-blue-600 bg-blue-600 text-white text-sm hover:bg-blue-500 transition
                      focus:outline-none focus-visible:outline-none focus:ring-0"
            >
              네이버로 로그인
            </button>
          )}

          {/* 모바일 토글 */}
          <button
            className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-slate-200"
            onClick={() => setOpen(v => !v)}
            aria-label="메뉴 열기"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-slate-800" />
              <span className="block h-0.5 w-5 bg-slate-800" />
              <span className="block h-0.5 w-5 bg-slate-800" />
            </div>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-6 text-md text-slate-800">
            <Link to="/" className="py-1" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link
              to="/favorites"
              className="py-1"
              onClick={() => setOpen(false)}
            >
              Favorites
            </Link>
            <Link
              to="/register"
              className="py-1"
              onClick={() => setOpen(false)}
            >
              Register
            </Link>

            {/* 모바일 로그인/로그아웃 버튼 */}
            {!loading && user ? (
              <button
                onClick={async () => {
                  await logout()
                  setOpen(false)
                }}
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false)
                  login()
                }}
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full border border-blue-600 bg-blue-600 text-white hover:bg-blue-500"
              >
                네이버로 로그인
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}