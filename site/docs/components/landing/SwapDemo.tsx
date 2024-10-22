import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { 
  Swap, 
  SwapAmountInput, 
  SwapToggleButton, 
  SwapButton, 
  SwapMessage, 
} from '@coinbase/onchainkit/swap'; 
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import SwapWrapper from '../SwapWrapper.tsx';
import App from '../App.tsx';

export const swapDemoCode = `
  import { Avatar, Name } from '@coinbase/onchainkit/identity';
  import { 
    Swap, 
    SwapAmountInput, 
    SwapToggleButton, 
    SwapButton, 
    SwapMessage, 
    SwapToast, 
  } from '@coinbase/onchainkit/swap'; 
  import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
  import { useAccount } from 'wagmi';
  import type { Token } from '@coinbase/onchainkit/token'; 

  const { address } = useAccount();
 
  const ETHToken: Token = {
    address: "",
    chainId: 8453,
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
    image: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  };
 
  const USDCToken: Token = {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chainId: 8453,
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
    image: "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
  };
 
  const swappableTokens: Token[] = [ETHToken, USDCToken];
  
  return ( 
    <SwapDefault
      from={swappableFromTokens}
    to={swappableToTokens}
  /> 
  ); 
  `

function SwapDemo() {
  return (
    <App>
  <SwapWrapper>
    {({ address, swappableTokens }) => {
      if (address) {
        return (
          <Swap>
            <SwapAmountInput
              label="Sell"
              swappableTokens={swappableTokens}
              token={swappableTokens[1]}
              type="from"
            />
            <SwapToggleButton />
            <SwapAmountInput
              label="Buy"
              swappableTokens={swappableTokens}
              token={swappableTokens[2]}
              type="to"
            />
            <SwapButton disabled />
            <SwapMessage />
          </Swap>
        )
      }
      return <>
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </>;
    }}
  </SwapWrapper>
</App>
  )
  }

export default SwapDemo;