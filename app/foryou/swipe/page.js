'use client'
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

const SWIPE_CARDS = [
    { id: 1, category: 'clothing', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', label: 'Minimalist white set', tags: ['clean', 'minimal', 'quiet luxury'] },
    { id: 2, category: 'clothing', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', label: 'Oversized blazer', tags: ['quiet luxury', 'old money'] },
    { id: 3, category: 'beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', label: 'Dewy glass skin', tags: ['skincare', 'natural'] },
    { id: 4, category: 'clothing', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400', label: 'Bold color coord', tags: ['y2k', 'colorful', 'spring bright'] },
    { id: 5, category: 'clothing', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400', label: 'Earth tone layers', tags: ['autumn', 'boho', 'warm'] },
    { id: 6, category: 'beauty', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400', label: 'Bold lip, clean face', tags: ['makeup', 'minimal', 'classic'] },
    { id: 7, category: 'clothing', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', label: 'Streetwear casual', tags: ['street', 'casual', 'cool'] },
    { id: 8, category: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', label: 'Full glam makeup', tags: ['glam', 'bold', 'makeup'] },
]
export default function SwipePage() {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [likes, setLikes] = useState([])
    const [dislikes, setDislikes] = useState([])
    const [animating, setAnimating] = useState(null)
    const dragStart = useRef(null)
    const dragCurrent = useRef(null)
    const [dragOffset, setDragOffset] = useState(0)

    const current = SWIPE_CARDS[currentIndex]
    const next = SWIPE_CARDS[currentIndex + 1]
    const isDone = currentIndex >= SWIPE_CARDS.length

    function handleSwipe(direction) {
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
        }, 300)
    }
    function handleUndo() {
        if(currentIndex === 0) {
            return
        }
        setCurrentIndex(i => i - 1)
        const prev = SWIPE_CARDS[currentIndex - 1]
        setLikes(l => l.filter(c => c.id !== prev.id))
        setDislikes(d => d.dislikes(c => c.id !== prev.id))
    }
    function handleDragStart(e) {
        dragStart.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    }
    function handleDragMove(e) {
        if(dragStart.current === null) {
            return
        }
        const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
        dragCurrent.current = x
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
    function handleDone() {
        const swipeProfile = {
            likedTags: likes.flatMap(c => c.tags),
            dislikedTags: dislikes.flatMap(c => c.tags),
            likedCategories: likes.map(c => c.category),
        }
        const existing = JSON.parse(localStorage.getItem('styleProfile') || '{}')
        localStorage.setItem('styleProfile', JSON.stringify({
            ...existing,
            swipeProfile
        }))
        router.push('/foryou')
    }
    if(isDone) {
        return (
            <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
                <h2 className="text-3xl font-bold mb-2">Your taste is locked in</h2>
                <p className="text-zinc-400 text-sm mb-8 text-center">We liked {likes.length} things and skipped {dislikes.length}</p>
                <div className="flex gap-3 mb-10 flex-wrap justify-center">
                    {likes.map(item => (
                        <img
                            key={item.id}
                            src={item.image}
                            className="w-16 h-16 object-cover rounded-xl"
                        />
                    ))}
                </div>
                <button
                    onClick={handleDone}
                    className="bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-zinc-200 transition"
                >
                    See My Feed →
                </button>
            </main>
        )
    }
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8">
            <p className="text-zinc-500 text-xs mb-6">{currentIndex + 1} of {SWIPE_CARDS.length}</p>
            <p className="text-white font-semibold text-lg mb-4">Do you like this?</p>
            <div className="relative w-72 h-96 mb-0">
                {next && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden scale-95 opacity-60">
                        <img src={next.image} className="w-full h-full object-cover"/>
                    </div>
                )}
                <div
                    className={`absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing transition-transform ${
                        animating === 'right' ? 'translate-x-96 rotate-12 opacity-0' :
                        animating === 'left' ? '-translate-x-96 -rotate-12 opacity-0' : ''
                    }`}
                    style={{
                        transform: animating ? undefined : `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                        transition: animating ? 'all 0.3s ease' : dragOffset !== 0 ? 'none' : 'transform 0.2s ease'
                    }}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    <img src={current.image}  className="w-full h-full object-cover" draggable={false}/>
                    {dragOffset > 40 && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl bg-gradient-to-t from-green-500/20 to-transparent pointer-events-none" />
                    )}
                    {dragOffset < -40 && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl bg-gradient-to-t from-red-500/15 to-transparent pointer-events-none" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white font-medium text-sm">{current.label}</p>
                        <p className="text-zinc-400 text-xs mt-0.5 capitalize">{current.category}</p>
                    </div>
                </div>
                <div className={`w-32 h-px mx-auto mt-6 mb-5 rounded-full transition-all duration-300 ${
                    dragOffset > 40 ? 'bg-green-400/60 shadow-sm shadow-green-400' :
                    dragOffset < -40 ? 'bg-red-400/40 shadow-sm shadow-red-400' :
                    'bg-zinc-800'
                }`} />
                <p className="text-zinc-600 text-xs tracking-widest uppercase mb-5">
                    {dragOffset > 40 ? 'save' : dragOffset < -40 ? 'skip' : 'swipe or tap'}
                </p>
            </div>
            <div className="flex gap-8 items-center justify-center">
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all flex items-center justify-center"
                >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>
                <button
                    onClick={() => handleSwipe('right')}
                    className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all flex items-center justify-center"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button
                    onClick={handleUndo}
                    disabled={currentIndex === 0}
                    className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 9H15C17.8 9 20 11.2 20 14C20 16.8 17.8 19 15 19H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </main>
    )
}