import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ImpactIQ — Know what could break. Before it breaks.",
  description: "ImpactIQ is an AI-powered Engineering Intelligence Platform that reviews code changes, maps service dependencies, predicts blast radius, and flags security issues before deployment.",
  keywords: ["Engineering Intelligence", "Git Diff Parser", "Blast Radius Analysis", "Static Code Analysis", "Code Change Risk", "SaaS Dev Tools"],
  authors: [{ name: "ImpactIQ Team" }],
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
