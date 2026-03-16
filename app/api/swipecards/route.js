import { NextResponse } from "next/server";

export async function POST(request) {
    const body = await request.json()
    const {styles, categories, colorSeason, allSeasons, swipeTags, dislikedTags, offset} = body
    const queries = buildSwipeQueries({
        styles, categories, colorSeason, allSeasons, swipeTags, dislikedTags, offset
    })

    try {
        const results = await Promise.allSettled(
            queries.map(async (q) => {
                const res = await fetch(
                    `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q.query)}&api_key=${process.env.SERPAPI_KEY}&num=5`
                )
                const data = await res.json()
                return (data.shopping_results || []).slice(0, 3).map((item, i) => ({
                    id: `${q.tag || 'item'}-${i}-${Math.random().toString(36).slice(2, 7)}`,
                    name: item.title,
                    label: item.title,
                    brand: item.source,
                    price: parseFloat(item.price?.replace(/[^0-9.]/g, '')) || 0,
                    image: item.thumbnail,
                    url: item.link,
                    tags: q.tags,
                    category: q.category,
                }))
            })
        )
        const flat = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value)
        const seen = new Set()
        const deduped = flat.filter(item => {
            const key = item.name?.toLowerCase().slice(0, 30)
            if(seen.has(key)) {
                return false
            }
            seen.add(key)
            return true
        })
        const shuffled = deduped.sort(() => Math.random() - 0.5)
        return NextResponse.json({cards: shuffled})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'Failed to fetch cards'}, {status: 500})
    }
}
function buildSwipeQueries({ styles, categories, colorSeason, allSeasons, swipeTags, dislikedTags, offset }) {
    const queries = []
  
    const seasonQueries = {
      'Spring Bright': [
        { q: 'coral linen top women', tags: ['coral', 'spring bright', 'warm'] },
        { q: 'emerald green blazer women', tags: ['emerald', 'spring bright', 'bold'] },
        { q: 'warm red midi dress women', tags: ['red', 'spring bright', 'warm'] },
        { q: 'papaya orange coord women', tags: ['orange', 'spring bright', 'colorful'] },
        { q: 'bright yellow co-ord women', tags: ['yellow', 'spring bright', 'warm'] },
      ],
      'Spring Light': [
        { q: 'ivory linen set women', tags: ['ivory', 'spring light', 'minimal'] },
        { q: 'cream blazer women minimal', tags: ['cream', 'spring light', 'quiet luxury'] },
        { q: 'soft peach dress women', tags: ['peach', 'spring light', 'feminine'] },
        { q: 'warm white coord women', tags: ['white', 'spring light', 'clean girl'] },
      ],
      'Spring True': [
        { q: 'camel coat women', tags: ['camel', 'spring true', 'warm'] },
        { q: 'warm gold accessories women', tags: ['gold', 'spring true', 'warm'] },
        { q: 'aqua blue top women', tags: ['aqua', 'spring true', 'fresh'] },
      ],
      'Autumn True': [
        { q: 'rust coat women fall', tags: ['rust', 'autumn', 'warm'] },
        { q: 'olive green jacket women', tags: ['olive', 'autumn', 'earthy'] },
        { q: 'camel coord women', tags: ['camel', 'autumn', 'warm'] },
        { q: 'terracotta dress women', tags: ['terracotta', 'autumn', 'earthy'] },
        { q: 'mustard knit women', tags: ['mustard', 'autumn', 'warm'] },
      ],
      'Autumn Dark': [
        { q: 'chocolate brown coat women', tags: ['brown', 'autumn dark', 'deep'] },
        { q: 'deep olive outfit women', tags: ['olive', 'autumn dark', 'earthy'] },
        { q: 'burgundy warm outfit women', tags: ['burgundy', 'autumn dark', 'rich'] },
      ],
      'Autumn Soft': [
        { q: 'warm taupe set women', tags: ['taupe', 'autumn soft', 'muted'] },
        { q: 'sage green outfit women', tags: ['sage', 'autumn soft', 'earthy'] },
      ],
      'Summer Light': [
        { q: 'lavender set women', tags: ['lavender', 'summer light', 'cool'] },
        { q: 'powder blue top women', tags: ['blue', 'summer light', 'soft'] },
        { q: 'dusty rose dress women', tags: ['rose', 'summer light', 'feminine'] },
      ],
      'Summer True': [
        { q: 'mauve blouse women', tags: ['mauve', 'summer true', 'muted'] },
        { q: 'dusty rose coord women', tags: ['rose', 'summer true', 'soft'] },
      ],
      'Summer Soft': [
        { q: 'greige set women', tags: ['greige', 'summer soft', 'neutral'] },
        { q: 'soft sage outfit women', tags: ['sage', 'summer soft', 'muted'] },
      ],
      'Winter True': [
        { q: 'black coord women minimal', tags: ['black', 'winter', 'minimal'] },
        { q: 'emerald blazer women bold', tags: ['emerald', 'winter', 'jewel tone'] },
        { q: 'true red dress women', tags: ['red', 'winter', 'bold'] },
      ],
      'Winter Bright': [
        { q: 'hot pink coord women', tags: ['pink', 'winter bright', 'bold'] },
        { q: 'royal blue set women', tags: ['blue', 'winter bright', 'vivid'] },
      ],
      'Winter Dark': [
        { q: 'deep plum outfit women', tags: ['plum', 'winter dark', 'rich'] },
        { q: 'midnight navy set women', tags: ['navy', 'winter dark', 'deep'] },
      ],
    }
  
    const styleQueries = {
      quiet: [
        { q: 'quiet luxury outfit women', tags: ['quiet luxury', 'minimal', 'old money'] },
        { q: 'old money aesthetic clothing women', tags: ['old money', 'quiet luxury'] },
        { q: 'minimalist neutral outfit women', tags: ['minimal', 'neutral', 'clean'] },
      ],
      clean: [
        { q: 'clean girl aesthetic outfit 2026', tags: ['clean girl', 'minimal', 'fresh'] },
        { q: 'aritzia style clothing women', tags: ['clean girl', 'minimal'] },
      ],
      street: [
        { q: 'streetwear outfit women 2026', tags: ['streetwear', 'casual', 'cool'] },
        { q: 'oversized streetwear women', tags: ['streetwear', 'oversized'] },
      ],
      coastal: [
        { q: 'coastal grandmother outfit women', tags: ['coastal', 'relaxed', 'linen'] },
        { q: 'linen set women summer', tags: ['coastal', 'linen', 'relaxed'] },
      ],
      y2k: [
        { q: 'y2k outfit women 2026', tags: ['y2k', 'retro', 'colorful'] },
        { q: 'low rise jeans outfit women', tags: ['y2k', 'retro'] },
      ],
      athleisure: [
        { q: 'matching athletic set women', tags: ['athleisure', 'sporty', 'casual'] },
        { q: 'lululemon style leggings set', tags: ['athleisure', 'minimal', 'sporty'] },
      ],
      dark: [
        { q: 'dark academia outfit women', tags: ['dark academia', 'vintage', 'bookish'] },
        { q: 'blazer plaid skirt women', tags: ['dark academia', 'preppy'] },
      ],
      boho: [
        { q: 'boho outfit women flowy', tags: ['boho', 'earthy', 'free spirit'] },
        { q: 'earth tone maxi dress women', tags: ['boho', 'earthy', 'warm'] },
      ],
    }
  
    const categoryQueries = {
      skincare: [
        { q: 'viral skincare products 2026', tags: ['skincare', 'beauty'], cat: 'beauty' },
        { q: 'glass skin routine products', tags: ['skincare', 'natural'], cat: 'beauty' },
        { q: 'best serum skincare women', tags: ['skincare', 'serum'], cat: 'beauty' },
      ],
      makeup: [
        { q: 'everyday makeup products 2026', tags: ['makeup', 'natural'], cat: 'beauty' },
        { q: 'clean makeup look products', tags: ['makeup', 'clean'], cat: 'beauty' },
        { q: 'viral makeup products tiktok', tags: ['makeup', 'trending'], cat: 'beauty' },
      ],
      sneakers: [
        { q: 'trendy sneakers women 2026', tags: ['sneakers', 'footwear'], cat: 'shoes' },
        { q: 'new balance style sneakers women', tags: ['sneakers', 'casual'], cat: 'shoes' },
      ],
      bags: [
        { q: 'trendy bags women 2026', tags: ['bags', 'accessories'], cat: 'accessories' },
        { q: 'minimalist tote bag women', tags: ['bags', 'minimal'], cat: 'accessories' },
      ],
      accessories: [
        { q: 'trendy gold jewelry women 2026', tags: ['jewelry', 'accessories'], cat: 'accessories' },
        { q: 'minimal accessories women', tags: ['accessories', 'minimal'], cat: 'accessories' },
      ],
    }

    const seasonsToQuery = allSeasons?.length > 0
    ? allSeasons
    : [colorSeason]

    seasonsToQuery.forEach((season, i) => {
        const sq = seasonQueries[season] || []
        const count = i === 0 ? 3 : 1 
        sq.slice(0, count).forEach(item => {
        queries.push({ query: item.q, tag: season, tags: item.tags, category: 'clothing' })
        })
    })

    const styleArr = Array.isArray(styles) ? styles : [styles]
    styleArr.slice(0, 2).forEach(style => {
        const sq = styleQueries[style] || []
        sq.slice(0, 1).forEach(item => {
        queries.push({ query: item.q, tag: style, tags: item.tags, category: 'clothing' })
        })
    })

    const catArr = Array.isArray(categories) ? categories : [categories]
    catArr.slice(0, 2).forEach(cat => {
        const cq = categoryQueries[cat] || []
        cq.slice(0, 1).forEach(item => {
        queries.push({ query: item.q, tag: cat, tags: item.tags, category: item.cat })
        })
    })

    const rotated = [...queries.slice(offset % queries.length), ...queries.slice(0, offset % queries.length)]

  return rotated.slice(0, 3)
}