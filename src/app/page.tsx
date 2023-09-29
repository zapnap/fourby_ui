"use client"

import { use, useRef, useState, useEffect } from "react"

import toast, { Toaster } from "react-hot-toast"
import { toastOptions } from "../util/toasthelper"

import { BaseError, decodeEventLog } from "viem"
import { useNetwork, useAccount, useWaitForTransaction } from "wagmi"
import { waitForTransaction } from "@wagmi/core"
import type { TransactionReceipt } from "viem"

import { Button, Card, CardBody, Typography } from "@material-tailwind/react"

import { Connected } from "../components/Connected"
import { FourbyImage } from "../components/FourbyImage"

import {
  useFourbyNftMintTo,
  usePrepareFourbyNftMintTo,
  useFourbyNftTokenUri,
  useFourbyNftEvent,
  fourbyNftAddress,
  fourbyNftABI,
} from "../generated"

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const txToastId = useRef("")
  const [mintState, setMintState] = useState({ id: "1" })
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { config } = usePrepareFourbyNftMintTo({
    args: [address],
    onError: (err) => {
      console.log(err)
      toast.error((err as BaseError)?.shortMessage)
    }
  })
  const {
    data: mintData,
    isError: isMintError,
    error: mintError,
    isLoading: isMintLoading,
    isSuccess: isMintSuccess,
    write: mint,
  } = useFourbyNftMintTo({
    ...config,
    onSuccess: (data) => {
      txToastId.current = toast.loading("Waiting for transaction confirmation...")
    },
    onError: (err) => {
      console.log(err)
      toast.error((err as BaseError)?.shortMessage)
    },
  })
  /*
  const { refetch } = useFourbyNftTokenUri({
    args: [BigInt(1)],
  })
  */

  useWaitForTransaction({
    hash: mintData?.hash as `0x${string}`,
    confirmations: 1,
    onSuccess: (data) => {
      data.logs.forEach((log) => {
        const decodedLog = decodeEventLog({
          abi: fourbyNftABI,
          data: log.data,
          topics: log.topics,
        })
        const args = decodedLog.args as any
        if (decodedLog.eventName === "Transfer" && args.to === address) {
          setMintState(mintState => ({
            ...mintState,
            id: String(Number(args.id))
          }))
        }
      })
      toast.success("Transaction confirmed", { id: txToastId.current })
    }
  })

  function ProcessingMessage({ hash }: { hash?: `0x${string}` }) {
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

  return (
    <div>
      <Connected>
        <div className="columns-2">
          <div className="break-inside-avoid-column">
            <Card color="transparent" shadow={false}>
              <CardBody>
                <Typography variant="h4" color="blue-gray">
                  Fourby - An NFT Project
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed euismod nisi porta lorem.
                </Typography>
                <Button
                  className="mt-4 bg-indigo-500 hover:bg-indigo-600"
                  disabled={isMintLoading}
                  onClick={() => mint?.()}>
                    Mint
                </Button>
              </CardBody>
            </Card>
          </div>
          <div className="break-inside-avoid-column">
            <Card color="transparent" shadow={false}>
              <CardBody>
                <FourbyImage id={mintState.id} />
              </CardBody>
            </Card>
          </div>
        </div>
      </Connected>
      <Toaster toastOptions={toastOptions}/>
    </div>
  )
}
