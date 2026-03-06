import '../styles/globals.css'
import type { Metadata } from 'next'
// next/font/google removed — CSS variables are defined in globals.css so the
// app works fully offline (Turbopack re-downloads fonts on every dev render).
import { AuthProvider } from '@/contexts/AuthContext'
// ─── Add new provider imports directly below this line ────────────────────────
// e.g.  import { ThemeProvider } from '@/contexts/ThemeContext'
// ──────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Serendib AI - AI-Powered Marketing Optimizer',
  description: 'AI-powered marketing optimization platform with strategy recommendations, content generation, and campaign predictions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {/* ── AuthProvider (Smart-Assistant auth) ── owns: src/app/auth/, src/contexts/AuthContext.tsx ── */}
        <AuthProvider>
          {/* ── Add other team providers as siblings or nested here ── */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}