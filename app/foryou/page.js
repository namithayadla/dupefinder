'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForYou() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('styleProfile')
    if (!saved) {
      router.push('/quiz')
      return
    }
    const p = JSON.parse(saved)
    setProfile(p)
    fetchFeed(p)
  }, [])

  async function fetchFeed(p) {
    setLoading(true)
    try {
      const res = await fetch('/api/foryou', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styles: p.style || [],
          categories: p.categories || [],
          colorSeason: p.colorSeason || 'Spring Bright',
          budget: p.budget?.[0] || 'budget_any',
          swipeTags: p.swipeProfile?.likedTags || [],
        })
      })
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filters = ['all', 'clothing', 'beauty', 'skincare', 'makeup']
  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter || p.tag === activeFilter)

  return (
    <main className="min-h-screen bg-black text-white px-4 pt-6 pb-24 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">curated for you</p>
        <h1 className="text-2xl font-bold">Your Feed</h1>
        {profile?.colorSeason && (
          <p className="text-zinc-500 text-xs mt-1">
            Based on your {profile.colorSeason} palette
          </p>
        )}
      </div>

      {/* Syft more button */}
      <Link
        href="/foryou/swipe"
        className="flex items-center gap-2 w-full border border-zinc-800 rounded-2xl px-4 py-3 mb-6 hover:border-zinc-600 transition group"
      >
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <p className="text-zinc-300 text-sm">Keep syfting to improve your feed</p>
        <span className="ml-auto text-zinc-600 group-hover:text-zinc-400 text-xs">→</span>
      </Link>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs border transition capitalize ${
              activeFilter === f
                ? 'bg-white text-black border-white'
                : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-zinc-900 rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-sm">No results for this filter</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="mt-3 text-white text-xs underline"
          >
            Show all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(product => (
            <ForYouCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </main>
  )
}

// ─────────────────────────────────────────────
// Feed Card Component
// ─────────────────────────────────────────────
function ForYouCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition group">

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 text-xs">No image</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => setWishlisted(w => !w)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? 'white' : 'none'}>
            <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
              stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Tag pill */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs bg-black/50 backdrop-blur-sm text-zinc-300 px-2 py-0.5 rounded-full capitalize">
            {product.tag}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-zinc-500 text-xs mb-0.5 truncate">{product.brand}</p>
        <p className="text-white text-xs font-medium leading-snug line-clamp-2 mb-2">
          {product.name}
        </p>

        {product.rating && (
          <p className="text-zinc-600 text-xs mb-2">★ {product.rating}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-white text-sm font-semibold">
            {product.price > 0 ? `$${product.price}` : '—'}
          </span>
          <div className="flex gap-1.5">
            {/* Find Dupe */}
            <Link
              href={`/results?q=${encodeURIComponent(product.name)}`}
              className="text-xs border border-zinc-700 text-zinc-400 px-2 py-1 rounded-lg hover:border-zinc-500 hover:text-white transition"
            >
              dupe
            </Link>
            {/* Shop */}
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white text-black font-medium px-2 py-1 rounded-lg hover:bg-zinc-200 transition"
            >
              shop
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}