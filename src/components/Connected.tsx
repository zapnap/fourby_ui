'use client'

import type { ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardBody, CardFooter, Button, Typography } from '@material-tailwind/react'

export function Connected({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
        <Card className="w-1/2 mt-10 px-4 py-4">
          <CardBody>
            <Typography variant="h4" className="mb-2">
              Connection Required
            </Typography>
            <Typography variant="paragraph" className="mb-4 font-normal">
              Fourby is a generative art project with a pleasing color palette and dynamic elements that document changes in transaction costs over the course of the mint. Assets are constructed via SVG and stored 100% on-chain.
            </Typography>
            <Typography variant="paragraph" className="font-normal">
              Want to mint one? Connect your wallet to get started.
            </Typography>
          </CardBody>
        </Card>
      </div>
    )
  } else {
    return <>{children}</>
  }
}
