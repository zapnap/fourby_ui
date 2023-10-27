"use client"

import { useRef, useState, useEffect } from "react"

import toast, { Toaster } from "react-hot-toast"
import { toastOptions } from "../util/toasthelper"

import { BaseError, decodeEventLog, formatEther } from "viem"
import { useNetwork, useAccount, useBlockNumber, useWaitForTransaction } from "wagmi"
 
import { Button, Card, CardBody, Typography } from "@material-tailwind/react"

import { Connected } from "../components/Connected"
import { FourbyImage } from "../components/FourbyImage"

import {
  useFourbyNftMintTo,
  usePrepareFourbyNftMintTo,
  useFourbyNftCurrentTokenId,
  fourbyNftABI,
  useFourbyNftMintEnded,
  useFourbyNftMintPrice,
  useFourbyNftEditionSize,
  useFourbyNftMintLastBlock,
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
  const [mintReady, setMintReady] = useState({ enabled: false, loading: true })
  const [mintPrice, setMintPrice] = useState(0)
  const [mintLimit, setMintLimit] = useState(0)
  const [mintLastBlock, setMintLastBlock] = useState(0)
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  useFourbyNftMintEnded({
    onSuccess: (data) => {
      setMintReady({ enabled: !data, loading: false })
      if (data) {
        toast.error(<span>Sorry! Minting has ended</span>)
      }
    }
  })
  useFourbyNftMintPrice({
    onSuccess: (data) => {
      setMintPrice(Number(data)) // wei
    }
  })
  useFourbyNftEditionSize({
    onSuccess: (data) => {
      setMintLimit(Number(data))
    }
  })
  useFourbyNftMintLastBlock({
    onSuccess: (data) => {
      setMintLastBlock(Number(data))
    }
  })
  useFourbyNftCurrentTokenId({
    // args: [],
    onSuccess: (data) => {
      setMintState({ id: String(Number(data)) })
    }
  })

  const { config } = usePrepareFourbyNftMintTo({
    args: [address as `0x${string}`],
    value: BigInt(mintPrice),
  })
  const {
    data: mintData,
    isError: isMintError,
    error: mintError,
    isLoading: isMintLoading,
    isSuccess: isMintSuccess,
    write: mint,
  } = useFourbyNftMintTo(config)

  const {
    isSuccess: isWaitForTransactionSuccess,
    data: waitForTransactionData,
  } = useWaitForTransaction({
    hash: mintData?.hash as `0x${string}`,
  })

  useEffect(() => {
    if (isMintLoading) {
      txToastId.current = toast.loading(<ProcessingMessage loading={true} hash={mintData?.hash} />, { id: txToastId.current })
    } else if (isMintError) {
      txToastId.current = toast.error(<ProcessingMessage error={(mintError as BaseError)?.shortMessage} hash={mintData?.hash} />, { id: txToastId.current })
    // } else if (isMintSuccess) {
    } else if (isWaitForTransactionSuccess) {
      txToastId.current = toast.success(<ProcessingMessage success={true} hash={mintData?.hash} />, { id: txToastId.current })
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
  }, [isMintLoading, isMintError, isMintSuccess, isWaitForTransactionSuccess, waitForTransactionData]) // eslint-disable-line react-hooks/exhaustive-deps

  function openExplorer(baseUrl: string, hash: `0x${string}` | undefined) {
    const url = hash ? `${baseUrl}/tx/${hash}` : baseUrl
    window.open(url, "_blank")
  }

  function blocksRemaining() {
    const currentBlock = Number(blockNumber)
    if (mintLastBlock !== 0 && currentBlock !== 0 && mintLastBlock > currentBlock) {
      return mintLastBlock - currentBlock
    } else {
      return 0
    }
  }

  function mintsRemaining() {
    return mintLimit - Number(mintState.id)
  }

  function mintCountLimited() {
    return mintLimit !== 0
  }

  function mintTimeLimited() {
    return mintLastBlock !== 0
  }

  function mintEnded() {
    if (!mintReady.loading && !mintReady.enabled) {
      return true
    } else if (mintTimeLimited() && blocksRemaining() === 0) {
      return true
    } else if (mintCountLimited() && mintsRemaining() === 0) {
      return true
    } else {
      return false
    }
  }

  function ProcessingMessage({ success, loading, error, hash }: { success?: boolean, loading?: boolean, error?: String, hash?: `0x${string}` }) {
    const etherscan = chain?.blockExplorers?.etherscan
    if (error) {
      console.log(error)
    }
    return (
      <span>
        {loading &&
          <span>Processing transaction</span>
        }
        {error !== "" &&
          <span>{error}</span>
        }
        {success &&
          <span>Transaction confirmed</span>
        }
        {etherscan && hash && (
          <Button
            className="ml-2"
            color="light-blue"
            size="sm"
            onClick={() => openExplorer(etherscan.url, hash)}>
            View ↗
          </Button>
        )}
      </span>
    )
  }

  return (
    <div>
      <Connected>
        <div className="grid grid-cols-2 md:grid-cols-3">
          <div className="break-inside-avoid-column col-start-1 col-span-1 md:col-span-2">
            <Card color="transparent" shadow={false}>
              <CardBody>
                <Typography variant="h4" color="blue-gray">
                  Fourby - An NFT Project
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  A generative art project with a pleasing color palette and dynamic elements to document changes in transaction costs over the course of the mint. Assets are built via SVG and stored 100% on-chain.
                </Typography>
                <Button
                  className="mt-4"
                  color="light-blue"
                  disabled={isMintLoading || mintReady.loading || mintEnded()}
                  onClick={() => mint?.()}>
                    Mint
                    {mintPrice > 0 &&
                      <span> &mdash; {formatEther(BigInt(mintPrice))} ETH</span>
                      ||
                      <span> for free</span>
                    }
                </Button>

                <div className="flex gap-2 mt-8 italic">
                  <div>
                    {mintState.id}
                    {mintCountLimited() &&
                      <span> / {mintLimit}</span>
                    }
                    <span> minted.</span>
                  </div>
                  {!mintEnded() && mintTimeLimited() &&
                    <div>
                      <span>
                        {blocksRemaining()} blocks remaining.
                      </span>
                    </div>
                  }
                  {mintEnded() &&
                    <div className="text-red-500">
                      Minting has ended.
                    </div>
                  }
                </div>
              </CardBody>
            </Card>
          </div>
          {mintState.id !== "0" &&
            <div className="break-inside-avoid-column col-start-2 md:col-start-3">
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
