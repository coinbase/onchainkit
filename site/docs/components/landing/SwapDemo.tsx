import { Avatar, Name } from '@coinbase/onchainkit/identity';
import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToggleButton,
} from '@coinbase/onchainkit/swap';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import AppDemo from '../AppDemo.tsx';
import SwapWrapper from '../SwapWrapper.tsx';

export const swapDemoCode = `
  import { SwapDefault } from '@coinbase/onchainkit/swap';
  import type { Token } from '@coinbase/onchainkit/token';

  function SwapDemo() {
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

    return (
      <SwapDefault
        from={swappableTokens}
        to={swappableTokens}
      />
    );
  }
  `;

function SwapDemo() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <AppDemo>
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
      </AppDemo>
    </div>
  );
}

export default SwapDemo;
