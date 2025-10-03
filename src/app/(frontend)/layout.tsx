// src/app/(frontend)/layout.tsx

import { AuthProvider } from '../../_providers/Auth'
import React, { ReactNode } from 'react'
import ClientWrapper from './ClientWrapper'
import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

// 🔹 SEO metadata completely removed

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
