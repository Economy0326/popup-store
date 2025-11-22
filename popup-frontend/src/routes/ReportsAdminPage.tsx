import { useState } from 'react'
import { fetchReports, type ReportItem } from '../api/reports'

export default function ReportsAdminPage() {
  const [key, setKey] = useState('')
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLoad = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setReports([])

    if (!key.trim()) {
      setError('키를 입력해 주세요.')
      return
    }

    try {
      setLoading(true)
      const res = await fetchReports(key.trim())
      setReports(res.reports ?? [])
    } catch (err) {
      console.error(err)
      setError('제보 목록을 불러오지 못했습니다. 키를 다시 확인해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">제보 리스트 (운영자용)</h1>
        <p className="text-sm text-textMuted mb-4">
          운영자 전용 페이지입니다. 접근 키를 입력해 제보 목록을 확인할 수 있습니다.
        </p>

        <form onSubmit={handleLoad} className="flex flex-wrap gap-3 items-center mb-6">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="px-3 py-2 rounded-md border border-line bg-white text-sm flex-1 min-w-[180px]"
            placeholder="운영자 키"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? '불러오는 중...' : '제보 불러오기'}
          </button>
        </form>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <div className="bg-card border border-line rounded-xl2 overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-4 text-sm text-textMuted">
              제보 내역이 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-3 py-2 w-16">ID</th>
                  <th className="px-3 py-2">이름</th>
                  <th className="px-3 py-2">주소</th>
                  <th className="px-3 py-2">설명</th>
                  <th className="px-3 py-2 w-40">제보 시각</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-t border-line/60">
                    <td className="px-3 py-2 align-top">{r.id}</td>
                    <td className="px-3 py-2 align-top">{r.name}</td>
                    <td className="px-3 py-2 align-top">{r.address}</td>
                    <td className="px-3 py-2 align-top whitespace-pre-line">
                      {r.description}
                    </td>
                    <td className="px-3 py-2 align-top text-xs text-textMuted">
                      {new Date(r.reportedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}