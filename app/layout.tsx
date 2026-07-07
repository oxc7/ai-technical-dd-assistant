import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Technical Due Diligence Assistant',
  description:
    'Turn a target company’s technical and business information into a grounded, structured diligence memo — findings, strengths and weaknesses, the best AI path forward, and roll-up fit.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
