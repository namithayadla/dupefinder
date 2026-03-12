import { NextResponse } from 'next/server'
import {
  isBeautyProduct,
  fetchIngredients,
  calcIngredientMatch,
  getMatchingActives
} from '@/lib/ingredientMatch'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 })
  }

  try {
    const beauty = isBeautyProduct(query)

    const originalRes = await fetch(
      `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}&num=1`
    )
    const originalData = await originalRes.json()
    const originalProduct = originalData.shopping_results?.[0]
    const originalPrice = originalProduct
      ? parseFloat(originalProduct.price?.replace(/[^0-9.]/g, '')) || null
      : null

    const originalBrand = extractBrand(query)
    const dupesRes = await fetch(
      `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query + ' alternative dupe')}&api_key=${process.env.SERPAPI_KEY}&num=20`
    )
    const dupesData = await dupesRes.json()
    const rawDupes = dupesData.shopping_results || []

    const filtered = rawDupes.filter(item => {
      const title = item.title?.toLowerCase() || ''
      const source = item.source?.toLowerCase() || ''
      const dupePrice = parseFloat(item.price?.replace(/[^0-9.]/g, '')) || 0

      const isSameBrand = originalBrand.some(word =>
        title.startsWith(word) || source.includes(word)
        )
      const isMoreExpensive = originalPrice && dupePrice >= originalPrice

      return !isSameBrand && !isMoreExpensive
    }).slice(0, 10)

    let originalIngredients = []
    if (beauty) {
      originalIngredients = await fetchIngredients(query)
    }

    const results = await Promise.all(
      filtered.map(async (item, index) => {
        const dupePrice = parseFloat(item.price?.replace(/[^0-9.]/g, '')) || 0

        const savings = originalPrice && dupePrice < originalPrice
          ? originalPrice - dupePrice
          : null

        const savingsPct = savings
          ? Math.round((savings / originalPrice) * 100)
          : null

        let ingredientMatch = null
        let matchingActives = []
        if (beauty && originalIngredients.length > 0) {
          const dupeIngredients = await fetchIngredients(item.title)
          if (dupeIngredients.length > 0) {
            ingredientMatch = calcIngredientMatch(originalIngredients, dupeIngredients)
            matchingActives = getMatchingActives(originalIngredients, dupeIngredients)
          }
        }

        return {
          id: index + 1,
          name: item.title,
          brand: item.source,
          price: dupePrice,
          originalPrice,       
          savings,             
          savingsPct,     
          image: item.thumbnail,
          url: item.link,
          rating: item.rating || null,
          reviews: item.reviews || null,
          verified: false,
          sustainable: false,
          isBeauty: beauty,
          ingredientMatch,
          matchingActives,
          dupeScore: calcDupeScore(item, ingredientMatch, savingsPct),
        }
      })
    )

    results.sort((a, b) => b.dupeScore - a.dupeScore)

    return NextResponse.json({
      results,
      originalProduct: {
        name: originalProduct?.title || query,
        price: originalPrice,
        image: originalProduct?.thumbnail || null,
        brand: originalBrand[0] || null,
      },
      isBeauty: beauty,
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

function extractBrand(query) {
  const stopWords = ['moisturizer', 'serum', 'cleanser', 'cream', 'lotion',
    'leggings', 'sneakers', 'bag', 'foundation', 'toner', 'mask',
    'the', 'for', 'and', 'with', 'best', 'dupe']

  return query
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3 && !stopWords.includes(word))
}

function calcDupeScore(item, ingredientMatch, savingsPct) {
  let score = 50
  const rating = item.rating || 0
  const reviews = item.reviews || 0

  if (savingsPct >= 70) score += 20
  else if (savingsPct >= 40) score += 12
  else if (savingsPct >= 20) score += 6

  if (rating >= 4.5) score += 15
  else if (rating >= 4.0) score += 10

  if (reviews > 1000) score += 10
  else if (reviews > 100) score += 5

  if (ingredientMatch >= 80) score += 20
  else if (ingredientMatch >= 60) score += 12
  else if (ingredientMatch >= 40) score += 6

  return Math.min(score, 99)
}