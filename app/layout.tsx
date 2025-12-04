// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your swimming habits',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-indigo-600`}>
        <main className="flex items-center justify-center min-h-screen">
          <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}