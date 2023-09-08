import { Account } from '../components/Account'
import { Connect } from '../components/Connect'
import { Connected } from '../components/Connected'
import { Minter } from '../components/Minter'
import { NetworkSwitcher } from '../components/NetworkSwitcher'

export function Page() {
  return (
    <>
      <h1>wagmi + Next.js + Foundry</h1>

      <Connect />

      <Connected>
        <Account />
        <hr />
        <Minter />
        <hr />
        <NetworkSwitcher />
      </Connected>
    </>
  )
}

export default Page
