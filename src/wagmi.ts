import { configureChains, createConfig } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { foundry, sepolia, mainnet } from 'wagmi/chains'
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
// import { InjectedConnector } from 'wagmi/connectors/injected'
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { publicProvider } from 'wagmi/providers/public'

const includeTestNetworks = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_APP_ENV === 'development'
export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(includeTestNetworks ? [sepolia, foundry] : []),
  ],
  [
    publicProvider(),
  ],
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
