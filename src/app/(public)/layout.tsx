import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <Footer />
    </div>
  )
}
