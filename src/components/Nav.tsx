'use client'

import React from "react";
// import { useAccount } from 'wagmi'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Navbar, Button, IconButton, Typography } from "@material-tailwind/react"

export function Nav() {
  const [openNav, setOpenNav] = React.useState(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h3"
          className="mr-4 cursor-pointer py-1.5 font-medium bold"
        >
          Fourby
        </Typography>
        <ConnectButton />
      </div>
    </Navbar>
  )
}