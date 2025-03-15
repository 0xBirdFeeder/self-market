"use client"
import SelfQRcodeWrapper, { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';
import fetchSelfProof from '@/utils/fetchSelfProof'

function QRCode({userId, isDriver}) {

    if (!userId) return <div></div>;

    // Create a SelfApp instance using the builder pattern
    const selfApp = new SelfAppBuilder({
      appName: "My App",
      scope: "my-app-scope",
      endpoint: "NEXT_PUBLIC_BACKEND_SERVER/callback",
      userId: "0x9e25Fe3734338F2cBF23e765a892a61AD23D19b2",
      userIdType: "hex",
      // Optional disclosure requirements
      disclosures: {
        excludedCountries: ["IRN", "PRK"],
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
          onSuccess={() => {
            // Handle successful verification
            console.log("Verification successful!");
            fetchSelfProof(userId)
            // Redirect or update UI
          }}
          size={350}
        />
      </div>
    );
}

export default QRCode
