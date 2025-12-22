# Base Quickstart for OnchainKit

This short note helps new builders enable **Base** quickly with OnchainKit.

---

## Chain IDs
- **Base Mainnet**: `8453`
- **Base Sepolia**: `84532`

---

## Minimal Next.js + wagmi Setup
```ts
import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/<API_KEY>'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})
Tips for Base UX

Auto-switch network to Base right after wallet connect

Show explorer links via https://basescan.org

Provide RPC fallback to avoid rate limits

Goal: reduce time-to-first-deploy for Base builders using OnchainKit.

