'use client'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['900'] })

const SEASON_PALETTES = {
  'Spring': {
    colors: ['#FADADD', '#F4A460', '#FFD700', '#FFA07A', '#FFFACD', '#FF7F50'],
    labels: ['peach', 'camel', 'gold', 'coral', 'ivory', 'warm red'],
    description: 'Warm, light & clear'
  },
  'Summer': {
    colors: ['#E6E6FA', '#DDA0DD', '#B0C4DE', '#FFB6C1', '#D8BFD8', '#C0C0C0'],
    labels: ['lavender', 'mauve', 'powder blue', 'rose', 'thistle', 'grey'],
    description: 'Cool, light & soft'
  },
  'Autumn': {
    colors: ['#8B4513', '#556B2F', '#D2691E', '#B8860B', '#A0522D', '#6B8E23'],
    labels: ['rust', 'olive', 'burnt orange', 'mustard', 'caramel', 'forest'],
    description: 'Warm, deep & muted'
  },
  'Winter': {
    colors: ['#DC143C', '#4169E1', '#50C878', '#000000', '#FF69B4', '#4B0082'],
    labels: ['true red', 'royal blue', 'emerald', 'black', 'hot pink', 'plum'],
    description: 'Cool, deep & clear'
  }
}

export default function SyftLanding() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [dragging, setDragging] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [hoveredSeason, setHoveredSeason] = useState(null)
  const [visible, setVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('styleProfile')
    if(saved) {
      setProfile(JSON.parse(saved))
    }
    setTimeout(() => setVisible(true), 100)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if(!url.trim()) return
    router.push(`/results?q=${encodeURIComponent(url)}`)
  }
  async function processPhoto(file) {
    if(!file) return
    setPhotoLoading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1]
      try {
        const res = await fetch('/api/vision', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({imageBase64: base64})
        })
        const data = await res.json()
        if(data.query) {
          router.push(`/results?q=${encodeURIComponent(data.query)}`)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setPhotoLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }
  function handlePhoto(e) {
    processPhoto(e.target.files[0])
  }
  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    processPhoto(e.dataTransfer.files[0])
  }
  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
 
      {/* Subtle grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
      />
 
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
 
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #c8a87a 0%, transparent 70%)' }}
        />
 
        {/* Season indicator — shows if profile exists */}
        {profile?.colorSeason && (
          <div className={`mb-8 flex items-center gap-3 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex gap-1">
              {(SEASON_PALETTES[profile.colorSeason.split(' ')[0]]?.colors || []).slice(0, 4).map((hex, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: hex }} />
              ))}
            </div>
            <span className="text-zinc-500 text-xs tracking-widest uppercase">{profile.colorSeason}</span>
          </div>
        )}
 
        {/* Wordmark */}
        <div className={`text-center mb-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '-0.02em' }}
            className={`${inter.className} text-9xl font-black tracking-tight`}>
            syft
          </h1>
        </div>
 
        {/* Tagline */}
        <div className={`text-center mb-12 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-zinc-400 text-lg font-light tracking-wide max-w-md">
            {profile?.colorSeason
              ? `Your ${profile.colorSeason} palette. Your style. Your dupes.`
              : 'Shop smarter. Find your colors. Own your style.'
            }
          </p>
        </div>
 
        {/* Search */}
        <div className={`w-full max-w-2xl mb-4 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Search a product or paste a URL..."
                className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition text-sm backdrop-blur-sm"
              />
              <button
                type="submit"
                className="bg-white text-black font-semibold px-6 py-4 rounded-2xl hover:bg-zinc-100 transition text-sm whitespace-nowrap"
              >
                Find Dupes
              </button>
            </div>
          </form>
        </div>
 
        {/* Photo Upload */}
        <div className={`w-full max-w-2xl mb-10 transition-all duration-700 delay-[400ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !photoLoading && document.getElementById('photoInput').click()}
            className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragging ? 'border-zinc-500 bg-zinc-800/50' :
              photoLoading ? 'border-zinc-700 bg-zinc-900/50' :
              'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30'
            }`}
          >
            {photoLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border border-zinc-600 border-t-white rounded-full animate-spin" />
                <p className="text-zinc-400 text-sm">Identifying item...</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-600">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-zinc-500 text-sm">
                  Drop a photo to find dupes · <span className="text-zinc-400">browse</span>
                </p>
              </div>
            )}
            <input id="photoInput" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>
        </div>
 
        {/* Trending searches */}
        <div className={`flex flex-wrap gap-2 justify-center transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {['Lululemon leggings', 'Rhode lip peptide', 'Golden Goose sneakers', 'Tatcha rice wash', 'Skims bodysuit'].map(tag => (
            <button
              key={tag}
              onClick={() => setUrl(tag)}
              className="text-xs border border-zinc-800 text-zinc-500 px-3 py-1.5 rounded-full hover:border-zinc-600 hover:text-zinc-300 transition"
            >
              {tag}
            </button>
          ))}
        </div>
 
      </section>
 
      {/* Feature Cards */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 
          {/* dupeIT */}
          <Link href="/dupes"
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-600 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
            />
            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-4">01</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }} className="text-2xl text-white mb-3">dupeIT</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Find verified cheaper alternatives for any fashion or beauty product. Paste a URL or search by name.
            </p>
            <div className="flex items-center gap-2 text-zinc-400 text-xs group-hover:text-white transition">
              <span>Find dupes</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
 
          {/* Made For You */}
          <Link href="/foryou"
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-600 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(200,168,122,0.05) 0%, transparent 70%)' }}
            />
            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-4">02</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }} className="text-2xl text-white mb-3">Made For You</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              A personalized feed based on your color season, skin tone, and style. Curated to you, not the algorithm.
            </p>
            <div className="flex items-center gap-2 text-zinc-400 text-xs group-hover:text-white transition">
              <span>See your feed</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
 
          {/* Shade Match */}
          <Link href="/shade-translator"
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-600 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(180,120,120,0.05) 0%, transparent 70%)' }}
            />
            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-4">03</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }} className="text-2xl text-white mb-3">Shade Match</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Know your exact shade in every brand. Translate your foundation shade across 30+ brands instantly.
            </p>
            <div className="flex items-center gap-2 text-zinc-400 text-xs group-hover:text-white transition">
              <span>Match my shade</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
 
        </div>
      </section>
 
      {/* Color Season Section */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-zinc-600 text-xs tracking-widest uppercase mb-3">color intelligence</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }} className="text-4xl text-white mb-3">
            Find your season
          </h2>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto">
            Every recommendation is filtered through your personal color palette. Shop colors that were made for you.
          </p>
        </div>
 
        {/* Season Palettes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {Object.entries(SEASON_PALETTES).map(([season, data]) => (
            <div
              key={season}
              onMouseEnter={() => setHoveredSeason(season)}
              onMouseLeave={() => setHoveredSeason(null)}
              className={`relative border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                hoveredSeason === season
                  ? 'border-zinc-600 bg-zinc-800/50'
                  : 'border-zinc-800 bg-zinc-900/30'
              }`}
            >
              <p className="text-white text-sm font-medium mb-1">{season}</p>
              <p className="text-zinc-600 text-xs mb-4">{data.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                {data.colors.map((hex, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full transition-transform duration-200 hover:scale-110"
                    style={{ backgroundColor: hex }}
                    title={data.labels[i]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
 
        <div className="text-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-2xl hover:bg-zinc-100 transition text-sm"
          >
            Discover your season
            <span>→</span>
          </Link>
        </div>
      </section>
 
      {/* Quote / Mission */}
      <section className="px-4 pb-32 max-w-3xl mx-auto text-center">
        <div className="border border-zinc-800 rounded-3xl p-12 bg-zinc-900/20">
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            className="text-2xl text-zinc-300 leading-relaxed mb-6">
            "Finally an app that knows you're a Spring Bright who loves quiet luxury and hates overpaying."
          </p>
          <p className="text-zinc-600 text-xs tracking-widest uppercase">that's syft</p>
        </div>
      </section>
 
    </main>
  )
}