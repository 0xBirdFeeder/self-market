"use client"

import { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from "next/dynamic";
import WalletLogin from '@/components/WalletLogin'
import { getAccount } from "@wagmi/core";
import { wagmiConfig, useUserContext } from "@/app/providers"
import { useOnchainKit } from '@coinbase/onchainkit'
import '@coinbase/onchainkit/styles.css';
import SubmitBidButton from "@/components/SubmitBidButton"

function Home () {
  const { userId, setUserId, authed } = useUserContext();
  const [isDriver, setIsDriver] = useState(false);
  const { sessionId } = useOnchainKit()

  useEffect(() => {
    const account = getAccount(wagmiConfig)
    if(account.address) {
      setUserId(account.address)
    }
  }, [sessionId])


  const DynamicQR = dynamic(() => import('@/components/QRCode'), {ssr: false})

  return (
    <>
      {!userId && <WalletLogin />}
      {(userId && !authed) && <DynamicQR userId={userId} isDriver={isDriver}/>}
      {(userId && authed) && <SubmitBidButton />}
    </>
  )

}

export default Home
