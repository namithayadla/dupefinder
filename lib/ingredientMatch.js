
export function isBeautyProduct(query) {
    const beautyKeywords = [
        'moisturizer', 'serum', 'cleanser', 'toner', 'sunscreen',
        'foundation', 'concealer', 'blush', 'mascara', 'lipstick',
        'primer', 'setting spray', 'face wash', 'eye cream', 'retinol',
        'vitamin c', 'hyaluronic', 'spf', 'exfoliant', 'face mask',
        'tatcha', 'cerave', 'la mer', 'drunk elephant', 'the ordinary',
        'skinceuticals', 'laneige', 'glow recipe', 'neutrogena', 'olay'
    ]
    const lower = query.toLowerCase()
    return beautyKeywords.some(keyword => lower.includes(keyword))
}

export async function fetchIngredients(productName) {
    try {
        const res = await fetch(
            `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1&page_size=1`
        )
        const data =await res.json()
        const product = data.products?.[0]
        if(!product?.ingredients_text) {
            return []
        }
        return parseIngredients
    } catch (error) {
        console.error('Failed to fetch ingredients', error)
        return []
    }
}
function parseIngredients(raw) {
    return raw.toLowerCase().split(/[,;]/).map(i => i.replace(/\(.*?\)/g, '')).map(i => i.replace(/[^a-z0-9 ]/g, '')).map(i => i.trim()).filter(i => i.length > 2)
}
export function calcIngredientMatch(originalIngredients, dupeIngredients) {
    if(!originalIngredients.length || !dupeIngredients.length) {
        return null
    }
    const originalSet = new Set(originalIngredients)
    const dupeSet = new Set(dupeIngredients)
    let matches = 0
    dupeSet.forEach(ingredient => {
        if(originalSet.has(ingredient)) {
            matches++
        }
    })
    const totalUnique = new Set([...originalSet, ...dupeSet]).size
    const score = Math.round((matches / totalUnique) * 100)
    return score
}
//key active ingredients hardcoded

export const KEY_ACTIVES = [
    'retinol', 'retinal', 'retinoid',
    'niacinamide', 'vitamin c', 'ascorbic acid',
    'hyaluronic acid', 'sodium hyaluronate',
    'glycolic acid', 'lactic acid', 'salicylic acid',
    'vitamin e', 'tocopherol',
    'ceramide', 'peptide', 'collagen',
    'spf', 'zinc oxide', 'titanium dioxide',
    'kojic acid', 'azelaic acid', 'tranexamic acid'
]

export function getMatchingActives(originalIngredients, dupeIngredients) {
    const dupeSet = new Set(dupeIngredients)
    return KEY_ACTIVES.filter(active =>
        originalIngredients.some(i => i.includes(active)) && dupeSet.has(active))
}