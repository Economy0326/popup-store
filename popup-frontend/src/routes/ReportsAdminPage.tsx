import { useState } from 'react'
import {
  fetchReports,
  saveReportAnswer,
  type ReportItem,
} from '../api/reports'

export default function ReportsAdminPage() {
  const [key, setKey] = useState('')
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 각 제보별 임시 답변 입력값
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [savingId, setSavingId] = useState<number | null>(null)

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
      const list = res.reports ?? []
      setReports(list)

      // 서버에 이미 answer가 있으면 입력창에 기본값으로 채워두기
      const initial: Record<number, string> = {}
      list.forEach((r) => {
        if (r.answer) initial[r.id] = r.answer
      })
      setAnswers(initial)
    } catch (err) {
      console.error(err)
      setError('제보 목록을 불러오지 못했습니다. 키를 다시 확인해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeAnswer = (id: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSaveAnswer = async (report: ReportItem) => {
    const answer = (answers[report.id] ?? '').trim()
    if (!answer) {
      alert('답변 내용을 입력해 주세요.')
      return
    }

    try {
      setSavingId(report.id)
      await saveReportAnswer(report.id, key.trim(), answer)

      // UI에서도 바로 answer/answeredAt 반영
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? { ...r, answer, answeredAt: new Date().toISOString() }
            : r
        )
      )
    } catch (e) {
      console.error(e)
      alert('답변 저장에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="bg-bg min-h-[60vh]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">제보 관리 (운영자용)</h1>
        <p className="text-sm text-textMuted mb-4">
          운영자 전용 페이지입니다. 제보된 팝업 문의를 확인하고 답변을 남길 수 있습니다.
        </p>

        <form
          onSubmit={handleLoad}
          className="flex flex-wrap gap-3 items-center mb-6"
        >
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
            <table className="w-full text-xs sm:text-sm align-top">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-3 py-2 w-12">ID</th>
                  <th className="px-3 py-2">이름</th>
                  <th className="px-3 py-2">주소</th>
                  <th className="px-3 py-2">제보 내용</th>
                  <th className="px-3 py-2 w-72">운영자 답변</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-line/60 align-top"
                  >
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.address}</td>
                    <td className="px-3 py-2 whitespace-pre-line">
                      {r.description}
                      <div className="mt-1 text-[11px] text-textMuted">
                        {new Date(r.reportedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        className="w-full h-20 border border-line rounded-md px-2 py-1 text-xs"
                        value={answers[r.id] ?? ''}
                        onChange={(e) =>
                          handleChangeAnswer(r.id, e.target.value)
                        }
                        placeholder="해당 제보에 대한 답변을 입력해 주세요."
                      />
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-textMuted">
                          {r.answeredAt
                            ? `마지막 저장: ${new Date(
                                r.answeredAt
                              ).toLocaleString()}`
                            : '아직 답변 없음'}
                        </span>
                        <button
                          onClick={() => handleSaveAnswer(r)}
                          disabled={savingId === r.id}
                          className="ml-2 px-3 py-1 rounded-full bg-green-600 text-white text-[11px] hover:bg-green-700 disabled:opacity-60"
                        >
                          {savingId === r.id ? '저장 중...' : '답변 저장'}
                        </button>
                      </div>
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