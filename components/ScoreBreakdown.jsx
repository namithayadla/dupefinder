'use client'

export default function ScoreBreakdown({product, onClose}) {
    const rows = buildBreakdown(product)
    const total = rows.reduce((sum, r) => sum + r.points, 0)

    return (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
    
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Score Breakdown</h2>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white text-xl transition"
              >
                ×
              </button>
            </div>
    
            <p className="text-zinc-400 text-xs mb-5">
              How we calculated the {product.dupeScore} dupe score for{' '}
              <span className="text-white">{product.name}</span>
            </p>

            <div className="space-y-3 mb-5">
              {rows.map((row, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-300 text-xs">{row.label}</span>
                    <span className={`text-xs font-bold ${row.points > 0 ? 'text-green-400' : 'text-zinc-600'}`}>
                      +{row.points} pts
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-white/20 transition-all"
                      style={{ width: `${(row.points / row.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-zinc-600 text-xs mt-0.5">{row.reason}</p>
                </div>
              ))}
            </div>
    
            <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Total Score</span>
              <span className={`text-lg font-black ${
                total >= 90 ? 'text-green-400' :
                total >= 75 ? 'text-yellow-400' :
                'text-zinc-300'
              }`}>
                {product.dupeScore} / 99
              </span>
            </div>
    
            <p className="text-zinc-600 text-xs mt-3 text-center">
              {product.dupeScore >= 90 ? 'Excellent dupe — highly recommended' :
               product.dupeScore >= 75 ? 'Good dupe — solid alternative' :
               product.dupeScore >= 60 ? 'Decent dupe — worth considering' :
               'Weak dupe — use caution'}
            </p>
    
          </div>
        </>
      )
}

function buildBreakdown(product) {
    const rows = []
    //savingsScore
    if(product.savingsPct >= 70) {
        rows.push({label: 'Price Savings', points: 20, max: 20, reason: `Saves ${product.savingsPct}% vs original - excellent value` })
    } else if(product.savingsPct >= 40) {
        rows.push({label: 'Price Savings', points: 12, max: 20, reason: `Saves ${product.savingsPct}% vs original - good value` })
    } else if(product.savingsPct >= 20) {
        rows.push({label: 'Price Savings', points: 6, max: 20, reason: `Saves ${product.savingsPct}% vs original - moderate savings` })
    } else {
        rows.push({label: 'Price Savings', points: 0, max: 20, reason: product.savingsPct ? `Only saves ${product.savingsPct}%` : 'No price comparison available' })
    }
    //ratingsScore
    if(product.rating >= 4.5) {
        rows.push({label: 'Customer Rating', points: 15, max: 15, reason: `${product.rating} stars — exceptional reviews`})
    } else if(product.rating >= 4.0) {
        rows.push({label: 'Customer Rating', points: 12, max: 15, reason: `${product.rating} stars — strong reviews`})
    } else if(product.rating >= 2.5) {
        rows.push({label: 'Customer Rating', points: 8, max: 15, reason: `${product.rating} stars — average reviews`})
    } else if(product.rating >= 0.0){
        rows.push({label: 'Customer Rating', points: 4, max: 15, reason: `${product.rating} stars — very bad reviews` })
    } else {
        rows.push({label: 'Customer Rating', points: 0, max: 15, reason: 'No rating data available'})
    }
    //reviewCount
    if(product.reviews > 1000) {
        rows.push({label: 'Review Volume', points: 10, max: 10, reason: `${product.reviews?.toLocaleString()} reviews — very well tested` })
    } else if(product.reviews > 100) {
        rows.push({label: 'Review Volume', points: 7, max: 10, reason: `${product.reviews?.toLocaleString()} reviews — enough to trust` })
    } else {
        rows.push({label: 'Review Volume', points: 0, max: 10, reason: product.reviews ? `Only ${product.reviews} reviews — limited data` : 'No review data available' })
    }
    //verififedSeller
    if(product.verified) {
        rows.push({label: 'Verfified Seller', points: 10, max: 10, reason: 'Seller has been verified by dupeIt' })
    } else {
        rows.push({label: 'Verified Seller', points: 0, max: 0, reason: 'Seller is not verified'})
    }
    //ingredientMatch
    if(product.ingredientMatch !== null) {
        if(product.ingredientMatch >= 80) {
            rows.push({label: 'Ingredient Match', points: 20, max: 20, reason: `${product.ingredientMatch}% ingredient overlap — nearly identical formula`})
        } else if(ingredientMatch >= 60) {
            rows.push({label: 'Ingredient Match', points: 12, max: 20, reason: `${product.ingredientMatch}% ingredient overlap — similar formula`})
        } else if(product.ingredientMatch >= 40) {
            rows.push({label: 'Ingredient Match', points: 6, max: 20, reason: `${product.ingredientMatch}% ingredient overlap — partial match`})
        } else {
            rows.push({label: 'Ingredient Match', points: 0, max: 20, reason: `${product.ingredientMatch}% ingredient overlap — low similarity`})
        }
    }
    return rows
}