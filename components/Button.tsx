// components/Button.tsx
import Link from 'next/link'

type Props = {
  href: string
  children: React.ReactNode
}

export default function Button({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-5 py-3
                 bg-cyan-500 text-white font-medium
                 hover:bg-cyan-600 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-md"
    >
      {children}
    </Link>
  )
}