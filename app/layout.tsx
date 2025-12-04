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
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}