'use client'

import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { config, chains } from '../wagmi'
import { ThemeProvider } from "@material-tailwind/react"
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig config={config}>
      <ThemeProvider>
        <RainbowKitProvider chains={chains}>
          {mounted && children}
        </RainbowKitProvider>
      </ThemeProvider>
    </WagmiConfig>
  )
}
