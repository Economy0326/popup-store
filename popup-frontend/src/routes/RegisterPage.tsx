import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createReport, fetchMyReports } from '../api/reports'
import { useAuth } from '../hooks/useAuth'
import LoginRequired from '../components/LoginRequired'

const MAX_REPORTS = 3

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [myCount, setMyCount] = useState<number | null>(null)
  const limitReached = myCount !== null && myCount >= MAX_REPORTS

  // 내 제보 개수 로딩 (로그인 된 경우에만)
  useEffect(() => {
    if (!user) return

    const load = async () => {
      try {
        const res = await fetchMyReports()
        setMyCount(res.reports?.length ?? 0)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (limitReached) {
      setError(`제보는 최대 ${MAX_REPORTS}개까지만 등록할 수 있습니다.`)
      return
    }

    if (!name.trim() || !address.trim()) {
      setError('이름과 주소는 반드시 입력해 주세요.')
      return
    }

    try {
      setLoading(true)
      await createReport({ name, address, description })
      setSuccess(true)
      setName('')
      setAddress('')
      setDescription('')

      setMyCount((prev) => (prev ?? 0) + 1)
    } catch (err: any) {
      console.error(err)
      // 백엔드에서 limit 에러를 줄 수도 있으니 메시지를 이렇게 고정해도 무방
      setError('제보 등록에 실패했습니다. 제보는 최대 3개까지만 가능합니다.')
    } finally {
      setLoading(false)
    }
  }

  // 로그인 상태 로딩 중
  if (authLoading) {
    return (
      <div className="bg-bg min-h-[60vh] flex items-center justify-center text-sm text-textMuted">
        로그인 상태를 확인하는 중입니다...
      </div>
    )
  }

  // 비로그인 → 공통 컴포넌트 사용
  if (!user) {
    return (
      <LoginRequired
        title="로그인 후 제보할 수 있어요"
        description={
          '팝업 제보는 악성 이용 방지를 위해\n로그인한 사용자만 가능합니다.'
        }
      />
    )
  }

  // 로그인된 상태
  return (
    <div className="bg-bg min-h-[60vh]">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
          {/* 왼쪽 설명 */}
          <section className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-text">
              팝업스토어 제보하기
            </h1>
            <p className="text-sm md:text-base text-textMuted leading-relaxed">
              발견한 팝업스토어를 알려주시면 검수 후 서비스에 반영됩니다.
            </p>
            <ul className="mt-4 text-xs md:text-sm text-textMuted space-y-1 list-disc list-inside">
              <li>실제 운영 중이거나 예정된 팝업만 제보해 주세요.</li>
              <li>운영팀 검수 후 노출 여부와 위치가 결정됩니다.</li>
              <li>한 계정당 최대 {MAX_REPORTS}개까지 제보할 수 있습니다.</li>
            </ul>
          </section>

          {/* 오른쪽: 내 제보 보기 + 폼 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[11px] text-textMuted">
              <span>
                현재 내 계정으로 등록한 제보:{' '}
                {myCount === null ? '-' : `${myCount}개 / 최대 ${MAX_REPORTS}개`}
              </span>
              <Link
                to="/my/reports"
                className="px-3 py-1.5 rounded-full border border-line hover:bg-slate-50"
              >
                내 제보 보기
              </Link>
            </div>

            {limitReached && (
              <p className="text-xs text-red-500">
                제보는 한 계정당 최대 {MAX_REPORTS}개까지 등록 가능합니다.
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-card border border-line rounded-2xl p-5 md:p-6 shadow-soft"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  팝업 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-line bg-white text-sm"
                  placeholder="예: 강남 라이프스타일 팝업"
                  disabled={limitReached || loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-line bg-white text-sm"
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                  disabled={limitReached || loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  간단한 설명 (선택)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-line bg-white text-sm min-h-[100px]"
                  placeholder="행사 기간, 브랜드, 특징 등을 자유롭게 적어주세요."
                  disabled={limitReached || loading}
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              {success && (
                <p className="text-xs text-green-600">
                  제보가 등록되었습니다. 검수 후 답변이 남겨지면{' '}
                  <Link
                    to="/my/reports"
                    className="underline underline-offset-2"
                  >
                    내 제보 내역
                  </Link>
                  에서 확인할 수 있어요.
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || limitReached}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? '전송 중...' : '제보 보내기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
