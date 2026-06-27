import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030712] font-sans antialiased text-gray-200">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
