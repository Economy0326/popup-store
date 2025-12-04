import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, loading, login, logout } = useAuth()

  const displayName = user?.nickname ?? '로그인 완료'

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        {/* 로고 */}
        <Link
          to="/"
          className="flex items-center gap-1 text-2xl md:text-3xl font-extrabold tracking-tight"
        >
          <span className="text-slate-500">Pop</span>
          <span className="text-blue-500">Fit</span>
          <span className="text-slate-500">Up</span>
        </Link>

        {/* 오른쪽: 아이콘 + 로그인 영역 */}
        <div className="flex items-center gap-2">
          {/* 데스크탑: 찜 아이콘 */}
          <Link
            to="/favorites"
            aria-label="찜한 팝업"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 transition text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21s-5-3.33-8-6.67C2 12.5 2 9.5 4 7.5 5 6.5 6.5 6 7.9 6 9.3 6 10.7 6.7 12 8c1.3-1.3 2.7-2 4.1-2 1.4 0 2.9.5 3.9 1.5 2 2 2 5 0 6.83C17 17.67 12 21 12 21z" />
            </svg>
          </Link>

          {/* 데스크탑: 제보하기 아이콘 */}
          <Link
            to="/register"
            aria-label="팝업 제보하기"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 transition text-yellow-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </Link>

          {/* 로그인 상태 표시 (닉네임/이메일) */}
          {!loading && user && (
            <span className="hidden sm:inline text-xs text-slate-600 mr-1">
              {displayName}
            </span>
          )}

          {/* 데스크탑 로그인/로그아웃 버튼 – 네이버 이미지 사용 */}
          {!loading && user ? (
            <button
              onClick={logout}
              className="hidden md:inline-flex items-center justify-center"
              aria-label="네이버로 로그아웃"
            >
              <img
                src="/images/naver-logout.png"
                alt="네이버 로그아웃"
                className="h-8 w-auto"
              />
            </button>
          ) : (
            <button
              onClick={login}
              className="hidden md:inline-flex items-center justify-center"
              aria-label="네이버로 로그인"
            >
              <img
                src="/images/naver-login.png"
                alt="네이버로 로그인"
                className="h-8 w-auto"
              />
            </button>
          )}

          {/* 모바일 토글 버튼 */}
          <button
            className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-slate-200"
            onClick={() => setOpen((v) => !v)}
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
              홈
            </Link>
            <Link
              to="/favorites"
              className="py-1"
              onClick={() => setOpen(false)}
            >
              찜한 팝업
            </Link>
            <Link
              to="/register"
              className="py-1"
              onClick={() => setOpen(false)}
            >
              팝업 제보하기
            </Link>

            {/* 모바일 로그인/로그아웃 버튼 – 네이버 이미지 사용 */}
            {!loading && user ? (
              <button
                onClick={async () => {
                  await logout()
                  setOpen(false)
                }}
                className="mt-2 inline-flex items-center justify-start"
                aria-label="네이버로 로그아웃"
              >
                <img
                  src="/images/naver-logout.png"
                  alt="네이버 로그아웃"
                  className="h-8 w-auto"
                />
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false)
                  login()
                }}
                className="mt-2 inline-flex items-center justify-start"
                aria-label="네이버로 로그인"
              >
                <img
                  src="/images/naver-login.png"
                  alt="네이버로 로그인"
                  className="h-8 w-auto"
                />
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
