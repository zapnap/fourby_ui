"use client"

import { useState } from "react"
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
    const encodedJson = Buffer.from(data.substring(28), "base64").toString();
    const decodedJson = JSON.parse(encodedJson);
    const encodedImage = decodedJson.image
    // data:image/svg+xml;base64,
    return Buffer.from(encodedImage.substring(26), "base64").toString();
  }

  return (
    <Card color="transparent" shadow={false}>
      <CardBody>
        <Typography variant="h4" color="blue-gray">
          Hello Sers
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Wanna look up Fourby token art?
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
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
      </CardBody>
    </Card>
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
