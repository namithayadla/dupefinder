'use client'
import { useState, useRef, useEffect } from "react"
import {useRouter} from 'next/navigation'

export default function SwipePage() {
    const router = useRouter()
    const [cards, setCards] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [likes, setLikes] = useState([])
    const [dislikes, setDislikes] = useState([])
    const [animating, setAnimating] = useState(null)
    const [loading, setLoading] = useState(true)
    const dragStart = useRef(null)
    const [dragOffset, setDragOffset] = useState(0)

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('styleProfile') || '{}')
        fetchCards(profile, 0)
    }, [])

    useEffect(() => {
        if(cards.length > 0 && currentIndex >= cards.length - 3) {
            const profile = JSON.parse(localStorage.getItem('styleProfile') || '{}')
            fetchCards(profile, cards.length)
        }
    }, [currentIndex, cards.length])

    async function fetchCards(profile, offset) {
        try {
            const res = await fetch('/api/swipecards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    styles: profile.style || [],
                    categories: profile.categories || [],
                    colorSeason: profile.colorSeason || 'Spring Bright',
                    allSeasons: profile.allSeasons || [],
                    swipeTags: profile.swipeProfile?.likedTags || [],
                    dislikedTags: profile.swipeProfile?.dislikedTags || [],
                    offset
                })
            })
            const data = await res.json()
            setCards(prev => {
                const existingNames = new Set(prev.map(c => c.name))
                const newCards = (data.cards || []).filter(c => !existingNames.has(c.name))
                return [...prev, ...newCards]
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    const current = cards[currentIndex]
    const next = cards[currentIndex + 1]

    function handleSwipe(direction) {
        if(!current) {
            return
        }
        setAnimating(direction)
        setTimeout(() => {
            if(direction === 'right') {
                setLikes(prev => [...prev, current])
            } else if(direction === 'left'){
                setDislikes(prev => [...prev, current])
            } 
            setCurrentIndex(i => i + 1)
            setAnimating(null)
            setDragOffset(0)
            const existing = JSON.parse(localStorage.getItem('styleProfile') || '{}')
            const updatedLikes = direction === 'right'
                ? [...(existing.swipeProfile?.likedTags || []), ...(current.tags || [])]
                : existing.swipeProfile?.likedTags || []
            const updatedDislikes = direction === 'left'
                ? [...(existing.swipeProfile?.dislikedTags || []), ...(current.tags || [])]
                : existing.swipeProfile?.dislikedTags || []
            
            localStorage.setItem('styleProfile', JSON.stringify({
                ...existing,
                swipeProfile: {
                    ...existing.swipeProfile,
                    likedTags: updatedLikes,
                    dislikedTags: updatedDislikes,
                }
            }))
        }, 300)
    }
    function handleUndo() {
        if(currentIndex === 0) {
            return
        }
        const prev = cards[currentIndex - 1]
        setCurrentIndex(i => i - 1)
        setLikes(l => l.filter(c => c.id !== prev.id))
        setDislikes(d => d.filter(c => c.id !== prev.id))
    }
    function handleDragStart(e) {
        dragStart.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    }
    function handleDragMove(e) {
        if(dragStart.current === null) {
            return
        }
        const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
        setDragOffset(x - dragStart.current)
    }
    function handleDragEnd() {
        if (Math.abs(dragOffset) > 80) {
            handleSwipe(dragOffset > 0 ? 'right' : 'left')
        } else {
            setDragOffset(0)
        }
        dragStart.current = null
    }
    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <div className="w-72 h-96 bg-zinc-900 rounded-2xl animate-pulse mb-8" />
                <p className="text-zinc-600 text-xs tracking-widest">loading your feed</p>
            </main>
        )
    }

    if (!current) {
        return (
            <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
                <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">loading more</p>
                <div className="w-72 h-96 bg-zinc-900 rounded-2xl animate-pulse" />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 pt-8">
            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-8">syft your style</p>

            <div className="relative w-72 h-96 mb-0">
                {next && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden scale-95 opacity-60">
                        <img src={next.image} className="w-full h-full object-cover" />
                    </div>
                )}
                <div
                    className={`absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing ${
                        animating === 'right' ? 'translate-x-96 rotate-12 opacity-0 transition-all duration-300' :
                        animating === 'left' ? '-translate-x-96 -rotate-12 opacity-0 transition-all duration-300' : ''
                    } ${
                        dragOffset > 40 ? 'ring-2 ring-green-400/60 shadow-[0_0_30px_rgba(74,222,128,0.25)]' :
                        dragOffset < -40 ? 'ring-2 ring-red-400/40 shadow-[0_0_30px_rgba(248,113,113,0.15)]' :
                        'ring-1 ring-zinc-800'
                    }`}
                    style={{
                        transform: animating ? undefined : `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                        transition: animating ? undefined : dragOffset !== 0 ? 'none' : 'transform 0.2s ease'
                    }}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    <img src={current.image} className="w-full h-full object-cover" draggable={false} />

                    {dragOffset > 40 && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl bg-gradient-to-t from-green-500/20 to-transparent pointer-events-none" />
                    )}
                    {dragOffset < -40 && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl bg-gradient-to-t from-red-500/15 to-transparent pointer-events-none" />
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-zinc-400 text-xs mb-1 uppercase tracking-widest">{current.brand}</p>
                                <p className="text-white font-medium text-sm leading-snug">{current.label || current.name}</p>
                                <p className="text-zinc-300 text-xs mt-1">{current.price > 0 ? `$${current.price}` : ''}</p>
                            </div>
                            {current.url && (
                                <a
                                    href={current.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-full hover:bg-zinc-200 transition flex-shrink-0"
                                >
                                    Shop
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-32 h-px mx-auto mt-6 mb-3 rounded-full transition-all duration-300 ${
                dragOffset > 40 ? 'bg-green-400/60 shadow-sm shadow-green-400' :
                dragOffset < -40 ? 'bg-red-400/40 shadow-sm shadow-red-400' :
                'bg-zinc-800'
            }`} />

            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-5">
                {dragOffset > 40 ? 'save' : dragOffset < -40 ? 'skip' : 'swipe or tap'}
            </p>

            <div className="flex gap-8 items-center justify-center">
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all flex items-center justify-center"
                >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>
                <button
                    onClick={() => handleSwipe('right')}
                    className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all flex items-center justify-center"
                >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button
                    onClick={handleUndo}
                    disabled={currentIndex === 0}
                    className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 9H15C17.8 9 20 11.2 20 14C20 16.8 17.8 19 15 19H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            <button
                onClick={() => router.push('/foryou')}
                className="mt-6 text-zinc-700 text-xs hover:text-zinc-500 transition tracking-wide"
            >
                back to feed
            </button>
        </main>
    )
}