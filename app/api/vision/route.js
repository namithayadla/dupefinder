import { NextResponse } from 'next/server'

export async function POST(request) {
  const { imageBase64 } = await request.json()
  if (!imageBase64) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  try {
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
              { type: 'WEB_DETECTION', maxResults: 5 },
            ]
          }]
        })
      }
    )

    const visionData = await visionRes.json()
    const response = visionData.responses?.[0]

    console.log('Vision response:', JSON.stringify(response, null, 2))
    console.log('Labels:', response?.labelAnnotations)
    console.log('Objects:', response?.localizedObjectAnnotations)
    console.log('Web entities:', response?.webDetection?.webEntities)
    console.log('Full Vision data:', JSON.stringify(visionData, null, 2))

    const labels = response?.labelAnnotations?.map(l => l.description) || []
    const objects = response?.localizedObjectAnnotations?.map(o => o.name) || []
    const webEntities = response?.webDetection?.webEntities
      ?.filter(e => e.score > 0.5)
      ?.map(e => e.description) || []

    const allTerms = [...new Set([...objects, ...webEntities, ...labels])]
    const prioritized = [
        ...webEntities.slice(0, 2),  // most specific — actual product names
        ...objects.filter(o => isFashionTerm(o)).slice(0, 1),
        ...labels.filter(l => isFashionTerm(l)).slice(0, 1),
      ].filter(Boolean)
    
    const fashionTerms = allTerms.filter(t => isFashionTerm(t))
    const stopTerms = [
        'bottled and jarred packaged goods', 'bottle', 'product',
        'cosmetics', 'beauty', 'liquid', 'fluid', 'material'
    ]
    const cleaned = prioritized.filter(t =>
        !stopTerms.some(s => t.toLowerCase().includes(s))
    )
    const searchQuery = webEntities[0] || cleaned[0] || allTerms[0] || ''
    
    return NextResponse.json({
      query: searchQuery,
      labels,
      objects,
      webEntities
    })

  } catch (error) {
    console.error('Vision error:', error)
    return NextResponse.json({ error: 'Vision API failed' }, { status: 500 })
  }
}

function isFashionTerm(term) {
  const fashionWords = [
    'dress', 'shirt', 'pants', 'jacket', 'coat', 'shoes', 'bag', 'sneaker',
    'blouse', 'skirt', 'jeans', 'boots', 'heels', 'sandals', 'top', 'sweater',
    'hoodie', 'blazer', 'suit', 'shorts', 'leggings', 'foundation', 'lipstick',
    'serum', 'moisturizer', 'mascara', 'blush', 'skincare', 'makeup', 'perfume',
    'clothing', 'fashion', 'apparel', 'accessory', 'jewelry', 'handbag', 'tote',
    'outerwear', 'activewear', 'swimwear', 'lingerie', 'loafer', 'mule', 'flat'
  ]
  return fashionWords.some(w => term.toLowerCase().includes(w))
}