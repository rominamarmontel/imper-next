import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NextAuthProvider from '@/components/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'impermanence films',
  description:
    'Basée à Paris depuis 2011, Impermanence Films est une structure œuvrant pour la production, la diffusion et la programmation du cinéma documentaire, privilégiant les regards à hauteur humaine et les films produits dans un contexte de liberté formelle. En soutien aux œuvres indépendantes, Impermanence Films mutualise et met à disposition des outils de production et de diffusion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <NextAuthProvider>
          <div className="lg:max-w-[900px] lg:px-16 mx-auto py-8 shadow-xl min-h-screen flex flex-col px-8">
            <Navbar />
            <div className="flex-auto">{children}</div>
            <Footer />
          </div>

          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  )
}
