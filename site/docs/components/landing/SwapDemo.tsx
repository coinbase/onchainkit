import { Avatar, Name } from '@coinbase/onchainkit/identity';
import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToggleButton,
} from '@coinbase/onchainkit/swap';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import App from '../App.tsx';
import SwapWrapper from '../SwapWrapper.tsx';

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
    image: "",
  };
 
  const USDCToken: Token = {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chainId: 8453,
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
    image: "",
  };
 
  const swappableTokens: Token[] = [ETHToken, USDCToken];
  
  <SwapDefault
    from={swappableFromTokens}
    to={swappableToTokens}
  /> 
  `;

function SwapDemo({ theme }: { theme: string }) {
  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <App theme={theme}>
        <SwapWrapper>
          {({ address, swappableTokens }) => {
            if (address) {
              return (
                <Swap className="w-[360px] sm:w-[500px]">
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
                  <SwapButton disabled={true} />
                  <SwapMessage />
                </Swap>
              );
            }
            return (
              <>
                <Wallet>
                  <ConnectWallet>
                    <Avatar className="h-6 w-6" />
                    <Name />
                  </ConnectWallet>
                </Wallet>
              </>
            );
          }}
        </SwapWrapper>
      </App>
    </div>
  );
}

export default SwapDemo;
