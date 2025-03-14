import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';


export const metadata = {
  title: "BirdFeeder Permissioned Market",
  description: "Powered by Self Protocol",
};

const bodyStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw"
}

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'onchainkit',
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={bodyStyle}>
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}
