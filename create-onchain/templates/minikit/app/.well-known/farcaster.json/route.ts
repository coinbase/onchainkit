export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
    "accountAssociation": {
      "header": process.env.NEXT_PUBLIC_FARCASTER_HEADER,
      "payload": process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
      "signature": process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE
    },
    "frame": {
      "version": process.env.NEXT_PUBLIC_VERSION,
      "name": process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      "homeUrl": URL,
      "iconUrl": "https://onchainkit.xyz/favicon/48x48.png",
      "imageUrl": "https://onchainkit.xyz/favicon/48x48.png",
      "buttonTitle": `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
      "splashImageUrl": "https://onchainkit.xyz/favicon/48x48.png",
      "splashBackgroundColor": "#000000",
      "webhookUrl": `${URL}/api/webhook`
    }
  });
}