import "@rainbow-me/rainbowkit/styles.css"
import "../styles/globals.css"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Providers } from "./providers"
import { Nav } from "../components/Nav"

export const metadata = {
  title: "Fourby",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ backgroundImage: `url(/images/stripes-light.webp)`}}>
        <Providers>
          <Nav></Nav>
          <section className="mx-auto container py-2 lg:py-4">
            <section>
              {children}
            </section>
          </section>
        </Providers>
      </body>
    </html>
  )
}
