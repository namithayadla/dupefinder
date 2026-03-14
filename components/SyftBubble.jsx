'use client'
import { usePathname } from "next/navigation"
import Link from 'next/link'

export default function SyftBubble() {
    const pathname = usePathname()
    if (pathname.includes('/swipe') || pathname.includes('/quiz')) {
        return null
    }
    return (
        <Link
            href="/foryou/swipe"
            className="fixed bottom-6 right-6 z-50 group"
        >
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-400 transition-all duration-300 rounded-full px-4 py-3 shadow-xl shadow-black/50">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"/>
                <span className="text-white text-xs font-medium tracking-wide">syft</span>
            </div>
        </Link>
    )
}