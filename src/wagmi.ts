import { ChainProviderFn, configureChains, createConfig } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { mainnet, foundry, sepolia, optimism, base, baseGoerli, Chain } from 'wagmi/chains'
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
// import { InjectedConnector } from 'wagmi/connectors/injected'
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { fourbyNftAddress } from "./generated"

const testNetworks: Chain[] = []
if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_APP_ENV === 'development') {
  testNetworks.push(baseGoerli)
  testNetworks.push(sepolia)
}
if (process.env.NODE_ENV === 'development') {
  testNetworks.push(foundry)
}

const rpcProviders: ChainProviderFn<any>[] = []
if (process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
  rpcProviders.push(alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }))
}
rpcProviders.push(publicProvider())

const availableNetworks = [mainnet, optimism, base, ...testNetworks]

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  availableNetworks.filter((chain) => (fourbyNftAddress[chain.id] !== undefined)),
  rpcProviders,
)

/*
const connectors = [
  new MetaMaskConnector({ chains }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'wagmi',
    },
  }),
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
]
*/

const { connectors } = getDefaultWallets({
  appName: 'Fourby',
  projectId: String(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID),
  chains
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})
