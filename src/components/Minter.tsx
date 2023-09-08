'use client'

import { useState } from 'react'
import { useNetwork, useAccount, useWaitForTransaction, useContractRead } from 'wagmi'
import DOMPurify from 'dompurify'

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
  const [imageData, setImageData] = useState('')
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const addresses : Record<number, String> = fourbyNftAddress
  const contractAddress = addresses[chain ? chain.id : 1]

  const { data, error, isLoading, isSuccess } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: fourbyNftABI,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
    enabled: Boolean(address),
    onSuccess: (data) => {
      setImageData(DecodeImage(data))
    },
    onError: (error) => {
      setImageData("")
    }
  })

  const DecodeImage = (data: string) => {
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
        onChange={(e) => setTokenId(e.target.value)}
      />
      { error && <div>Error: {error.message}</div> }
      <div style={{width: '250px', height: '250px'}}>
        <div dangerouslySetInnerHTML={{__html: imageData}} />
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
