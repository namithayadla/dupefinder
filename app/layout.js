import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import SyftBubble from '@/components/SyftBubble'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DupeFinder — Find Fashion & Beauty Dupes',
  description: 'Find verified dupes for fashion and beauty products instantly.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <Navbar />
        <SyftBubble />
        <div className="pt-16"> {/* pushes content below fixed navbar */}
          {children}
        </div>
      </body>
    </html>
  )
}