import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const smartWalletConfig = createConfig({
  chains: [base],
  connectors: [injected()], 
  transports: {
    [base.id]: http(),
  },
})