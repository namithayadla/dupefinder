'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Inter } from 'next/font/google'
import { SEASON_PALETTES } from "@/lib/colorSeason"
import { calcColorSeason, calcSeasonProfile } from '@/lib/colorSeason'

const inter = Inter({ subsets: ['latin'], weight: ['900'] })
export default function Home() {
  const [url, setUrl] = useState('')
  const [dragging, setDragging] = useState('')
  const [profile, setProfile] = useState(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const saved = localStorage.getItem('styleProfile')
    if(saved) {
      setProfile(JSON.parse(saved))
    }
  }, [])
  function handleSearch(e) {
    e.preventDefault()
    if(!url.trim()) {
      return
    }
    router.push(`/results?q=${encodeURIComponent(url)}`)
  }
  async function processPhoto(file) {
    if(!file) {
      return
    }
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
        } else {
          alert('Could not identify the item. Try a clearer photo')
        }
      } catch (err) {
        console.error(err)
        alert('Something went wrong, try again')
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
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="mb-2 text-sm tracking-widest text-zinc-500 uppercase">Introducing</div>
      <h1 className="text-6xl font-bold mb-3 tracking-tight">
        <span className="inline-block -skew-x-6 font-bold">dupe</span>
        <span className="font-bold tracking-tight">IT</span>
      </h1>
      <p className="text-zinc-400 text-lg mb-12 text-center max-w-md">Find fashion & beauty dupes instantly. Verified sellers. Best time to buy.</p>
      <form onSubmit={handleSearch} className="w-full max-w-2xl mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a product URL or type a product name..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition"
          />
          <button type="submit" className="bg-white text-black font-semibold px-6 py-4 rounded-xl hover:bg-zinc-200 transition">
            Find Dupes
          </button>
        </div>
      </form>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`w-full max-w-2xl border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
          dragging ? 'border-white bg-zinc-800' :
          photoLoading ? 'border-zinc-600 bg-zinc-900' :
          'border-zinc-700 hover:border-zinc-500'
        }`}
        onClick={() => !photoLoading && document.getElementById('photoInput').click()}
      >
        {photoLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border border-zinc-500 border-t-white rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Identifying item...</p>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-2">📷</div>
            <p className="text-zinc-400 text-sm">
              Drop a photo here or <span className="text-white underline">browse</span>
            </p>
            <p className="text-zinc-600 text-xs mt-1">Upload any product photo to find dupes</p>
          </>
        )}
        <input
          id="photoInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />
      </div>
      <div className="mt-10 flex flex-wrap gap-2 justify-center max-w-lg">
        {['Lulu leggings', 'Tatcha moisturizer', 'Golden Goose sneakers', 'Skims bodysuit', 'Rare beauty blush'].map(tag => (
          <button
            key={tag}
            onClick={() => setUrl(tag)}
            className="text-xs bg-zinc-900 border border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-full hover:border-zinc-400 hover:text-white transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </main>
  )
}