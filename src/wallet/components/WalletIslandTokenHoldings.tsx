import { cn, color, text } from '@/styles/theme';
import { type Token, TokenImage } from '@/token';
import { useWalletIslandContext } from './WalletIslandProvider';

// TODO: handle loading state
export function WalletIslandTokenHoldings() {
  // const { animationClasses, tokenHoldings } = useWalletIslandContext();
  const { tokenHoldings } = useWalletIslandContext();

  if (tokenHoldings.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'max-h-44 overflow-y-auto',
        'flex w-full flex-col items-center gap-4',
        'mt-2 mb-2 px-2',
        // 'opacity-0',
        // animationClasses.tokenHoldings,
        'shadow-[inset_0_-15px_10px_-10px_rgba(0,0,0,0.05)]',
      )}
      data-testid="ockWalletIsland_TokenHoldings"
    >
      {tokenHoldings.map((tokenBalance, index) => (
        <TokenDetails
          key={`${tokenBalance.token.address}-${index}`}
          token={tokenBalance.token}
          balance={tokenBalance.balance}
          valueInFiat={tokenBalance.valueInFiat}
        />
      ))}
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
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <TokenImage token={token} size={32} />
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
