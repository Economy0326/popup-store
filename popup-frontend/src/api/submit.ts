export function submitPopup(data: {
  name: string
  address: string
  startDate: string
  endDate: string
  description?: string
  webSiteLink?: string
  images?: File[]
}) {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'images' && Array.isArray(value)) {
      value.forEach((file) => formData.append('images', file))
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as string)
    }
  })

  return fetch('/api/submit-popup', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error('등록 실패')
    return res.json()
  })
}
