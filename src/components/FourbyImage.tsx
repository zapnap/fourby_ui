"use client"

import { use, useState } from "react"
import { useNetwork, useAccount, useWaitForTransaction } from "wagmi"
import { readContract } from "@wagmi/core"
import { BaseError } from "viem"
import { sanitize } from "dompurify"

import { Card, CardBody, Input, Button, Typography } from "@material-tailwind/react"

import {
  fourbyNftABI,
  fourbyNftAddress,
  useFourbyNftMintTo,
  useFourbyNftTokenUri,
  usePrepareFourbyNftMintTo,
} from "../generated"

interface FourbyImageProps {
  id: string
}

export function FourbyImage({ id }: FourbyImageProps) {
  const [tokenId, setTokenId] = useState(id || "1") // TODO: get latest by default
  const [imageData, setImageData] = useState("")
  const [error, setError] = useState("")
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
      }) as string
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
    const encodedJson = Buffer.from(data.substring(28), "base64").toString();
    const decodedJson = JSON.parse(encodedJson);
    const encodedImage = decodedJson.image
    // data:image/svg+xml;base64,
    return Buffer.from(encodedImage.substring(26), "base64").toString();
  }

  return (
    <div>
      <form className="mt-8 mb-2 w-80">
        <Input
          size="lg"
          label="Token ID"
          crossOrigin="true"
          value={tokenId}
          type="number"
          onChange={(e) => setTokenId(e.target.value)}
        />
        <Button
          className="mt-4"
          disabled={!isValid()}
          onClick={async () => updateImage()}>
            Fetch
        </Button>
      </form>
      <div style={{width: '250px', height: '250px'}}>
        <div dangerouslySetInnerHTML={{__html: sanitize(imageData)}} />
        {error && <p className="text-red-500">ERROR: {error}</p>}
      </div>
    </div>
  )
}
