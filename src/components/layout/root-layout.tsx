import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
} 