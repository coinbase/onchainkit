import { useCallback, useState } from 'react';
import { TokenSearch, TokenChip, TokenRow, type Token } from '@coinbase/onchainkit/token';
import { tokens } from './tokens';

export function TokenSelector() {
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);

  const handleChange = useCallback((value: string) => {
    const filteredTokens = tokens.filter(({ name, symbol, address }: Token) => {
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
    <div className="flex flex-col gap-4 rounded-3xl bg-white p-4">
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
  );
}
