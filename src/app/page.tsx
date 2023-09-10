import { Connected } from "../components/Connected"
import { Minter } from "../components/Minter"

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <Connected>
      <Minter />
    </Connected>
  )
}