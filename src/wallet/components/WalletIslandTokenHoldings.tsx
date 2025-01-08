import { Spinner } from '@/internal/components/Spinner';
import { cn, color, text } from '@/styles/theme';
import { type Token, TokenImage } from '@/token';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

type TokenDetailsProps = {
  token: Token;
  balance: number;
  valueInFiat: number;
};

export function WalletIslandTokenHoldings() {
  const { isClosing } = useWalletContext();
  const { tokenBalances, isFetchingPortfolioData } = useWalletIslandContext();

  if (isFetchingPortfolioData) {
    return <Spinner />;
  }

  if (!tokenBalances || tokenBalances.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'max-h-44 overflow-y-auto',
        'flex min-h-44 w-full flex-col items-center gap-4',
        'mt-2 mb-2',
        {
          'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out':
            !isClosing,
        },
      )}
      data-testid="ockWalletIsland_TokenHoldings"
    >
      {tokenBalances.map((tokenBalance, index) => (
        <TokenDetails
          key={`${tokenBalance.address}-${index}`}
          token={{
            address: tokenBalance.address,
            chainId: tokenBalance.chainId,
            decimals: tokenBalance.decimals,
            image: tokenBalance.image,
            name: tokenBalance.name,
            symbol: tokenBalance.symbol,
          }}
          balance={
            Number(tokenBalance.cryptoBalance) /
            10 ** Number(tokenBalance.decimals)
          }
          valueInFiat={Number(tokenBalance.fiatBalance)}
        />
      ))}
    </div>
  );
}

function TokenDetails({ token, balance, valueInFiat }: TokenDetailsProps) {
  const currencySymbol = '$'; // TODO: get from user settings

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <TokenImage token={token} size={32} />
        <div className="flex flex-col">
          <span className={cn(text.label1, color.foreground)}>
            {token.name}
          </span>
          <span className={cn(text.legal, color.foregroundMuted)}>
            {`${balance.toFixed(5)} ${token.symbol}`}
          </span>
        </div>
      </div>
      <span className={cn(text.label2, color.foregroundMuted)}>
        {`${currencySymbol}${valueInFiat.toFixed(2)}`}
      </span>
    </div>
  );
}
