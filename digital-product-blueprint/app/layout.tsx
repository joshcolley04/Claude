import type { Metadata } from 'next'
import './globals.css'
import AmbientOrbs from '@/components/AmbientOrbs'
import BeamEffect from '@/components/BeamEffect'
import CursorGlow from '@/components/CursorGlow'

export const metadata: Metadata = {
  title: 'The Digital Product Blueprint™ | Turn Your Audience Into Revenue',
  description:
    'We help creators, influencers and personal brands launch profitable digital products without building them themselves. You bring the audience. We handle everything else.',
  keywords:
    'digital products, creator monetisation, influencer revenue, digital product blueprint, passive income creators',
  authors: [{ name: 'The Digital Product Blueprint™' }],
  openGraph: {
    title: 'The Digital Product Blueprint™ | Turn Your Audience Into Revenue',
    description:
      'We build premium digital products for creators and influencers. You promote. We handle everything else.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'The Digital Product Blueprint™',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Digital Product Blueprint™',
    description:
      'We build premium digital products for creators and influencers. You promote. We handle everything else.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-white antialiased overflow-x-hidden">
        <div className="blueprint-dots" aria-hidden="true" />
        <AmbientOrbs />
        <BeamEffect />
        <CursorGlow />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
