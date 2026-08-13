import DocsPage from "@/app/dashboard/docs/page"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"

export default function PublicDocsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-200">
      <Header />
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <DocsPage />
      </main>
      <Footer />
    </div>
  )
}
