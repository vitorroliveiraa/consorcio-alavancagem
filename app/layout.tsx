import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Simulador de Consorcio | Analise Financeira',
  description: 'Simulador financeiro para analise de cenarios de consorcio com visualizacao de alavancagem, lucro e ROI.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',

  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function removeBadge() {
                  document.querySelectorAll('a[href*="v0.dev"], a[href*="v0.app"], [class*="v0-"], [id*="v0-"]').forEach(function(el) {
                    el.remove();
                  });
                }
                removeBadge();
                var observer = new MutationObserver(function() { removeBadge(); });
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
