import { useEffect, useState } from 'react'
import { fetchMyReports, deleteMyReport, type ReportItem } from '../api/reports'
import { useAuth } from '../hooks/useAuth'
import { startNaverLogin } from '../api/auth'

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

  if (authLoading) {
    return (
      <div className="bg-bg min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-textMuted">로그인 상태를 확인하는 중입니다...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-bg min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-line rounded-2xl px-6 py-8 max-w-md text-center space-y-3 shadow-soft">
          <h1 className="text-xl font-semibold">내 제보 내역</h1>
          <p className="text-sm text-textMuted">
            로그인한 사용자만 본인의 제보 내역을 확인할 수 있습니다.
          </p>
          <button
            onClick={startNaverLogin}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#03C75A] text-white text-sm font-medium"
          >
            네이버 로그인
          </button>
        </div>
      </div>
    )
  }

  const handleDelete = async (report: ReportItem) => {
    if (report.answer) {
      alert('운영자 답변이 등록된 제보는 삭제할 수 없습니다.')
      return
    }
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
    <div className="bg-bg min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold mb-1">내 제보 내역</h1>
        <p className="text-xs text-textMuted mb-4">
          로그인한 계정으로 등록한 팝업 제보와 운영자 답변을 확인할 수 있습니다.
        </p>

        {loading && <p className="text-sm text-textMuted">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && reports.length === 0 && (
          <p className="text-sm text-textMuted">
            아직 등록한 제보가 없습니다.
          </p>
        )}

        <div className="space-y-3">
          {reports.map((r) => (
            <article
              key={r.id}
              className="bg-card border border-line rounded-xl2 p-4 text-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold">{r.name}</h2>
                <span className="text-[11px] text-textMuted">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-textMuted mb-2">{r.address}</p>

              <div className="mb-3">
                <div className="text-xs font-semibold mb-1">제보 내용</div>
                <p className="whitespace-pre-line">{r.description}</p>
              </div>

              <div className="border-t border-dashed border-line pt-2 mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">운영자 답변</span>
                  <button
                    onClick={() => handleDelete(r)}
                    disabled={!!r.answer || deletingId === r.id}
                    className="text-[11px] px-2 py-1 rounded-full border border-line text-textMuted hover:bg-slate-50 disabled:opacity-40"
                  >
                    {deletingId === r.id ? '삭제 중...' : '제보 삭제'}
                  </button>
                </div>
                {r.answer ? (
                  <p className="whitespace-pre-line">{r.answer}</p>
                ) : (
                  <p className="text-xs text-textMuted">
                    아직 운영자 답변이 등록되지 않았습니다.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
