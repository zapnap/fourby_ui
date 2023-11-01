'use client'

import React from "react";
// import { useAccount } from 'wagmi'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Navbar, Button, IconButton, Typography } from "@material-tailwind/react"
import Image from "next/image"

export function Nav() {
  const [openNav, setOpenNav] = React.useState(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-white shadow">
      <div className="flex container mx-auto items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h3"
          className="mr-4 cursor-pointer py-1.5 font-medium bold"
        >
          <Image
            src="/images/logo.png"
            width={40}
            height={40}
            alt="fourby"
            className="inline-block mr-1"
          />
          <div
            className="logo inline-block align-middle"
          >
            fourby
          </div>
        </Typography>
        <ConnectButton />
      </div>
    </Navbar>
  )
}