import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';
import { TokenRow } from '@/token';
import { cn, text } from '@/styles/theme';

export function TokenSelector() {
  const { tokenBalances, handleTokenSelection } = useSendContext();

  return (
    <div className="mt-2 flex flex-col gap-2">
      <span className={cn(text.caption, 'uppercase')}>Select a token</span>
      <div className="scrollbar-hidden overflow-y-auto">
        {tokenBalances?.map((token) => (
          <TokenRow
            key={token.address}
            token={{
              address: token.address,
              chainId: token.chainId,
              decimals: token.decimals,
              image: token.image,
              name: token.name,
              symbol: token.symbol,
            }}
            amount={String(token.cryptoBalance / 10 ** token.decimals)}
            onClick={handleTokenSelection}
          />
        ))}
      </div>
    </div>
  );
}
