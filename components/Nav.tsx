"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Startseite' },
    { href: '/habit', label: 'Habits' },
    { href: '/schwimmer', label: 'Schwimmer' },
  ];

  return (
    <nav className="bg-blue-700 p-4 flex flex-wrap gap-6 shadow-md justify-center">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 rounded transition ${
            pathname === link.href
              ? 'bg-white text-blue-700 font-bold'
              : 'hover:bg-blue-500'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
