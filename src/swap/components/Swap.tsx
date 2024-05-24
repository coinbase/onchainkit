import { useCallback, useState } from 'react';
import { AmountInput } from './AmountInput';
import { Token } from '../types';

// TODO: replace with actual tokens
const tokens: Token[] = [
  { name: 'Ether', address: '0x123', currencyCode: 'ETH' },
  { name: 'Dai Stablecoin', address: '0x123' , currencyCode: 'DAI' },
];

const swapSVG = (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
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

type SwapTokensButtonProps = {
  onClick: () => void;
};

function SwapTokensButton({ onClick }: SwapTokensButtonProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '3rem',
        width: '3rem',
        borderRadius: '50%',
        background: '#EEF0F3',
        border: '0.25rem solid white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {swapSVG}
    </div>
  );
}

export function Swap() {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);

  const handleSwapTokensClick = useCallback(() => {
    const prevFromToken = fromToken;
    setFromToken(toToken);
    setToToken(prevFromToken);
  }, [fromToken, toToken]);

  // TODO: update with actual estimate
  const estimatedAmountInFiat = fromAmount;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '31.25rem',
        gap: '1rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: '500',
        }}
      >
        <label style={{ fontSize: '1.25rem', color: 'black' }}>Swap</label>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          position: 'relative',
        }}
      >
        <AmountInput
          label="You pay"
          amount={fromAmount}
          setAmount={setFromAmount}
          selectedToken={fromToken}
          estimatedAmountInFiat={estimatedAmountInFiat}
        />
        <SwapTokensButton onClick={handleSwapTokensClick} />
        <AmountInput
          label="You receive"
          amount={toAmount}
          setAmount={setToAmount}
          disabled={true}
          selectedToken={toToken}
        />
      </div>
      <div
        style={{
          background: '#0052FF',
          width: '100%',
          borderRadius: '6.25rem',
          color: 'white',
          padding: '1rem 2rem',
          fontWeight: '500',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        Swap
      </div>
    </div>
  );
}
