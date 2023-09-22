"use client"

import { use, useEffect } from "react"

import toast, { Toaster } from "react-hot-toast"
import { toastOptions } from "../util/toasthelper"

import { BaseError } from "viem"
import { useNetwork, useAccount, useWaitForTransaction } from "wagmi"
import type { TransactionReceipt } from "viem"

import { Button, Card, CardBody, Typography } from "@material-tailwind/react"

import { Connected } from "../components/Connected"
import { FourbyImage } from "../components/FourbyImage"

import {
  useFourbyNftMintTo,
  useFourbyNftTokenUri,
  usePrepareFourbyNftMintTo,
} from "../generated"

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { config, error, isError } = usePrepareFourbyNftMintTo({
    args: [address],
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
    // onError: (error) => {
      // console.log(error)
      // toast.error((error as BaseError)?.shortMessage)
    // },
  })
  const { refetch } = useFourbyNftTokenUri({
    args: [BigInt(1)],
  })
  const { isLoading } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: (data:TransactionReceipt) => {
      console.log(data)
      toast.success(ProcessingMessage({ hash: data?.transactionHash}))
      // refetch()
    }
  })

  useEffect(() => {
    if (isError) {
      console.log(error)
      toast.error((error as BaseError)?.shortMessage)
    }
  }, [isError, error])

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
                  onClick={async () => mint?.()}>
                    Mint
                </Button>
              </CardBody>
            </Card>
          </div>
          <div className="break-inside-avoid-column">
            <Card color="transparent" shadow={false}>
              <CardBody>
                <FourbyImage id="1" />
              </CardBody>
            </Card>
          </div>
        </div>
      </Connected>
      <Toaster toastOptions={toastOptions}/>
    </div>
  )
}
