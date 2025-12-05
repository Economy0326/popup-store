export default function Footer() {
  return (
    <footer className="border-t border-line mt-12 bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs md:text-sm text-textMuted">
        {/* 왼쪽 영역 */}
        <div className="space-y-1">
          <div className="font-semibold text-text">PopFitUp</div>
          <p>팝업스토어 탐색 서비스 (MVP)</p>
          <p>데이터 출처: 네이버 Local · 공식/언론/커뮤니티</p>
        </div>

        {/* 오른쪽 영역 */}
        <div className="space-y-1 md:text-right">
          <p>
            문의:{' '}
            <a
              href="mailto:popfitup1234@gmail.com"
              className="underline-offset-2 hover:underline text-text"
            >
              wjdrudwo0575@naver.com
            </a>
          </p>
          <p>
            이 서비스는 개인 프로젝트이며 상업적 목적으로 사용되지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  )
}
