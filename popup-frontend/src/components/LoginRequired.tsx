import { useAuth } from '../hooks/useAuth'

type Props = {
  title?: string
  description?: string
}

export default function LoginRequired({
  title = '로그인이 필요합니다',
  description = '해당 기능은 로그인한 사용자만 이용할 수 있어요.',
}: Props) {
  const { login } = useAuth()

  return (
    <div className="bg-bg min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-line rounded-2xl p-6 text-center shadow-soft">
        <h1 className="text-lg font-semibold mb-2">{title}</h1>
        <p className="text-sm text-textMuted mb-5 whitespace-pre-line">
          {description}
        </p>
        <button
          onClick={login}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#03C75A] text-white text-sm font-medium hover:brightness-105"
        >
          네이버로 로그인
        </button>
      </div>
    </div>
  )
}