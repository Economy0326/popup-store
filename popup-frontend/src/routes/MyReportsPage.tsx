import { useEffect, useState } from 'react'
import {
  fetchMyReports,
  deleteMyReport,
  type ReportItem,
} from '../api/reports'
import { useAuth } from '../hooks/useAuth'
import LoginRequired from '../components/LoginRequired'

export default function MyReportsPage() {
  const { user, loading: authLoading } = useAuth()
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return

    const load = async () => {
      try {
        setLoading(true)
        const res = await fetchMyReports()
        setReports(res.reports ?? [])
      } catch (e) {
        console.error(e)
        setError('제보 내역을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  // 로그인 상태 확인 중
  if (authLoading) {
    return (
      <div className="bg-bg min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-textMuted">
          로그인 상태를 확인하는 중입니다...
        </p>
      </div>
    )
  }

  // 비로그인 → 공통 컴포넌트 사용
  if (!user) {
    return (
      <LoginRequired
        title="내 제보 내역은 로그인 후 확인할 수 있어요"
        description={
          '로그인한 계정으로 등록한 팝업 제보와\n운영자 답변을 한 곳에서 확인할 수 있습니다.'
        }
      />
    )
  }

  const handleDelete = async (report: ReportItem) => {
    if (!confirm('해당 제보를 삭제하시겠습니까?')) return

    try {
      setDeletingId(report.id)
      await deleteMyReport(report.id)
      setReports((prev) => prev.filter((r) => r.id !== report.id))
    } catch (e) {
      console.error(e)
      alert('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-[#FBFAF7] min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        {/* 상단 헤더 */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">내 제보 내역</h1>
          <p className="text-xs sm:text-sm text-textMuted">
            로그인한 계정으로 등록한 팝업 제보와 운영자 답변을 확인할 수 있습니다.
          </p>
        </header>

        {/* 로딩/에러/빈 상태 */}
        {loading && (
          <p className="text-sm text-textMuted mb-2">제보 내역을 불러오는 중입니다...</p>
        )}
        {error && (
          <p className="text-sm text-red-500 mb-2">{error}</p>
        )}
        {!loading && !error && reports.length === 0 && (
          <p className="text-sm text-textMuted">
            아직 등록한 제보가 없습니다.
          </p>
        )}

        {/* 제보 카드 리스트 */}
        <div className="mt-3 space-y-4">
          {reports.map((r) => (
            <article
              key={r.id}
              className="bg-white rounded-3xl border border-slate-200/70 shadow-sm px-5 sm:px-6 py-4 sm:py-5"
            >
              {/* 상단: 팝업 이름 + 날짜 */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    {r.name}
                  </h2>
                  {r.address && (
                    <p className="text-[11px] sm:text-xs text-textMuted mt-0.5">
                      {r.address}
                    </p>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs text-textMuted whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>

              {/* 구분선 */}
              <hr className="border-dashed border-line mb-3" />

              {/* 제보 내용 섹션 */}
              <section className="mb-3">
                <h3 className="text-[11px] font-semibold text-slate-500 mb-1">
                  제보 내용
                </h3>
                <p className="text-sm text-slate-800 whitespace-pre-line">
                  {r.description}
                </p>
              </section>

              {/* 운영자 답변 + 삭제 버튼 */}
              <section className="mt-1 rounded-2xl bg-slate-50 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-600">
                    운영자 답변
                  </span>
                  <button
                    onClick={() => handleDelete(r)}
                    disabled={deletingId === r.id}
                    className="text-[11px] px-3 py-1 rounded-full border border-slate-300 text-slate-500 hover:bg-white disabled:opacity-40"
                  >
                    {deletingId === r.id ? '삭제 중...' : '제보 삭제'}
                  </button>
                </div>

                {r.answer ? (
                  <p className="text-sm text-slate-800 whitespace-pre-line">
                    {r.answer}
                  </p>
                ) : (
                  <p className="text-[11px] text-textMuted">
                    아직 운영자 답변이 등록되지 않았습니다.
                  </p>
                )}
              </section>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
