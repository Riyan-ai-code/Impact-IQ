import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafbff] dark:bg-[#0a0e27] font-sans antialiased text-content-primary transition-colors duration-150">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
