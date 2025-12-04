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
    <html lang="de">
<body className="min-h-screen bg-gradient-to-br from-sky-200 via-sky-500 to-sky-700">
  {children}
  </body>
</html>
  )
}
