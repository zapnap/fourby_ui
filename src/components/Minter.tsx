'use client'

import { useState } from 'react'
import { useNetwork, useAccount, useWaitForTransaction } from 'wagmi'
import { readContract } from '@wagmi/core'
import { BaseError } from 'viem'
import { sanitize } from 'dompurify'

import {
  fourbyNftABI,
  fourbyNftAddress,
  useFourbyNftMintTo,
  useFourbyNftTokenUri,
  usePrepareFourbyNftMintTo,
} from '../generated'

export function Minter() {
  return (
    <div>
      <ShowImage />
    </div>
  )
}

export function ShowImage() {
  const [tokenId, setTokenId] = useState("1")
  const [imageData, setImageData] = useState("")
  const [error, setError] = useState("")
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const isValid = () => {
    return !!Number(tokenId) && Number(tokenId) > 0
  }

  const updateImage = async () => {
    const addresses : Record<number, String> = fourbyNftAddress
    const contractAddress = addresses[chain ? chain.id : 1]

    try {
      const data = await readContract({
        address: contractAddress as `0x${string}`,
        abi: fourbyNftABI,
        functionName: "tokenURI",
        args: [BigInt(tokenId)]
      })
      setImageData(decodeImage(data))
      setError("")
    } catch (e) {
      console.log(e)
      setImageData("")
      setError((e as BaseError)?.shortMessage)
    }
  }

  const decodeImage = (data: string) => {
    // data:application/json;base64
    const encodedJson = atob(data.substring(28));
    const decodedJson = JSON.parse(encodedJson);
    const encodedImage = decodedJson.image
    // data:image/svg+xml;base64,
    return atob(encodedImage.substring(26));
  }

  return (
    <div>
      <input
        value={tokenId}
        type="number"
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button disabled={!isValid()} onClick={async () => updateImage()}>Fetch</button>
      <div style={{width: '250px', height: '250px'}}>
        <div dangerouslySetInnerHTML={{__html: sanitize(imageData)}} />
        {error && <div><strong>ERROR:</strong> {error}</div>}
      </div>
    </div>
  )
}

function ProcessingMessage({ hash }: { hash?: `0x${string}` }) {
  const { chain } = useNetwork()
  const etherscan = chain?.blockExplorers?.etherscan
  return (
    <span>
      Processing transaction...{' '}
      {etherscan && (
        <a href={`${etherscan.url}/tx/${hash}`}>{etherscan.name}</a>
      )}
    </span>
  )
}
