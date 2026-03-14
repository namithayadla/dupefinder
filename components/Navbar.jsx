'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['900'] })
const syftFont = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['600'],
  style: ['italic'] 
})

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
            <Link href="/">
            <span className={`${inter.className} text-3xl font-black tracking-tight`}>syft</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
                <Link href="/foryou" className="hover:text-white transition">Made For You</Link>
                <Link href="/results?q=trending" className="hover:text-white transition">Trending</Link>
                <Link href="/wishlist" className="hover:text-white transition">Wishlist</Link>
                <Link href="/" className="hover:text-white transition">dupeIT</Link>
            </div>
            <Link href="/quiz" className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-200 transition">
            What's your vibe?
            </Link>
        </nav>
    )
}