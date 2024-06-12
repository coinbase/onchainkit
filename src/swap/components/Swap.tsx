import { Token } from '../../token';
import { SwapAmountInput } from './SwapAmountInput';

type SwapReact = {
  fromAmount?: string;
  fromToken?: Token;
  fromTokenBalance?: string;
  setFromAmount: (amount: string) => void;
  setFromToken: () => void;
  setToToken: () => void;
  swappableTokens: Token[];
  toAmount?: string;
  toToken?: Token;
};

export function Swap({
  fromAmount,
  fromToken,
  fromTokenBalance,
  setFromAmount,
  setFromToken,
  setToToken,
  swappableTokens,
  toAmount,
  toToken,
}: SwapReact) {
  return (
    <div className="flex w-[400px] flex-col rounded-xl bg-white">
      <label className="box-border w-full border-b border-solid  p-4 text-base font-semibold leading-6 text-[#030712] shadow-[0px_4px_4px_0px_rgba(3,7,18,0.05)]">
        Swap
      </label>
      <SwapAmountInput
        amount={fromAmount}
        label="Sell"
        setAmount={setFromAmount}
        setToken={setFromToken}
        token={fromToken}
        tokenBalance={fromTokenBalance}
        swappableTokens={swappableTokens}
      />
      <SwapAmountInput
        amount={toAmount}
        disabled
        displayMaxButton={false}
        label="Buy"
        setToken={setToToken}
        swappableTokens={swappableTokens}
        token={toToken}
      />
      <div className="w-full p-4">
        <button className="w-full rounded-[100px] bg-blue-700 px-4 py-3 text-base font-medium leading-6 text-white">
          Swap
        </button>
      </div>
    </div>
  );
}
