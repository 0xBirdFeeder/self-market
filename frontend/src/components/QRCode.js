"use client"
import SelfQRcodeWrapper, { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';

function QRCode({userId, isDriver}) {

    if (!userId) return <div></div>;

    // Create a SelfApp instance using the builder pattern
    const selfApp = new SelfAppBuilder({
      appName: "My App",
      scope: "my-app-scope",
      endpoint: "https://myapp.com/api/verify",
      userId,
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
        <h1>Verify Your Identity</h1>
        <p>Scan this QR code with the Self app to verify your identity</p>
      <SelfQRcodeWrapper
        selfApp={selfApp}
        onSuccess={() => {
          // Handle successful verification
          console.log("Verification successful!");
          // Redirect or update UI
        }}
        size={350}
      />

      <p className="text-sm text-gray-500">
        User ID: {userId.substring(0, 8)}...
        {isDriver + ""}
      </p>
    </div>
    );
}

export default QRCode
