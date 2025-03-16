import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import abi from "@/abi.json"

const submitAuth = ({proof, publicSignals}, writeContract) => {

  console.log("writing")
  writeContract({
    address: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
    abi: abi.abi,
    functionName: "verifySelfProof",
    args: [{
      a: proof.a,
      b: [
        [proof.b[0][1], proof.b[0][0]],
        [proof.b[1][1], proof.b[1][0]],
      ],
      c: proof.c,
      pubSignals: publicSignals,
  }]
  })

}

export default submitAuth