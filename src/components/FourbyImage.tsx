"use client"

import { useEffect, useState } from "react"
import { useNetwork, useAccount, useWaitForTransaction } from "wagmi"
import { readContract } from "@wagmi/core"
import { BaseError } from "viem"
import { sanitize } from "dompurify"

import { Input, Button, Typography } from "@material-tailwind/react"

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
  const [customTokenId, setCustomTokenId] = useState(id || "0")
  const [imageData, setImageData] = useState("")
  const [error, setError] = useState("")
  const { chain } = useNetwork()

  const isValid = () => {
    return !!Number(customTokenId) && Number(customTokenId) > 0
  }

  const updateImage = async (tokenId:string) => {
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

  const sanitizeSvg = (svg: string) => {
    const sanitized = sanitize(svg)
    return sanitized.replace(/<svg/g, `<svg width="100%"`)
  }

  useEffect(() => {
    setCustomTokenId(id)
    updateImage(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="rounded overflow-hidden md:w-max">
        <div
          dangerouslySetInnerHTML={{__html: sanitizeSvg(imageData)}}
        />
        </div>
        <form className="relative mt-8 mb-2">
          <Input
            size="lg"
            label="Token ID"
            crossOrigin="true"
            value={customTokenId}
            type="number"
            placeholder={id}
            className="peer rounded border px-4 py-2 pr-20 transition-all"
            onChange={(e) => setCustomTokenId(e.target.value)}
          />
          <Button
            disabled={!isValid()}
            className="bg-gray-500 hover:bg-gray-600 !absolute right-1 top-1 z-10 rounded px-4 py-2.5 transition-all"
            onClick={async () => updateImage(customTokenId)}>
              Fetch
          </Button>
        </form>
        {error && <p className="text-red-500">ERROR: {error}</p>}
    </div>
  )
}
