export async function GET() {
  return Response.json({
    accountAssociation: {
      header:
        'eyJmaWQiOjgxODAyNiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDU4YjU1MTNjMzk5OTYzMjU0MjMzMmU0ZTJlRDAyOThFQzFmRjE4MzEifQ',
      payload: 'eyJkb21haW4iOiJvbmNoYWlua2l0Lnh5eiJ9',
      signature:
        'MHgxMTc4ZjYzNjQ1N2RhNTVmZDA1NmM4YmIxOWQyMTEzYzRiYWI5NDgwMjE4ODM2MTRjY2M4MmVlMmVhNzAzNGUwMDk1Yjg2YzM0YjdmZThmMTcyZWZlNTY5NmZkNjcxYmYyZTk2ZTJjNGVlMWJjMDljNTgxN2MxMjVkMWUxNzg0ZjFj',
    },
    frame: {
      version: 'next',
      name: 'MiniKit',
      homeUrl: 'https://onchainkit.xyz/playground/minikit',
      iconUrl: 'https://onchainkit.xyz/playground/snake-icon.png',
      imageUrl: 'https://onchainkit.xyz/playground/snake-image.png',
      buttonTitle: 'Launch MiniKit',
      splashImageUrl: 'https://onchainkit.xyz/playground/snake-icon.png',
      splashBackgroundColor: '#FFFFFF',
      webhookUrl: 'https://onchainkit.xyz/playground/api/webhook',
    },
  });
}
