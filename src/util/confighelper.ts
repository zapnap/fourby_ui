import type { ContractConfig } from '@wagmi/cli/config'
import { default as fse } from 'fs-extra'

interface DeploymentAddresses {
  [key: number]: ContractConfig['address']
}

export function getContractAddress(name: string, chainId: number):ContractConfig['address'] {
  const filePath = `./contracts/broadcast/${name}.s.sol/${chainId}/run-latest.json`
  if (fse.existsSync(filePath)) {
    const json = fse.readJsonSync(filePath)
    return json.transactions[0].contractAddress
  } else {
    console.log(`WARNING: skipping network ${chainId} because ${filePath} does not exist!`)
    return "0x0"
  }
}

export function contractDeployments(name: string, chains: number[]):DeploymentAddresses {
  const deployments: DeploymentAddresses = {}
  chains.forEach((chainId) => {
    const address = getContractAddress(name, chainId)
    if (address !== "0x0") {
      deployments[chainId] = address
    }
  })
  return deployments
}