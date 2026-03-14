'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { calcColorSeason, calcSeasonProfile } from "@/lib/colorSeason"
const questions = [
    {
        id: 'skin_depth',
        question: 'What is your skin depth?',
        subtitle: 'Choose the row that best represents your complexion',
        visual: true,
        options: [
          { 
            label: 'Fair', 
            value: 'fair', 
            sub: 'very light, burns easily',
            swatches: ['#FDEEE4', '#FAE0D0', '#F5CDB8', '#F0C4A8']
          },
          { 
            label: 'Light', 
            value: 'light', 
            sub: 'light with some color',
            swatches: ['#F5C5A3', '#EDAF85', '#E8A070', '#E09060']
          },
          { 
            label: 'Medium', 
            value: 'medium', 
            sub: 'tans moderately',
            swatches: ['#D4956A', '#C8845A', '#BC7448', '#B06840']
          },
          { 
            label: 'Tan', 
            value: 'tan', 
            sub: 'olive or golden brown',
            swatches: ['#A06840', '#946030', '#885828', '#7C5020']
          },
          { 
            label: 'Deep', 
            value: 'deep', 
            sub: 'rich brown tones',
            swatches: ['#6B3D20', '#5C3018', '#4E2810', '#402008']
          },
          { 
            label: 'Rich', 
            value: 'rich', 
            sub: 'deepest complexions',
            swatches: ['#3D1F10', '#301808', '#241004', '#180800']
          },
        ]
    },
    {
        id: 'undertone',
        question: 'What is your skin undertone?',
        subtitle: 'Which row feels closest to the tone beneath your skin?',
        visual: true,
        options: [
          {
            label: 'Warm',
            value: 'warm',
            sub: 'golden, peachy, yellow base',
            swatches: ['#E8B88A', '#D4956A', '#C07840', '#A86030']
          },
          {
            label: 'Cool',
            value: 'cool',
            sub: 'pink, red, bluish base',
            swatches: ['#E8B4B8', '#D4909A', '#C07080', '#A85068']
          },
          {
            label: 'Neutral',
            value: 'neutral',
            sub: 'mix of warm and cool',
            swatches: ['#E8B89A', '#D4987A', '#C07858', '#A86040']
          },
          {
            label: 'Olive',
            value: 'olive',
            sub: 'green-neutral, Mediterranean',
            swatches: ['#C8A870', '#B49058', '#9A7840', '#806030']
          },
        ]
    },
    {
        id: 'categories',
        question: 'What are you most trying to dupe?',
        subtitle: 'We\'ll personalize your trending feed',
        multi: true,
        options: [
            {label: 'Skincare', value: 'skincare'},
            {label: 'Makeup', value: 'makeup'},
            {label: 'Clothing', value: 'clothing'},
            {label: 'sneakers', value: 'sneakers'},
            {label: 'bags', value: 'bags'},
            {label: 'accessories', value: 'accessories'},
        ]
    },
    {
        id: 'style',
        question: 'What\'s your fashion vibe?',
        subtitle: 'Pick everything that feels like you',
        multi: true,
        options: [
            {label: 'Quiet Luxury', value: 'quiet'},
            {label: 'Streetwear', value: 'street'},
            {label: 'Clean Girl', value: 'clean'},
            {label: 'Coastal Grandmother', value: 'coastal'},
            {label: 'Y2K', value: 'y2k'},
            {label: 'Athleisure', value: 'athleisure'},
            {label: 'Dark Academia', value: 'dark'},
            {label: 'Boho/ Free Spirit', value: 'boho'},
        ]
    },
    {
        id:'budget',
        question: 'What\'s your budget?',
        subtitle: 'We\'ll filter results to your range',
        options: [
            {label: 'Under $25', value: 'budget_low'},
            {label: '$25 - $50', value: 'budget_mid'},
            {label: '$50 - $75', value: 'budget_high'},
            {label: 'No limit', value: 'budget_any'},
        ]
    },
    // {
    //     id: 'skin',
    //     question: 'What\'s your skin type?',
    //     subtitle: 'We\'ll personalize your skincare recommendations',
    //     options: [
    //         {label: 'Oily', value: 'oily'},
    //         {label: 'Dry', value: 'dry'},
    //         {label: 'Combination', value: 'combination'},
    //         {label: 'Sensitive', value: 'sensitive'},
    //     ]
    // },
    // {
    //     id: 'contrast',
    //     question: 'How would you describe your overall contrast?',
    //     subtitle: 'Compare your hair, eyes, and skin — how different are they?',
    //     visual: true,
    //     options: [
    //       {
    //         label: 'High Contrast',
    //         value: 'high',
    //         sub: 'very dark hair, light skin or vice versa',
    //         swatches: ['#1A1A1A', '#4A4A4A', '#D4956A', '#F0C4A8']
    //       },
    //       {
    //         label: 'Medium Contrast',
    //         value: 'medium',
    //         sub: 'moderate difference between features',
    //         swatches: ['#4A3828', '#7A6858', '#C8956A', '#E8B88A']
    //       },
    //       {
    //         label: 'Low Contrast',
    //         value: 'low',
    //         sub: 'hair, eyes and skin are similar in depth',
    //         swatches: ['#8A7060', '#A89080', '#C8A888', '#E0C8A8']
    //       },
    //     ]
    // },
    // {
    //     id: 'color_confirm',
    //     question: 'Which of these colors has someone complimented you in?',
    //     subtitle: 'This helps us confirm your season',
    //     multi: true,
    //     options: [
    //       { label: 'Coral / Orange-red', value: 'coral' },
    //       { label: 'Warm camel / tan', value: 'camel' },
    //       { label: 'Emerald green', value: 'emerald' },
    //       { label: 'Dusty rose / mauve', value: 'mauve' },
    //       { label: 'Lavender / purple', value: 'lavender' },
    //       { label: 'Rust / burnt orange', value: 'rust' },
    //       { label: 'Navy / royal blue', value: 'navy' },
    //       { label: 'Bright warm yellow', value: 'yellow' },
    //     ]
    // },
    // {
    //     id: 'known_shade',
    //     question: 'Do you know your shade in any of these brands?',
    //     subtitle: 'This helps us match you across brands instantly',
    //     options: [
    //       { label: 'Fenty Beauty', value: 'fenty' },
    //       { label: 'MAC Cosmetics', value: 'mac' },
    //       { label: 'NARS', value: 'nars' },
    //       { label: 'Maybelline', value: 'maybelline' },
    //       { label: 'Charlotte Tilbury', value: 'charlottetilbury' },
    //       { label: 'Skip for now', value: 'skip' },
    //     ]
    // },
    // {
    //     id: 'quality',
    //     question: 'What matters most in a dupe?',
    //     subtitle: 'We\'ll filter based on your preferences',
    //     multi: true,
    //     options: [
    //         {label: 'Looks identical', value: 'identical'},
    //         {label: 'Same quality feel', value: 'quality'},
    //         {label: 'Just needs to be cheap', value: 'cheap'},
    //         {label: 'Ethical & sustainable', value: 'ethical'},
    //     ]
    // },
    // {
    //     id: 'shopping',
    //     question: 'How do you usually shop?',
    //     subtitle: '',
    //     options: [
    //         {label: 'Wait for sales', value: 'wait'},
    //         {label: 'Buy immediately if I love it', value: 'immediate'},
    //         {label: 'Research for weeks', value: 'research'},
    //         {label: 'Impulse buyer', value: 'impulse'},
    //     ]
    // },
    // {
    //     id: 'sustainability',
    //     question: 'How important is sustainability?',
    //     subtitle: 'We\'ll add an ethical filter to your results',
    //     options: [
    //         {label: 'Very important', value: 'eco_high'},
    //         {label: 'Somewhat', value: 'eco_mid'},
    //         {label: 'Not a priority', value: 'eco_low'},
    //     ]
    // },
    // {
    //     id: 'trends',
    //     question: 'Your relationship with trends',
    //     subtitle: '',
    //     options: [
    //         {label: 'I set them', value: 'follow_low'},
    //         {label: 'I follow them fast', value: 'follow_high'},
    //         {label: 'I wait and see', value: 'follow_wait'},
    //         {label: 'I ignore them', value: 'follow_no'},
    //     ]
    // }
]
export default function Quiz() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState({})
    const [selected, setSelected] = useState([])
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [shadeInput, setShadeInput] = useState('')
    const current = questions[step]
    const isLast = step === questions.length - 1
    const progress = ((step) / questions.length) * 100

    function toggleOption(value) {
        if(current.multi) {
            setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
        }
        else {
            setSelected([value])
            setTimeout(async () => await advance([value]), 300)
        }
    }
    async function advance(overrideSelected) {
        const vals = overrideSelected || selected
        setAnswers(prev => ({...prev, [current.id]: vals}))
        setSelected([])
        if(isLast) {
            const finalAnswers = {...answers, [current.id]: vals}
            const season = calcSeasonProfile(
                finalAnswers.undertone?.[0],
                finalAnswers.skin_depth?.[0],
                finalAnswers.contrast?.[0],
                finalAnswers.color_confirm || []
            )
            const knownShades = {}
            const shadeAnswer = finalAnswers.known_shade?.[0]
            if(shadeAnswer && shadeAnswer !== 'skip' && shadeAnswer.includes(':')) {
                const [brand, shade] = shadeAnswer.split(':')
                knownShades[brand] = shade
            }
            localStorage.setItem('styleProfile', JSON.stringify({
                ...finalAnswers,
                colorSeason: season.primary,
                secondarySeasons: season.secondaries,
                allSeasons: [season.primary, ...season.secondaries],
                knownShades
            }))
            const { data: {user}} = await supabase.auth.getUser()
            if(user) {
                await supabase.from('profiles').upsert({
                    id: user.id,
                    skin_depth: finalAnswers.skin_depth?.[0],
                    undertone: finalAnswers.undertone?.[0],
                    color_season: season,
                    known_shades: knownShades,
                    style_profile: finalAnswers,
                    updated_at: new Date().toISOString()
                })
            }
            router.push('/?onboarded=true')
        } else {
            setStep(s => s + 1)
        }
    }
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            <div className="fixed top-16 left-0 right-0 h-1 bg-zinc-800">
                <div className="h-full bg-white transition-all duration-500" style={{width: `${progress}%`}}/>
            </div>
            <p className="text-zinc-500 text-sm mb-4">
                {step + 1} of {questions.length}
            </p>
            <h2 className="text-3xl font-bold text-center mb-2">{current.question}</h2>
            <p className="text-zinc-400 text-sm mb-10 text-center">{current.subtitle}</p>
            {current.visual ? (
  <div className="flex flex-col w-full max-w-lg gap-3">
    {current.options.map(opt => {
      const isActive = selected.includes(opt.value)
      return (
        <button
          key={opt.value}
          onClick={() => toggleOption(opt.value)}
          className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${
            isActive
              ? 'border-white bg-zinc-800'
              : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
          }`}
        >
          {/* Swatch Row */}
          <div className="flex gap-1 flex-shrink-0">
            {opt.swatches.map((hex, i) => (
              <div
                key={i}
                className="rounded-lg"
                style={{
                  backgroundColor: hex,
                  width: '32px',
                  height: '48px',
                  borderRadius: i === 0 ? '8px 4px 4px 8px' : i === opt.swatches.length - 1 ? '4px 8px 8px 4px' : '4px'
                }}
              />
            ))}
          </div>

          {/* Label */}
          <div className="text-left flex-1">
            <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-300'}`}>
              {opt.label}
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">{opt.sub}</p>
          </div>

          {/* Selected check */}
          {isActive && (
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-black text-xs font-bold">✓</span>
            </div>
          )}
        </button>
      )
    })}
  </div>
) : current.id === 'known_shade' && selectedBrand ? (
            <div className="w-full max-w-md">
                <p className="text-zinc-400 text-sm mb-4 text-center">
                What is your shade in {selectedBrand}?
                </p>
                <input
                type="text"
                placeholder="e.g. 230N, NC25, Vanilla..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition mb-4"
                value={shadeInput}
                onChange={e => setShadeInput(e.target.value)}
                />
                <button
                onClick={() => {
                    advance([`${selectedBrand}:${shadeInput}`])
                    setSelectedBrand(null)
                    setShadeInput('')
                }}
                disabled={!shadeInput.trim()}
                className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-30"
                >
                Save My Shade
                </button>
            </div>
            ) : (
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {current.options.map(opt => {
                const isActive = selected.includes(opt.value)
                return (
                    <button
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`flex flex-col gap-1 px-4 py-4 rounded-xl border text-left transition ${
                        isActive
                        ? 'border-white bg-zinc-800 text-white'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
                    }`}
                    >
                    <span className="text-sm font-medium">{opt.label}</span>
                    {opt.sub && (
                        <span className="text-xs text-zinc-500">{opt.sub}</span>
                    )}
                    </button>
                )
                })}
            </div>
            )}
            {current.multi && (
                <button
                    onClick={() => advance()}
                    disabled={selected.length === 0}
                    className="mt-8 bg-white text-black font-semibold px-8 py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    {isLast ? 'See My Dupes →' : 'Next →'}
                </button>
            )}
            {step > 0 && (
                <button
                    onClick={() => setStep(s => s - 1)}
                    className="mt-4 text-zinc-500 text-sm hover:text-white transition"
                >
                    ← Back
                </button>
            )}
        </main>
    )
}