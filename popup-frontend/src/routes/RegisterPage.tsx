import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    host: '',
    address: '',
    region: '',
    category: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    description: '',
  })

  const onChange = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('popup submit', form)
    alert('제보가 제출되었다고 가정하는 상태입니다 (MVP).')
  }

  return (
    <div className="bg-bg min-h-[60vh]">
      <section className="mx-auto max-w-3xl px-4 pt-10 pb-4">
        <h1 className="text-2xl font-semibold mb-2">팝업스토어 제보 / 등록</h1>
        <p className="text-sm text-textMuted">
          실제 운영 중이거나 예정된 팝업스토어 정보를 입력해 주세요. 검토 후 서비스에 반영됩니다.
        </p>
      </section>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-3xl px-4 pb-12 space-y-4"
      >
        <Input
          label="팝업 이름"
          required
          value={form.name}
          onChange={(v) => onChange('name', v)}
        />
        <Input
          label="주최/브랜드"
          value={form.host}
          onChange={(v) => onChange('host', v)}
        />
        <Input
          label="주소"
          required
          value={form.address}
          onChange={(v) => onChange('address', v)}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="지역 (예: 서울/성동구)"
            value={form.region}
            onChange={(v) => onChange('region', v)}
          />
          <Input
            label="카테고리 (패션, 리빙 등)"
            value={form.category}
            onChange={(v) => onChange('category', v)}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="시작일"
            type="date"
            required
            value={form.startDate}
            onChange={(v) => onChange('startDate', v)}
          />
          <Input
            label="종료일"
            type="date"
            required
            value={form.endDate}
            onChange={(v) => onChange('endDate', v)}
          />
        </div>
        <Input
          label="대표 이미지 URL (임시)"
          placeholder="S3 또는 이미지 주소"
          value={form.imageUrl}
          onChange={(v) => onChange('imageUrl', v)}
        />
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            설명
          </label>
          <textarea
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-soft hover:bg-blue-700 transition"
        >
          제보 보내기
        </button>
      </form>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full h-10 rounded-lg border border-line px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  )
}
