"use client"

import { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from "next/dynamic";
import WalletLogin from '@/components/WalletLogin'
import { getAccount } from "@wagmi/core";
import { wagmiConfig, useUserContext } from "@/app/providers"
import { useOnchainKit } from '@coinbase/onchainkit'

function Home () {
  const { userId, setUserId } = useUserContext();
  const [isDriver, setIsDriver] = useState(false);
  const { sessionId } = useOnchainKit()

  useEffect(() => {
    console.log("re", sessionId, address)
    const account = getAccount(wagmiConfig)
    if(account.address) {
      setUserId(account.address)
    }
  }, [sessionId])


  const DynamicQR = dynamic(() => import('@/components/QRCode'), {ssr: false})

  return (
    <>
      {!userId && <WalletLogin />}
      {userId && <DynamicQR userId={userId} isDriver={isDriver}/>}
    </>
  )

}

export default Home
