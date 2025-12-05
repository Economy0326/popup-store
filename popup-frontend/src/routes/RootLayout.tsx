import { Outlet } from 'react-router-dom'
import Header from '../shared/Header'
import Footer from '../shared/Footer'
import { FavoritesProvider } from '../hooks/useFavorites'

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col bg-bg text-text">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </FavoritesProvider>
  )
}
