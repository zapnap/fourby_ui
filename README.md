# Fourby UI

Fourby is a simple generative art project with a pleasing color palette and dynamic elements to document changes in transaction costs over the course of the mint. Assets are built via SVG and stored 100% on-chain.

This frontend is a [Next.js](https://nextjs.org) + [Foundry](https://book.getfoundry.sh/) + [wagmi](https://wagmi.sh) project bootstrapped with [`create-wagmi`](https://github.com/wagmi-dev/wagmi/tree/main/packages/create-wagmi). It also includes [RainbowKit](https://www.rainbowkit.com/) for wallet management and several other goodies.

## Prerequisites

Install [Foundry](https://book.getfoundry.sh/getting-started/installation) in order to build your smart contracts. This can be done by running the following command:

```
curl -L https://foundry.paradigm.xyz | bash
```

To customize your environment, set up your local `.env`. An example has been provided in `.env.example`. At minimum, you'll want to set up the Forge private key and RPC URL. You should also set up a [WalletConnect Cloud](https://cloud.walletconnect.com/) project ID and an [EtherScan API Key](https://info.etherscan.com/api-keys/) at this time.

## Variables

Limited edition vs open edition? Set `EDITION_SIZE`.
Time-limited mint? Set `BLOCKS_TO_MINT` (216000 = ~30d).
Free vs paid mint? Set `MINT_PRICE` (in wei).

## Developing with Foundry

Run `npm run dev:foundry` in your terminal to start. This starts a Next.js dev server and starts `@wagmi/cli` in watch mode. It also starts an Anvil local development node.

To compile and deploy contracts (in `./contracts`) to the Anvil node, run `npm run deploy:anvil`.

Once you've done both of these things, you should be able to open [localhost:3000](http://localhost:3000) in your browser, connect a wallet, and mint an NFT using one of the test accounts that Foundry provides for you (check Anvil output and import the private key into your web wallet).

## Deployment

To deploy your contracts to Sepolia, run `npm run deploy:sepolia`. You'll need to first ensure that your `.env` file has the appropriate values set. You can create a free account with [Alchemy](https://www.alchemy.com/) and set the RPC URL to your project there (make sure to also add the API key).

Support for various production blockchains can be added by making a few small adjustments. Add targets to `package.jsoon` and make sure the appropriate variables exist in your environment.

For frontend hosting, [Vercel](https://vercel.com) is a good choice. After setting up an account and installing their CLI, you can simply run the `vercel` command in the top level directory to deploy a copy of the frontend. Just make sure you deploy the contract first, as the contract address will be cached locally in the config.

One last note: You'll want to set `NEXT_PUBLIC_APP_ENV=development` if you want testnets to show up in a staging/preview deployment.

## Learn more

- [Foundry Documentation](https://book.getfoundry.sh/)
- [wagmi Documentation](https://wagmi.sh)
- [wagmi Examples](https://wagmi.sh/examples/connect-wallet)
- [@wagmi/cli Documentation](https://wagmi.sh/cli)
- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit](https://www.rainbowkit.com/)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [EtherScan API Keys](https://info.etherscan.com/api-keys/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material Tailwind](https://www.material-tailwind.com/)
