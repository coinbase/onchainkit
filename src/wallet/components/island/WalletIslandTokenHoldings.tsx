import { useEffect, useState } from 'react';
import { Token, TokenImage } from '../../../token';
import { cn, text, color } from '../../../styles/theme';
import { useWalletContext } from '../WalletProvider';
import getAddressTokenBalances from '../../../internal/utils/getAddressTokenBalances';

export type TokenBalanceWithFiatValue = {
  token: Token;
  /** Token:
   * address: Address | "";
   * chainId: number;
   * decimals: number;
   * image: string | null;
   * name: string;
   * symbol: string;
   */
  balance: number;
  valueInFiat: number;
};

export default function WalletIslandTokenHoldings() { // TODO: handle loading state
  const [tokens, setTokens] = useState<any[]>([]);
  const { address } = useWalletContext();

  useEffect(() => {
    // TODO: move this effect to the provider
    async function fetchTokens() {
      if (address) {
        const rawTokens = await getAddressTokenBalances(address);
        setTokens(rawTokens);
      }
    }

    void fetchTokens();
  }, [address]);

  console.log({ tokens });

  const tokenBalances: TokenBalanceWithFiatValue[] = [
    {
      token: {
        name: 'Ether',
        address: '',
        symbol: 'ETH',
        decimals: 18,
        image:
          'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        chainId: 8453,
      },
      balance: 0.42,
      valueInFiat: 1386,
    },
    {
      token: {
        name: 'USD Coin',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        decimals: 6,
        image:
          'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
        chainId: 8453,
      },
      balance: 69,
      valueInFiat: 69,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 mx-4 my-2 w-full">
      {tokenBalances.slice(0, 4).map((tokenBalance) => (
        <TokenDetails
          key={tokenBalance.token.address}
          token={tokenBalance.token}
          balance={tokenBalance.balance}
          valueInFiat={tokenBalance.valueInFiat}
        />
      ))}
      <a
        href="https://wallet.coinbase.com/assets"
        target="_blank"
        rel="noreferrer noopener"
        className={cn(text.label2, color.foregroundMuted)}
      >
        View All Tokens
      </a>
    </div>
  );
}

type TokenDetailsProps = {
  token: Token;
  balance: number;
  valueInFiat: number;
};

function TokenDetails({ token, balance, valueInFiat }: TokenDetailsProps) {
  const currencySymbol = '$'; // TODO: get from user settings

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row items-center gap-2">
        <TokenImage token={token} size={36} />
        <div className="flex flex-col">
          <span className={cn(text.label1, color.foreground)}>
            {token.name}
          </span>
          <span className={cn(text.legal, color.foregroundMuted)}>
            {`${balance} ${token.symbol}`}
          </span>
        </div>
      </div>
      <span className={cn(text.label2, color.foregroundMuted)}>
        {`${currencySymbol}${valueInFiat}`}
      </span>
    </div>
  );
}
