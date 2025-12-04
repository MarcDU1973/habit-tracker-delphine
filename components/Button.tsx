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
                 bg-white/10 text-white backdrop-blur
                 ring-1 ring-white/30 hover:bg-white/20
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      {/* Optional Icon */}
      <span className="text-xl">🏊‍♂️</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}
