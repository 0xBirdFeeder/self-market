"use client"

import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect
 } from '@coinbase/onchainkit/wallet';
import { color } from '@coinbase/onchainkit/theme';
import {
  Avatar,
  Name,
  Address,
  Identity
} from '@coinbase/onchainkit/identity';
import { getAccount } from "@wagmi/core";
import { wagmiConfig, useUserContext } from "@/app/providers"

const WalletLogin = () => {
  const {userId, setUserId} = useUserContext()

  return (
      <Wallet>
        <ConnectWallet onConnect={() => {
          const account = getAccount(wagmiConfig)
          setUserId(account.address)
        }}>
          <Avatar />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
  )
}

export default WalletLogin
