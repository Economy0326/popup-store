import { useState } from 'react'
import {
  fetchReports,
  saveReportAnswer,
  adminDeleteReport,
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
  const [deletingId, setDeletingId] = useState<number | null>(null)

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
    if (report.answer) {
      alert('이미 답변이 등록된 제보입니다. 수정할 수 없습니다.')
      return
    }

    const answer = (answers[report.id] ?? '').trim()
    if (!answer) {
      alert('답변 내용을 입력해 주세요.')
      return
    }

    try {
      setSavingId(report.id)
      await saveReportAnswer(report.id, key.trim(), answer)

      // UI 업데이트
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? { ...r, answer, answeredAt: new Date().toISOString() }
            : r
        )
      )
    } catch (e) {
      console.error(e)
      alert('답변 저장에 실패했습니다.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDeleteAdmin = async (report: ReportItem) => {
    if (!confirm(`ID ${report.id} 제보를 삭제하시겠습니까?`)) return

    try {
      setDeletingId(report.id)
      await adminDeleteReport(report.id, key.trim())

      // UI에서 제거
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

        {/* 작은 화면에서 잘리지 않게 가로 스크롤 허용 */}
        <div className="bg-card border border-line rounded-xl2 overflow-x-auto">
          {reports.length === 0 ? (
            <div className="p-4 text-sm text-textMuted">
              제보 내역이 없습니다.
            </div>
          ) : (
            <table className="min-w-[860px] w-full text-xs sm:text-sm align-top">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-3 py-2 w-12">ID</th>
                  <th className="px-3 py-2">이름</th>
                  <th className="px-3 py-2">주소</th>
                  <th className="px-3 py-2">제보 내용</th>
                  <th className="px-3 py-2 w-[360px]">운영자 답변</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const isAnswered = !!r.answer
                  const isSaving = savingId === r.id
                  const isDeleting = deletingId === r.id

                  return (
                    <tr key={r.id} className="border-t border-line/60 align-top">
                      <td className="px-3 py-2">{r.id}</td>
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.address}</td>
                      <td className="px-3 py-2 whitespace-pre-line">
                        {r.description}
                        <div className="mt-1 text-[11px] text-textMuted">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* 답변 칸: textarea 위, 상태+버튼 아래(줄바꿈/안잘림) */}
                      <td className="px-3 py-2">
                        <textarea
                          className="w-full min-h-[84px] border border-line rounded-lg px-3 py-2 text-xs sm:text-sm
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          value={answers[r.id] ?? r.answer ?? ''}
                          onChange={(e) => handleChangeAnswer(r.id, e.target.value)}
                          placeholder="해당 제보에 대한 답변을 입력해 주세요."
                          disabled={isAnswered}
                        />

                        <div className="mt-2 flex flex-col gap-2">
                          <span className="text-[11px] text-textMuted">
                            {r.answeredAt
                              ? `답변 시간: ${new Date(r.answeredAt).toLocaleString()}`
                              : '아직 답변 없음'}
                          </span>

                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              onClick={() => handleSaveAnswer(r)}
                              disabled={isAnswered || isSaving}
                              className="px-3 py-1.5 rounded-full bg-green-600 text-white text-[11px] sm:text-xs
                                         hover:bg-green-700 disabled:opacity-60"
                            >
                              {isSaving ? '저장 중...' : '답변 저장'}
                            </button>

                            <button
                              onClick={() => handleDeleteAdmin(r)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 rounded-full bg-red-500 text-white text-[11px] sm:text-xs
                                         hover:bg-red-600 disabled:opacity-60"
                            >
                              {isDeleting ? '삭제 중...' : '삭제'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
