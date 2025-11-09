import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        {/* 로고 */}
        <a href="/" className="text-3xl font-bold text-blue-400 tracking-tight">
          popupst
        </a>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center gap-20 text-md text-slate-700">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/favorites" className="hover:text-blue-600">Favorites</a>
          <a href="/register" className="hover:text-blue-600">Register</a>
        </nav>

        {/* 로그인 버튼 */}
        <div className="flex items-center gap-3">
          <button className="hidden md:inline-flex px-4 py-1.5 rounded-full border border-blue-600 text-blue-800 text-sm hover:bg-blue-50 transition
                            focus:outline-none focus-visible:outline-none focus:ring-0"
          >

            Log in
          </button>

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
            <a href="/" className="py-1" onClick={() => setOpen(false)}>Home</a>
            <a href="/favorites" className="py-1" onClick={() => setOpen(false)}>Favorites</a>
            <a href="/register" className="py-1" onClick={() => setOpen(false)}>Register</a>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Log in
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
