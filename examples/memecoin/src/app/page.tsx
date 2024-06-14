'use client'

import { ThirdwebERC20Abi } from '@/lib/abi/ThirdwebERC20'
import { erc20Abi, formatUnits } from 'viem'
import { useAccount, useConnect, useDisconnect, useReadContract, useSwitchChain, useWriteContract } from 'wagmi'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { chains, switchChain } = useSwitchChain()
  const { writeContract } = useWriteContract()

  const result = useReadContract({
    abi: erc20Abi,
    address: "0xA7651F281555232cFf537E7f793267e3b1219259",
    functionName: "balanceOf",
    args: [account?.address!],
    query: {
      enabled: !!account?.address
    }
  })

  console.log('result', result)
  console.log('account', account)

  return (
    <div className='h-screen w-full'>
      <div className='h-full w-full flex flex-col justify-center text-center'>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>
      {chains.filter(chain => chain.id !== account?.chainId).map((chain) => (
        <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
          {chain.name}
        </button>
      ))}
    </div>
      </div>
        <button
        disabled={!account?.address}
        onClick={() => 
          writeContract({ 
            abi: ThirdwebERC20Abi,
            address: '0xA7651F281555232cFf537E7f793267e3b1219259',
            functionName: 'mintTo',
            args: [
              account?.address!,
              BigInt(1000000000000),
            ],
         })
        }
        >Mint</button>
        <div className='flex justify-between w-full'>
          <div>Balance</div>
        <div>{formatUnits(result?.data ?? BigInt(0), 18)} $ONCHAIN</div>

        </div>
      </div>
    </div>
  )
}

export default App
