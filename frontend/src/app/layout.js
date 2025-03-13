import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={bodyStyle}>
        {children}
      </body>
    </html>
  );
}
