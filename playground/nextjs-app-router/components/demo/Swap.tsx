import { 
    Swap, 
    SwapAmountInput, 
    SwapToggleButton, 
    SwapButton, 
    SwapMessage
} from '@coinbase/onchainkit/swap'; 
import type { Token } from '@coinbase/onchainkit/token';
import { useContext } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { AppContext } from '../AppProvider';
 
function SwapComponent() {
  const { address } = useAccount();
  const {chainId} = useContext(AppContext)
 
  const degenToken: Token = {
    name: 'DEGEN',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    symbol: 'DEGEN',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
    chainId: 8453,
  };

  const ethToken: Token = {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  };

  const usdcToken: Token = {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  };

  const wethToken: Token = {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
    chainId: 8453,
  };

  const swappableTokens = [degenToken, ethToken, usdcToken, wethToken];
 
  return (
    <div className='relative w-full h-full'>
      {!address ? (
        <div className='w-full h-full flex flex-col justify-center text-center bg-[#000000] bg-opacity-50 z-10 absolute top-0 left-0 rounded-xl'>
          <div className='bg-muted w-2/3 mx-auto p-6 rounded-md text-sm'>
            Swap Demo requires wallet.
            <br />
            Please connect in settings.
          </div>
        </div>
      ) : chainId !== 8453 ? (
        <div className='w-full h-full flex flex-col justify-center text-center bg-[#000000] bg-opacity-50 z-10 absolute top-0 left-0 rounded-xl'>
          <div className='bg-muted w-2/3 mx-auto p-6 rounded-md text-sm'>
            Swap Demo is only available on Base.
            <br />
            Please change your chain in settings.
          </div>
        </div>
      ) : (<></>)}
      <Swap address={address!} className="border bg-[#ffffff]">
        <SwapAmountInput
          label="Sell"
          swappableTokens={swappableTokens} 
          token={ethToken} 
          type="from"
          /> 
        <SwapToggleButton /> 
        <SwapAmountInput
          label="Buy"
          swappableTokens={swappableTokens} 
          token={usdcToken} 
          type="to"
          /> 
        <SwapButton /> 
        <SwapMessage /> 
      </Swap> 
    </div>
  );
}

export default function SwapDemo() {
    return (
        <div className='mx-auto'>
            <SwapComponent />
        </div>
    )
}