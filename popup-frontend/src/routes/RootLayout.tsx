import { Outlet } from 'react-router-dom'
import Header from '../shared/Header'
import Footer from '../shared/Footer'

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
