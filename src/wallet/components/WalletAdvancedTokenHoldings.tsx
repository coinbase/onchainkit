import { cn, color, text } from '@/styles/theme';
import { type Token, TokenImage } from '@/token';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';

type TokenDetailsProps = {
  token: Token;
  balance: number;
  valueInFiat: number;
};

export function WalletAdvancedTokenHoldings() {
  const { tokenBalances, isFetchingPortfolioData, animations } =
    useWalletAdvancedContext();

  if (isFetchingPortfolioData || !tokenBalances || tokenBalances.length === 0) {
    return (
      <div
        data-testid="ockWalletAdvanced_LoadingPlaceholder"
        className="my-2 h-44 w-80"
      />
    ); // Prevent layout shift
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4',
        'my-2 h-44 max-h-44 w-full',
        'scrollbar-hidden overflow-y-auto',
        animations.content,
      )}
      data-testid="ockWalletAdvanced_TokenHoldings"
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
  const formattedBalance = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(balance);

  const formattedValueInFiat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(valueInFiat);

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <TokenImage token={token} size={32} />
        <div className="flex flex-col">
          <span
            className={cn(
              text.label1,
              color.foreground,
              'max-w-52 overflow-hidden text-ellipsis whitespace-nowrap text-left',
            )}
          >
            {token.name?.trim()}
          </span>
          <span className={cn(text.legal, color.foregroundMuted)}>
            {`${formattedBalance} ${token.symbol}`}
          </span>
        </div>
      </div>
      <span className={cn(text.label2, color.foregroundMuted)}>
        {formattedValueInFiat}
      </span>
    </div>
  );
}
