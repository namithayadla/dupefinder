'use client'
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from '@/components/ProductCard'

export default function Results() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])
    const [originalProduct, setOriginalProduct] = useState(null)
    useEffect(() => {
        if(!query) {
            return
        }
        setLoading(true)
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                setResults(data.results || [])
                setOriginalProduct(data.originalProduct || null)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [query])
    const filtered = results.filter(r => {
        if(filter === 'verified') {
            return r.verified
        }
        if(filter === 'sustainable') {
            return r.sustainable
        }
        return true
    })
    return (
        <main className="min-h-screen bg-black text-white px-4 py-10 max-w-4xl mx-auto">
            <div className="mb-8"> 
                <p className="text-zinc-500 text-sm mb-1">Showing dupes for</p>
                <h1 className="text-2xl font-bold">{decodeURIComponent(query)}</h1>
            </div>
            {!loading && originalProduct?.price && (
                <div className="mb-6 p-4 border border-zinc-700 rounded-2xl flex items-center gap-4 bg-zinc-900/50">
                    {originalProduct.image && (
                        <img src={originalProduct.image} className="w-14 h-14 object-cover rounded-lg" />
                    )}
                    <div>
                        <p className="text-xs text-zinc-500 mb-0.5">Original</p>
                        <p className="text-white text-sm font-medium">{originalProduct.name}</p>
                        <p className="text-zinc-400 text-sm">${originalProduct.price}</p>
                    </div>
                    <div className="ml-auto text-xs text-zinc-500 text-right">
                        Dupes below are<br/>cheaper alternatives
                    </div>
                </div>
            )}
            <div className="flex gap-2 mb-8">
                {['all', 'verified', 'sustainable'].map(f => (
                    <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm border transition capitalize ${
                        filter === f
                          ? 'bg-white text-black border-white'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                    >
                        {f === 'all' ? 'All Results' : f === 'verified' ? 'Verified' : 'Sustainable'}
                    </button>
                ))}
            </div>
            {loading ? (
                <div className="grid gap-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-36 animate-pulse"/>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
            )}
        </main>
    )
}