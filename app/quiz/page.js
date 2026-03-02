'use client'
import { useState } from "react"
import { useRouter } from "next/router"

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