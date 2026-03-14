import { NextResponse } from "next/server";

export async function POST(request) {
    const body = await request.json()
    const { styles, categories, colorSeason, secondarySeasons, budget, swipeTags } = body

    // build queries from ALL seasons not just primary
    const allSeasons = [colorSeason, ...(secondarySeasons || [])].filter(Boolean)
    const queries = buildQueries({ styles, categories, allSeasons, budget, swipeTags })
    try {
        const results = await Promise.all(
            queries.map(async (q) => {
                const res = await fetch(
                    `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q.query)}&api_key=${process.env.SERPAPI_KEY}&num=5`
                )
                const data = await res.json()
                return (data.shopping_results || []).slice(0, 3).map((item, i) => ({
                    id: `${q.tag}-${i}`,
                    name: item.title,
                    brand: item.source,
                    price: parseFloat(item.price?.replace(/[^0-9.]/g, '')) || 0,
                    image: item.thumbnail,
                    url: item.link,
                    rating: item.rating || null,
                    reviews: item.reviews || null,
                    tag: q.tag,
                    category: q.category,
                }))
            })
        )
        const flat = results.flat()
        const shuffled = flat.sort(() => Math.random() - 0.5)
        return NextResponse.json({products: shuffled})
    } catch (error) {
        console.error('For You error:', error)
        return NextResponse.json({error: 'Failed to load feed'}, {status: 500})
    }
}
function buildQueries({styles, categories, colorSeason, budget, swipeTags}) {
    const queries = []
    const seasonColors = {
        'Spring Light': ['ivory top', 'peach dress', 'cream blazer'],
        'Spring Bright': ['coral top', 'warm red dress', 'bright yellow coord'],
        'Summer Light': ['lavender top', 'dusty rose dress', 'powder blue set'],
        'Summer Soft': ['mauve blouse', 'soft pink coord', 'cool grey outfit'],
        'Autumn Deep': ['rust coat', 'olive jacket', 'camel coord', 'terracotta dress'],
        'Winter Deep': ['emerald blazer', 'true red dress', 'royal blue top'],
        'Winter Dark': ['black coord', 'deep plum dress', 'jewel tone blazer'],
    }
    const colors = seasonColors[colorSeason] || seasonColors['Spring Bright']
    colors.slice(0, 2).forEach(color => {
        queries.push({query: color, tag: colorSeason, category: 'clothing'})
    })
    const styleQueries = {
        quiet: ['quiet luxury outfit', 'minimalist neutral set', 'old money aesthetic clothing'],
        clean: ['clean girl aesthetic outfit', 'minimal white set', 'aritzia style clothing'],
        street: ['streetwear outfit women', 'oversized hoodie set', 'nike women outfit'],
        coastal: ['coastal grandmother outfit', 'linen set women', 'relaxed coastal style'],
        y2k: ['y2k outfit women', 'low rise jeans outfit', 'y2k coord'],
        athleisure: ['lululemon style outfit', 'matching athletic set women', 'athleisure coord'],
        dark: ['dark academia outfit', 'blazer plaid skirt', 'vintage bookish outfit'],
        boho: ['boho outfit women', 'flowy maxi dress', 'earth tone boho set'],
    }
    const styleArr = Array.isArray(styles) ? styles : [styles]
    styleArr.slice(0, 2).forEach(style => {
        const sq = styleQueries[style]
        if(sq) {
            queries.push({query: sq[0], tag: style, category: 'clothing'})
        }
    })
    const categoryQueries = {
        skincare: ['best skincare routine products', 'glass skin serum'],
        makeup: ['everyday makeup products', 'natural makeup look products'],
        clothing: ['trendy women outfit 2026'],
        sneakers: ['trendy sneakers women 2026'],
        bags: ['trendy bags women 2026'],
        accessories: ['trendy accessories women 2026'],
    }
    const catArr = Array.isArray(categories) ? categories : [categories]
    catArr.slice(0, 2).forEach(cat => {
        const cq = categoryQueries[cat]
        if(cq) {
            queries.push({query: cq[0], tag: cat, category: cat})
        }
    })
    const tagQueryMap = {
        'quiet luxury': 'quiet luxury minimalist outfit',
        'clean girl': 'clean girl aesthetic outfit',
        'minimal': 'minimal outfit women',
        'skincare': 'viral skincare products',
        'glam': 'glam makeup products',
        'warm': 'warm toned outfit women',
        'natural': 'natural beauty products',
        'street': 'streetwear women outfit',
    }
    const topTags = [...new Set(swipeTags || [])].slice(0, 2)
    topTags.forEach(tag => {
        const q = tagQueryMap[tag]
        if (q) {
            queries.push({query: q, tag, category: 'clothing'})
        }
    })
    return queries.slice(0, 6)
}