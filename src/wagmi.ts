import { configureChains, createConfig } from 'wagmi'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { foundry, sepolia, mainnet } from 'wagmi/chains'
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
// import { InjectedConnector } from 'wagmi/connectors/injected'
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { publicProvider } from 'wagmi/providers/public'

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(process.env.NODE_ENV === 'development' ? [sepolia, foundry] : []),
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
