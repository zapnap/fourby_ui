import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'
import * as chains from 'wagmi/chains'

import { contractDeployments } from './src/util/confighelper'

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      deployments: {
        FourbyNFT: contractDeployments(
          "FourbyNFT",
          [chains.optimism.id, chains.base.id, chains.baseGoerli.id, chains.sepolia.id, chains.foundry.id]
        ) as {}
        /*
        FourbyNFT: {
          // [chains.mainnet.id]: '0xf201fFeA8447AB3d43c98Da3349e0749813C9009',
          // [chains.goerli.id]: '0xf201fFeA8447AB3d43c98Da3349e0749813C9009',
          // [chains.sepolia.id]: '0xf201fFeA8447AB3d43c98Da3349e0749813C9009',
          // [chains.foundry.id]: '0xf201fFeA8447AB3d43c98Da3349e0749813C9009',
        },
        */
      },
      project: './contracts',
      artifacts: 'out/',
      forge: {
        rebuild: true,
      },
    }),
    react(),
  ],
})
