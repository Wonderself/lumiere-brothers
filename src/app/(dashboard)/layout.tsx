import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden bg-[#F8F9FA] p-4 pl-14 sm:p-6 sm:pl-14 lg:p-8 lg:pl-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
