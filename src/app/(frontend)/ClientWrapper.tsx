'use client'

import React, { ReactNode } from 'react'
import { SidebarProvider } from './SidebarContext'
import Navbar from './components/Navbar'

interface ClientWrapperProps {
  children: ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <SidebarProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  )
}
