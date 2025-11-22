import { useState } from 'react'
import { createReport } from '../api/reports'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

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
    } catch (err) {
      console.error(err)
      setError('제보 등록 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">팝업스토어 제보하기</h1>
        <p className="text-sm text-textMuted mb-6">
          발견한 팝업스토어를 알려주세요. 검수 후 서비스에 반영됩니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-line rounded-xl2 p-5 shadow-soft">
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
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-xs text-green-600">
              제보가 등록되었습니다. 검수 후 서비스에 반영될 예정입니다. 감사합니다!
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? '전송 중...' : '제보 보내기'}
          </button>
        </form>
      </div>
    </div>
  )
}