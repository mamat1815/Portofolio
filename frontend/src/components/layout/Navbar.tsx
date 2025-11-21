'use client';

import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-zinc-900 hover:opacity-80 transition-opacity">
          <Terminal size={20} />
          <span>AFSAR.DEV</span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium text-zinc-500">
          <Link href="#projects" className="hover:text-zinc-900 transition-colors">
            Work
          </Link>
          <a href="mailto:hello@afsar.dev" className="hover:text-zinc-900 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}