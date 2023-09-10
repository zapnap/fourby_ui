import { Account } from '../components/Account'
import { Connect } from '../components/Connect'
import { Connected } from '../components/Connected'
import { Minter } from '../components/Minter'
import { NetworkSwitcher } from '../components/NetworkSwitcher'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Page() {
  return (
    <>
      <h1>wagmi + Next.js + Foundry</h1>

      <ConnectButton />

      <Connected>
        <Minter />
      </Connected>
    </>
  )
}

export default Page
