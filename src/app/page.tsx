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
  useFourbyNftCurrentTokenId,
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
  const [mintState, setMintState] = useState({ id: "0" })
  const { address } = useAccount()
  const { chain } = useNetwork()

  useFourbyNftCurrentTokenId({
    args: [],
    onSuccess: (data) => {
      setMintState({ id: String(Number(data)) })
    }
  })

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
  } = useFourbyNftMintTo(config)

  useEffect(() => {
    if (isMintLoading) {
      txToastId.current = toast.loading(<ProcessingMessage loading={true} hash={mintData?.hash} />, { id: txToastId.current })
    } else if (isMintError) {
      txToastId.current = toast.error(<ProcessingMessage error={(mintError as BaseError)?.shortMessage} hash={mintData?.hash} />, { id: txToastId.current })
    } else if (isMintSuccess) {
      txToastId.current = toast.success(<ProcessingMessage success={true} hash={mintData?.hash} />, { id: txToastId.current })
    }
  }, [isMintLoading, isMintError, isMintSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    isSuccess: waitForTransactionSuccess,
    data: waitForTransactionData,
  } = useWaitForTransaction({ hash: mintData?.hash as `0x${string}` })

  useEffect(() => {
    if (waitForTransactionSuccess) {
      waitForTransactionData?.logs.forEach((log) => {
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
    }
  }, [waitForTransactionSuccess, waitForTransactionData]) // eslint-disable-line react-hooks/exhaustive-deps

  function ProcessingMessage({ success, loading, error, hash }: { success?: boolean, loading?: boolean, error?: String, hash?: `0x${string}` }) {
    const etherscan = chain?.blockExplorers?.etherscan
    return (
      <span>
        {loading &&
          <span>Processing transaction...{' '}</span>
        }
        {error !== "" &&
          <span>{error}{' '}</span>
        }
        {success &&
          <span>Transaction confirmed{' '}</span>
        }
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
                  A generative art project with a pleasing color palette and dynamic elements to document changes in transaction costs over the course of the mint. Assets are built via SVG and stored 100% on-chain.
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
          {mintState.id !== "0" &&
            <div className="break-inside-avoid-column">
              <Card color="transparent" shadow={false}>
                <CardBody>
                  <FourbyImage id={mintState.id} />
                </CardBody>
              </Card>
            </div>
          }
        </div>
      </Connected>
      <Toaster toastOptions={toastOptions}/>
    </div>
  )
}
