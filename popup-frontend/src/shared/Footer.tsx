export default function Footer() {
  return (
    <footer className="border-t border-line mt-8">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-textMuted grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="font-medium text-text">popupst</div>
          <p>팝업스토어 탐색 서비스 (MVP)</p>
          <p>데이터 출처: 네이버 Local + 공식/언론/커뮤니티</p>
        </div>
        <div className="sm:text-right">
          <p>문의: contact@popupst.example</p>
          <p>© {new Date().getFullYear()} popupst</p>
        </div>
      </div>
    </footer>
  )
}
