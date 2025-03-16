"use client"
import SelfQRcodeWrapper, { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';
import fetchSelfProof from '@/utils/fetchSelfProof'
import submitAuth from '@/utils/submitAuth'
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import abi from "@/abi.json"
import { useUserContext } from "@/app/providers"
import { useEffect } from "react"

function QRCode({userId, isDriver}) {

  const { setAuthed } = useUserContext()

    const { data: hash, writeContract, error, isPending, isError, isIdle, isSuccess } = useWriteContract()

    useEffect(() => {
      console.log(hash)
      setAuthed(isSuccess)
      console.log("confirmed: " + isSuccess + ", error: " + error +", iserror: " + isError + ", pending: " + isPending + ", isIdle: " + isIdle)
    }, [isSuccess, error, isPending, isError, isIdle])

    // const { data: hash, writeContract } = useWriteContract()
    if (!userId) return <div></div>;

    // Create a SelfApp instance using the builder pattern
    const selfApp = new SelfAppBuilder({
      appName: "BirdFeeder",
      scope: 1,
      endpoint: process.env.NEXT_PUBLIC_BACKEND_SERVER + "/callback",
      userId: userId,
      userIdType: "hex",
      // Optional disclosure requirements
      disclosures: {
        ofac: true
      },
    }).build();

    if (isDriver) {
        selfApp.disclosures["date_of_birth"] = 16,
        selfApp.ofac = true
    }

    return (
      <div className="verification-container">
        <h1 className="text-xl text-gray-500 text-center font-bold" >Verify Your Identity</h1>
        <p className="text-l text-gray-500 text-center font-semibold mb-8">Scan this QR code with the Self app to verify your identity</p>
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={async () => {
            // Handle successful verification
            console.log("Verification successful!");
            const data = await fetchSelfProof(userId);
            submitAuth(data, writeContract)
            // Redirect or update UI
          }}
          size={350}
        />
      </div>
    );
}

export default QRCode
