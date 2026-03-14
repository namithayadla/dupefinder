// ─────────────────────────────────────────────
// Full 12-season color system
// ─────────────────────────────────────────────
export function calcColorSeason(undertone, depth, contrast) {
    if (undertone === 'warm') {
      if (depth === 'fair' || depth === 'light') {
        return contrast === 'high' ? 'Spring Bright' : 'Spring Light'
      }
      if (depth === 'medium') return 'Spring True'
      if (depth === 'tan' || depth === 'deep') return 'Autumn True'
      if (depth === 'rich') return 'Autumn Dark'
    }
  
    if (undertone === 'cool') {
      if (depth === 'fair' || depth === 'light') {
        return contrast === 'high' ? 'Winter Bright' : 'Summer Light'
      }
      if (depth === 'medium') return 'Summer True'
      if (depth === 'tan' || depth === 'deep') return 'Winter True'
      if (depth === 'rich') return 'Winter Dark'
    }
  
    if (undertone === 'neutral') {
      if (depth === 'fair' || depth === 'light') return 'Summer Soft'
      if (depth === 'medium') return 'Autumn Soft'
      return 'Winter True'
    }
  
    if (undertone === 'olive') {
      if (depth === 'light' || depth === 'medium') return 'Autumn Soft'
      return 'Autumn Dark'
    }
  
    return 'Spring True'
  }
  
  // ─────────────────────────────────────────────
  // Full 12-season palettes
  // ─────────────────────────────────────────────
  export const SEASON_PALETTES = {
  
    // ── SPRING ──────────────────────────────────
    'Spring Light': {
      description: 'Warm, light & delicate',
      colors: ['ivory', 'cream', 'peach', 'baby pink', 'warm white', 'pale gold', 'soft apricot', 'oatmeal'],
      avoid: ['black', 'stark white', 'cool grey', 'dark navy'],
      hex: ['#FFFACD', '#FDEEE4', '#FADADD', '#F5CDB8', '#FAF0E6', '#F5DEB3'],
      clothing: ['ivory linen sets', 'cream blouses', 'soft peach dresses', 'warm white coord'],
      makeup: {
        blush: ['soft peach', 'baby pink', 'warm apricot'],
        lip: ['sheer peach', 'soft coral', 'warm nude'],
        eyeshadow: ['champagne', 'soft peach', 'warm ivory']
      }
    },
  
    'Spring True': {
      description: 'Warm, clear & medium',
      colors: ['peach', 'coral', 'warm gold', 'camel', 'warm green', 'aqua', 'light orange', 'butter yellow'],
      avoid: ['black', 'cool grey', 'burgundy', 'stark white'],
      hex: ['#FFA07A', '#FF7F50', '#FFD700', '#C19A6B', '#90EE90', '#7FFFD4'],
      clothing: ['coral tops', 'camel coats', 'warm green jackets', 'gold accessories'],
      makeup: {
        blush: ['peach', 'coral', 'warm pink'],
        lip: ['coral red', 'warm nude', 'peach pink'],
        eyeshadow: ['warm gold', 'copper', 'peachy brown']
      }
    },
  
    'Spring Bright': {
      description: 'Warm, vivid & high contrast',
      colors: ['coral red', 'papaya orange', 'emerald green', 'aqua blue', 'warm yellow', 'cherry tomato', 'persimmon'],
      avoid: ['muted tones', 'dusty colours', 'dark brown', 'cool grey'],
      hex: ['#FF4500', '#FF6B35', '#50C878', '#00CED1', '#FFD700', '#DC143C', '#FF6347'],
      clothing: ['bold coral sets', 'emerald blazers', 'vivid warm coord', 'bright yellow pieces'],
      makeup: {
        blush: ['coral', 'warm red', 'terracotta'],
        lip: ['coral red', 'warm cherry', 'papaya'],
        eyeshadow: ['copper', 'warm bronze', 'olive green']
      }
    },
  
    // ── SUMMER ──────────────────────────────────
    'Summer Light': {
      description: 'Cool, light & soft',
      colors: ['lavender', 'powder blue', 'soft pink', 'cool grey', 'soft white', 'pale rose', 'icy mint'],
      avoid: ['orange', 'warm gold', 'olive', 'rust', 'black'],
      hex: ['#E6E6FA', '#B0C4DE', '#FFB6C1', '#D3D3D3', '#F8F8FF', '#DDA0DD'],
      clothing: ['lavender sets', 'powder blue tops', 'soft grey coord', 'icy pink pieces'],
      makeup: {
        blush: ['soft pink', 'cool rose', 'icy pink'],
        lip: ['soft pink', 'cool nude', 'sheer rose'],
        eyeshadow: ['lavender', 'soft grey', 'icy pink']
      }
    },
  
    'Summer True': {
      description: 'Cool, medium & muted',
      colors: ['dusty rose', 'mauve', 'cool blue', 'soft teal', 'grey lavender', 'raspberry', 'cocoa'],
      avoid: ['orange', 'warm yellow', 'rust', 'bright warm tones'],
      hex: ['#C9A0A0', '#DDA0DD', '#6495ED', '#008080', '#967BB6', '#872657'],
      clothing: ['dusty rose blouses', 'mauve coord', 'cool blue sets', 'soft teal pieces'],
      makeup: {
        blush: ['dusty rose', 'mauve', 'cool pink'],
        lip: ['rose', 'mauve', 'cool berry'],
        eyeshadow: ['taupe', 'cool brown', 'mauve']
      }
    },
  
    'Summer Soft': {
      description: 'Neutral-cool, soft & blended',
      colors: ['soft lavender', 'greige', 'dusty pink', 'cool taupe', 'soft sage', 'muted periwinkle'],
      avoid: ['bright vivid tones', 'stark black', 'orange', 'neon'],
      hex: ['#D8BFD8', '#C4B7A6', '#D4A5A5', '#B8A99A', '#B2C4B2', '#CCCCFF'],
      clothing: ['greige sets', 'soft sage pieces', 'muted lavender coord', 'cool taupe outfits'],
      makeup: {
        blush: ['soft mauve', 'greige pink', 'muted rose'],
        lip: ['muted pink', 'cool nude', 'soft mauve'],
        eyeshadow: ['soft taupe', 'muted lavender', 'greige']
      }
    },
  
    // ── AUTUMN ──────────────────────────────────
    'Autumn Soft': {
      description: 'Warm-neutral, muted & earthy',
      colors: ['warm taupe', 'camel', 'soft olive', 'dusty peach', 'muted gold', 'warm cream', 'sage green'],
      avoid: ['black', 'stark white', 'cool pink', 'icy blue'],
      hex: ['#C4A882', '#C19A6B', '#808000', '#FFCBA4', '#C5A028', '#FFF8DC', '#8FBC8F'],
      clothing: ['camel knits', 'warm taupe sets', 'soft olive pieces', 'muted gold accessories'],
      makeup: {
        blush: ['warm peach', 'soft terracotta', 'muted coral'],
        lip: ['warm nude', 'soft brick', 'muted coral'],
        eyeshadow: ['warm taupe', 'soft bronze', 'muted olive']
      }
    },
  
    'Autumn True': {
      description: 'Warm, deep & rich',
      colors: ['rust', 'olive', 'burnt orange', 'caramel', 'mustard', 'forest green', 'warm brown', 'terracotta'],
      avoid: ['black', 'cool pink', 'icy blue', 'stark white'],
      hex: ['#8B4513', '#556B2F', '#CC5500', '#C68642', '#FFB300', '#228B22', '#8B6914', '#E2725B'],
      clothing: ['rust coats', 'olive cargo', 'camel everything', 'mustard knits', 'terracotta sets'],
      makeup: {
        blush: ['terracotta', 'warm peach', 'bronze'],
        lip: ['brick red', 'warm brown', 'terracotta', 'pumpkin'],
        eyeshadow: ['bronze', 'copper', 'warm brown', 'olive']
      }
    },
  
    'Autumn Dark': {
      description: 'Warm, very deep & intense',
      colors: ['dark chocolate', 'espresso', 'deep olive', 'burgundy warm', 'dark mustard', 'mahogany', 'deep rust'],
      avoid: ['pastels', 'icy tones', 'cool pink', 'light grey'],
      hex: ['#3C1414', '#3C2005', '#556B2F', '#800020', '#9B7D00', '#C04000', '#8B2500'],
      clothing: ['deep chocolate coats', 'dark olive pieces', 'mahogany leather', 'espresso sets'],
      makeup: {
        blush: ['deep terracotta', 'warm mahogany', 'brick'],
        lip: ['deep brick', 'dark rust', 'mahogany', 'dark chocolate'],
        eyeshadow: ['deep bronze', 'dark copper', 'espresso', 'deep olive']
      }
    },
  
    // ── WINTER ──────────────────────────────────
    'Winter Bright': {
      description: 'Cool, very vivid & high contrast',
      colors: ['true red', 'hot pink', 'royal blue', 'emerald', 'pure white', 'true black', 'bright purple'],
      avoid: ['warm tones', 'orange', 'mustard', 'olive', 'muted shades'],
      hex: ['#DC143C', '#FF69B4', '#4169E1', '#50C878', '#FFFFFF', '#000000', '#8A2BE2'],
      clothing: ['bright red coord', 'hot pink sets', 'royal blue blazers', 'emerald pieces'],
      makeup: {
        blush: ['cool fuchsia', 'bright pink', 'cool red'],
        lip: ['true red', 'hot pink', 'bright berry', 'cool fuchsia'],
        eyeshadow: ['cool grey', 'bright blue', 'deep purple', 'black']
      }
    },
  
    'Winter True': {
      description: 'Cool, deep & clear',
      colors: ['true red', 'royal blue', 'emerald', 'black', 'pure white', 'deep purple', 'cool navy'],
      avoid: ['orange', 'warm brown', 'mustard', 'olive', 'warm beige'],
      hex: ['#DC143C', '#4169E1', '#50C878', '#000000', '#FFFFFF', '#4B0082', '#000080'],
      clothing: ['black everything', 'jewel tone blazers', 'crisp white', 'bold red'],
      makeup: {
        blush: ['cool pink', 'berry', 'cool rose'],
        lip: ['true red', 'berry', 'cool pink', 'deep plum'],
        eyeshadow: ['cool grey', 'navy', 'deep purple', 'black']
      }
    },
  
    'Winter Dark': {
      description: 'Cool, very deep & dramatic',
      colors: ['deep plum', 'midnight navy', 'charcoal', 'deep emerald', 'black', 'icy white', 'dark burgundy'],
      avoid: ['warm tones', 'orange', 'camel', 'mustard', 'pastels'],
      hex: ['#4A0040', '#191970', '#36454F', '#046307', '#000000', '#F0F8FF', '#800020'],
      clothing: ['deep plum coord', 'midnight navy sets', 'charcoal pieces', 'dark emerald'],
      makeup: {
        blush: ['deep berry', 'cool plum', 'dark rose'],
        lip: ['deep plum', 'dark berry', 'cool burgundy', 'dark cherry'],
        eyeshadow: ['charcoal', 'deep navy', 'dark plum', 'black']
      }
    },
  }
  
  // ─────────────────────────────────────────────
  // Check if a color works for a season
  // ─────────────────────────────────────────────
  export function doesColorWorkForSeason(color, season) {
    if (!season || !color) return 'neutral'
    const palette = SEASON_PALETTES[season]
    if (!palette) return 'neutral'
  
    const colorLower = color.toLowerCase()
    const isMatch = palette.colors.some(c => colorLower.includes(c) || c.includes(colorLower))
    const isAvoid = palette.avoid.some(c => colorLower.includes(c) || c.includes(colorLower))
  
    if (isMatch) return 'match'
    if (isAvoid) return 'avoid'
    return 'neutral'
  }

  export function calcSeasonProfile(undertone, depth, contrast, colorConfirm) {
    const primary = calcColorSeason(undertone, depth, contrast)
    const secondaries = []
  
    // determine secondaries based on color confirmation answers
    const warmVivid = ['coral', 'emerald', 'yellow']
    const warmSoft = ['camel', 'rust']
    const coolSoft = ['mauve', 'lavender']
    const deepWarm = ['rust', 'camel']
  
    const confirmed = colorConfirm || []
  
    const hasWarmVivid = warmVivid.some(c => confirmed.includes(c))
    const hasWarmSoft = warmSoft.some(c => confirmed.includes(c))
    const hasCoolSoft = coolSoft.some(c => confirmed.includes(c))
    const hasDeepWarm = deepWarm.some(c => confirmed.includes(c))
  
    if (primary.includes('Spring') && hasDeepWarm) secondaries.push('Autumn True')
    if (primary.includes('Spring') && hasWarmVivid) {
      if (!primary.includes('Bright')) secondaries.push('Spring Bright')
    }
    if (primary.includes('Spring') && hasWarmSoft) {
      if (!primary.includes('Light')) secondaries.push('Spring Light')
    }
    if (primary.includes('Autumn') && hasWarmVivid) secondaries.push('Spring Bright')
    if (primary.includes('Winter') && hasCoolSoft) secondaries.push('Summer True')
  
    return {
      primary,
      secondaries: [...new Set(secondaries)].slice(0, 2)
    }
  }
  
  // ─────────────────────────────────────────────
  // Key actives for ingredient matching
  // ─────────────────────────────────────────────
  export const KEY_ACTIVES = [
    'retinol', 'retinal', 'niacinamide', 'vitamin c', 'ascorbic acid',
    'hyaluronic acid', 'sodium hyaluronate', 'glycolic acid', 'lactic acid',
    'salicylic acid', 'vitamin e', 'tocopherol', 'ceramide', 'peptide',
    'spf', 'zinc oxide', 'titanium dioxide', 'kojic acid', 'azelaic acid'
  ]