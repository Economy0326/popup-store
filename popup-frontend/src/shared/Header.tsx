import { useEffect, useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="w-10" />
        <div className="text-lg font-semibold tracking-tight select-none">popupst</div>

        {/* 우측 버튼: 열기/닫기 토글. 배경을 페이지 배경색(bg)로 - X만 보이는 느낌 */}
        <button
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="relative h-9 w-9 grid place-items-center rounded-xl2 border border-transparent bg-bg"
          title={open ? '닫기' : '메뉴'}
        >
          {/* 아이콘: 닫힘(햄버거) / 열림(X) */}
          <span
            className={`absolute block h-0.5 w-5 bg-text transition-all duration-300 ${
              open ? 'rotate-45' : '-translate-y-1.5'
            }`}
          />
          <span
            className={`absolute block h-0.5 w-5 bg-text transition-opacity duration-200 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute block h-0.5 w-5 bg-text transition-all duration-300 ${
              open ? '-rotate-45' : 'translate-y-1.5'
            }`}
          />
        </button>
      </div>

      {/* ▼ 오버레이: 콘텐츠를 밀지 않고 위에 겹쳐 뜸 (열릴 때만 렌더링) */}
      {open && <MenuOverlay onClose={() => setOpen(false)} />}
    </header>
  )
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      {/* 배경 딤 + 블러 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />

      {/* 가운데 세로 리스트 패널 (세로 스크롤 없이 한 화면에 적당히 보이도록 반응형 너비) */}
      <nav
        role="dialog"
        aria-label="메뉴"
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1/2 top-16 -translate-x-1/2 w-[min(92%,560px)] rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl animate-drop-in"
      >
        <ul className="p-3 grid gap-2">
          {/* 세로로 쭉 나오는 카드형 메뉴 (반응형 폰트/패딩) */}
          <MenuItem href="/" label="홈" desc="추천/월별 큐레이션" />
          <MenuItem href="/map" label="지도" desc="지도로 한눈에 보기" />
          <MenuItem href="/favorites" label="즐겨찾기" desc="내가 저장한 팝업" />
          <MenuItem href="/about" label="소개" desc="데이터/문의/가이드" />
        </ul>
      </nav>
    </div>
  )
}

function MenuItem({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <li>
      <a
        href={href}
        className="block rounded-xl2 border border-line bg-card/90 hover:bg-card transition p-4 sm:p-5"
      >
        <div className="flex items-center justify-between">
          <div className="font-medium text-base sm:text-lg">{label}</div>
          {/* 우측 화살표 아이콘 (시각적 힌트) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-60">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="text-xs sm:text-sm text-textMuted mt-1">{desc}</div>
      </a>
    </li>
  )
}
