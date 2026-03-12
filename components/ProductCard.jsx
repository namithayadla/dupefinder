'use client'
import { useState } from "react"
import ScoreBreakdown from "./ScoreBreakdown"

export default function ProductCard({ product }) {
    const [wishlist, setWishlist] = useState(false)
    const [showBreakdown, setShowBreakdown] = useState(false)

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 hover:border-zinc-600 transition">
            <img
                src={product.image}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-xs text-zinc-500 mb-0.5">{product.brand}</p>
                        <h3 className="text-white font-medium text-sm leading-snug">{product.name}</h3>
                    </div>
                    <div 
                        onClick={() => setShowBreakdown(true)}
                        className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-lg cursor-pointer hover:opacity-80 transition ${
                            product.dupeScore >= 90 ? 'bg-green-500/20 text-green-400' :
                            product.dupeScore >= 75 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-zinc-700 text-zinc-300'
                        }`}
                    >
                        {product.dupeScore} dupe score
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-white font-bold">${product.price}</span>
                    {product.originalPrice && (
                        <span className="text-zinc-600 line-through text-sm">
                            ${product.originalPrice}
                        </span>
                    )}
                    {product.savingsPct > 0 && (
                        <span className="text-green-400 text-xs">
                            Save {product.savingsPct}%
                        </span>
                    )}
                    {product.savings > 0 && (
                        <span className="text-zinc-500 text-xs">
                            (${product.savings.toFixed(0)} off)
                        </span>
                    )}
                </div>
                {product.rating && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-xs">★ {product.rating}</span>
                        {product.reviews && (
                            <span className="text-zinc-600 text-xs">
                                ({product.reviews.toLocaleString()} reviews)
                            </span>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {product.verified && (
                        <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                            Verified Seller
                        </span>
                    )}
                    {product.sustainable && (
                        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                            Sustainable
                        </span>
                    )}
                </div>
                {product.ingredientMatch !== null && (
                    <div className="mt-3 pt-3 border-t border-zinc-800">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-zinc-400">Ingredient match</span>
                            <span className={`text-xs font-bold ${
                                product.ingredientMatch >= 80 ? 'text-green-400' :
                                product.ingredientMatch >= 60 ? 'text-yellow-400' :
                                'text-zinc-400'
                            }`}>
                                {product.ingredientMatch}%
                            </span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-2">
                            <div
                                className={`h-1.5 rounded-full transition-all ${
                                    product.ingredientMatch >= 80 ? 'bg-green-400' :
                                    product.ingredientMatch >= 60 ? 'bg-yellow-400' :
                                    'bg-zinc-600'
                                }`}
                                style={{ width: `${product.ingredientMatch}%` }}
                            />
                        </div>
                        {product.matchingActives?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {product.matchingActives.map(active => (
                                    <span
                                        key={active}
                                        className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full"
                                    >
                                        {active}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => setWishlist(w => !w)}
                    className={`text-xl transition ${wishlist ? 'text-red-400' : 'text-zinc-600 cursor-pointer hover:opacity-80 transition'}`}
                >
                    {wishlist ? '🩷' : '🤍'}
                </button>
                <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition"
                >
                    Shop
                </a>
            </div>
            {showBreakdown && (
                <ScoreBreakdown
                    product={product}
                    onClose={() => setShowBreakdown(false)}
                />
            )}
        </div>
    )
}