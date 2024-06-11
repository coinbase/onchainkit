import { useCallback } from 'react';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapReact, SwapTokensButtonReact } from '../types';

const swapIcon = (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="SwapIcon"
  >
    <g clip-path="url(#clip0_2077_4627)">
      <path
        d="M14.5659 4.93434L13.4345 6.06571L11.8002 4.43139L11.8002 10.75L10.2002 10.75L10.2002 4.43139L8.56592 6.06571L7.43455 4.93434L11.0002 1.36865L14.5659 4.93434ZM8.56592 12.0657L5.00023 15.6314L1.43455 12.0657L2.56592 10.9343L4.20023 12.5687L4.20023 6.25002L5.80023 6.25002L5.80023 12.5687L7.43455 10.9343L8.56592 12.0657Z"
        fill="#0A0B0D"
      />
    </g>
    <defs>
      <clipPath id="clip0_2077_4627">
        <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export function SwapTokensButton({ onClick }: SwapTokensButtonReact) {
  return (
    <div
      className="absolute left-2/4 top-2/4 flex h-12 w-12 -translate-x-2/4 -translate-y-2/4 cursor-pointer items-center justify-center rounded-[50%] border border-solid border-gray-100 bg-white"
      onClick={onClick}
      data-testid="SwapTokensButton"
    >
      {swapIcon}
    </div>
  );
}

export function Swap({
  fromAmount,
  fromToken,
  fromTokenBalance,
  onSubmit,
  setFromAmount,
  setFromToken,
  setToToken,
  swappableTokens,
  toAmount,
  toToken,
  toTokenBalance,
}: SwapReact) {
  const handleSwapTokensClick = useCallback(() => {
    if (!toToken || !fromToken) {
      return;
    }
    const prevFromToken = fromToken;
    setFromToken(toToken);
    setToToken(prevFromToken);
  }, [fromToken, toToken, setFromToken, setToToken]);

  return (
    <div className="flex w-[400px] flex-col rounded-xl bg-white">
      <label className="box-border w-full border-b border-solid  p-4 text-base font-semibold leading-6 text-[#030712] shadow-[0px_4px_4px_0px_rgba(3,7,18,0.05)]">
        Swap
      </label>
      <div className="relative flex flex-col">
        <SwapAmountInput
          amount={fromAmount}
          label="Sell"
          setAmount={setFromAmount}
          setToken={setFromToken}
          token={fromToken}
          tokenBalance={fromTokenBalance}
          swappableTokens={swappableTokens}
        />
        <SwapTokensButton onClick={handleSwapTokensClick} />
        <SwapAmountInput
          amount={toAmount}
          disabled
          displayMaxButton={false}
          label="Buy"
          setToken={setToToken}
          swappableTokens={swappableTokens}
          token={toToken}
          tokenBalance={toTokenBalance}
        />
      </div>
      <div className="w-full p-4">
        <button
          className="w-full rounded-[100px] bg-blue-700 px-4 py-3 text-base font-medium leading-6 text-white"
          onClick={onSubmit}
        >
          Swap
        </button>
      </div>
    </div>
  );
}
