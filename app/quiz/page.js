'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"

const questions = [
    {
        id:'budget',
        question: 'What\'s your dupe budget?',
        subtitle: 'We\'ll filter results to your range',
        options: [
            {label: 'Under $25', value: 'budget_low'},
            {label: '$25 - $50', value: 'budget_mid'},
            {label: '$50 - $75', value: 'budget_high'},
            {label: 'No limit', value: 'budget_any'},
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
        id: 'skin',
        question: 'What\'s your skin type?',
        subtitle: 'We\'ll personalize your skincare recommendations',
        options: [
            {label: 'Oily', value: 'oily'},
            {label: 'Dry', value: 'dry'},
            {label: 'Combination', value: 'combination'},
            {label: 'Sensitive', value: 'sensitive'},
        ]
    },
    {
        id: 'quality',
        question: 'What matters most in a dupe?',
        subtitle: 'We\'ll filter based on your preferences',
        multi: true,
        options: [
            {label: 'Looks identical', value: 'identical'},
            {label: 'Same quality feel', value: 'quality'},
            {label: 'Just needs to be cheap', value: 'cheap'},
            {label: 'Ethical & sustainable', value: 'ethical'},
        ]
    },
    {
        id: 'shopping',
        question: 'How do you usually shop?',
        subtitle: '',
        options: [
            {label: 'Wait for sales', value: 'wait'},
            {label: 'Buy immediately if I love it', value: 'immediate'},
            {label: 'Research for weeks', value: 'research'},
            {label: 'Impulse buyer', value: 'impulse'},
        ]
    },
    {
        id: 'sustainability',
        question: 'How important is sustainability?',
        subtitle: 'We\'ll add an ethical filter to your results',
        options: [
            {label: 'Very important', value: 'eco_high'},
            {label: 'Somewhat', value: 'eco_mid'},
            {label: 'Not a priority', value: 'eco_low'},
        ]
    },
    {
        id: 'trends',
        question: 'Your relationship with trends',
        subtitle: '',
        options: [
            {label: 'I set them', value: 'follow_low'},
            {label: 'I follow them fast', value: 'follow_high'},
            {label: 'I wait and see', value: 'follow_wait'},
            {label: 'I ignore them', value: 'follow_no'},
        ]
    }
]
export default function Quiz() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState({})
    const [selected, setSelected] = useState([])

    const current = questions[step]
    const isLast = step === questions.length - 1
    const progress = ((step) / questions.length) * 100

    function toggleOption(value) {
        if(current.multi) {
            setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
        }
        else {
            setSelected([value])
            setTimeout(() => advance([value]), 300)
        }
    }
    function advance(overrideSelected) {
        const vals = overrideSelected || selected
        setAnswers(prev => ({...prev, [current.id]: vals}))
        setSelected([])
        if(isLast) {
            const finalAnswers = {...answers, [current.id]: vals}
            localStorage.setItem('styleProfile', JSON.stringify(finalAnswers))
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
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {current.options.map(opt => {
                    const isActive = selected.includes(opt.value)
                    return (
                        <button
                            key={opt.value}
                            onClick={() => toggleOption(opt.value)}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition ${
                                isActive
                                  ? 'border-white bg-zinc-800 text-white'
                                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
                            }`}
                        >
                            <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                    )
                })}
            </div>
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