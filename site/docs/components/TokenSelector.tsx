import { useCallback, useState } from 'react';

import { TokenSearch, TokenChip, TokenRow, type Token } from '@coinbase/onchainkit/token';
import { tokens } from './tokens';

export function TokenSelector() {
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);

  const handleChange = useCallback((value: string) => {
    const filteredTokens = tokens.filter(({ name, symbol, address }) => {
      const v = value.toLowerCase();
      return (
        name.toLowerCase().includes(v) ||
        symbol.toLowerCase().includes(v) ||
        address.toLowerCase().includes(v)
      );
    });

    setFilteredTokens(filteredTokens);
  }, []);

  const handleSelect = useCallback((token: Token) => {
    console.log('Selected token', token);
  }, []);

  return (
    <div className="flex flex-col gap-1 rounded-3xl bg-white p-4">
      <div className="mb-2 flex w-full items-center justify-between">
        <div className="text-lg text-black">Select a token</div>
        <div className="text-lg text-black">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.3352 1L1 2.33521L6.66479 8L1 13.6648L2.3352 15L8 9.33521L13.6648 15L15 13.6648L9.33521 8L15 2.33521L13.6648 1L8 6.6648L2.3352 1Z"
              fill="#0A0B0D"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <TokenSearch tokens={tokens} onChange={handleChange} />
        {filteredTokens.length > 0 && (
          <div className="flex gap-2">
            {filteredTokens.map((token) => (
              <TokenChip key={token.name} token={token} onClick={handleSelect} />
            ))}
          </div>
        )}
        {filteredTokens.length > 0 ? (
          <div>
            <div className="text-body text-black">Tokens</div>
            <div>
              {filteredTokens.map((token) => (
                <TokenRow key={token.name} token={token} onClick={handleSelect} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-body text-black">No tokens found</div>
        )}
      </div>
    </div>
  );
}
