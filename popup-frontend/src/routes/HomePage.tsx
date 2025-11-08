import GridSection from '../components/GridSection'
import { mockPersonalized, mockMonthly } from '../lib/mock'

export default function HomePage() {
  return (
    <div>
      <GridSection title="사용자 맞춤형 팝업스토어 추천" items={mockPersonalized} />
      <GridSection title="11월 팝업스토어 추천" items={mockMonthly} />
    </div>
  )
}
