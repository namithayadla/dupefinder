'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'], weight: ['900'] })

export default function NavBar() {
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profile, setProfile] = useState(null)
    useEffect(() => {
        const saved = localStorage.getItem('styleProfile')
        if(saved) {
            setProfile(JSON.parse(saved))
        }
    }, [])
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
            <Link href="/">
            <span className={`${inter.className} text-3xl font-black tracking-tight`}>syft</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
                <Link href="/dupes" className="hover:text-white transition">dupeIT</Link>
                <Link href="/foryou" className="hover:text-white transition">For You</Link>
                <Link href="/shade-translator" className="hover:text-white transition">Shade Match</Link>
                <Link href="/trending" className="hover:text-white transition">Trending</Link>
            </div>
            {profile ? (
            <Link href="/profile" className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-200 transition">
                My Profile
            </Link>
            ) : (
            <Link href="/quiz" className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-200 transition">
                Get Started
            </Link>
            )}
        </nav>
    )
}