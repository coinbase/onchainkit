import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';
import { TokenRow } from '@/token';

export function TokenSelector() {
  const { tokenBalances, handleTokenSelection, lifecycleStatus } =
    useSendContext();

  if (lifecycleStatus.statusName !== 'selectingToken') {
    return null;
  }

  return (
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
  );
}
