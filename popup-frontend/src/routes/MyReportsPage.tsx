import { useEffect, useState } from 'react'
import { fetchMyReports, type ReportItem } from '../api/reports'

export default function MyReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
  }, [])

  return (
    <div className="bg-bg min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold mb-2">내 제보 내역</h1>
        <p className="text-xs text-textMuted mb-4">
          이 브라우저에서 남긴 제보와 운영자 답변만 표시됩니다.
        </p>

        {loading && <p className="text-sm text-textMuted">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && reports.length === 0 && (
          <p className="text-sm text-textMuted">
            아직 남긴 제보가 없습니다.
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
                  {new Date(r.reportedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-textMuted mb-2">{r.address}</p>

              <div className="mb-3">
                <div className="text-xs font-semibold mb-1">제보 내용</div>
                <p className="whitespace-pre-line">{r.description}</p>
              </div>

              <div className="border-t border-dashed border-line pt-2 mt-2">
                <div className="text-xs font-semibold mb-1">운영자 답변</div>
                {r.answer ? (
                  <p className="whitespace-pre-line">{r.answer}</p>
                ) : (
                  <p className="text-textMuted text-xs">
                    아직 답변이 등록되지 않았습니다.
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