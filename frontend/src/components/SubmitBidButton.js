import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import abi from "@/abi.json"
import { useUserContext } from "@/app/providers"
import { useEffect, useState } from "react"

const SubmitBidButton = () => {

      const [bidAmount, setBidAmount] = useState(0)

      const { data: hash, writeContract, error, isPending, isError, isIdle, isSuccess } = useWriteContract()

      useEffect(() => {
        console.log("confirmed: " + isSuccess + ", error: " + error +", iserror: " + isError + ", pending: " + isPending + ", isIdle: " + isIdle)
      }, [isSuccess, error, isPending, isError, isIdle])

      return (
        <form onSubmit={(e) => {
          e.preventDefault()

          writeContract({
            address: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
            abi: abi.abi,
            functionName: "placeOrder",
            args: [bidAmount, ""]
          })
        }}>
          <input value={bidAmount} onChange={(e) => {
            setBidAmount(e.target.value)
          }} />
          <button type="submit">
            Submit bid
          </button>
        </form>
      )
}

export default SubmitBidButton