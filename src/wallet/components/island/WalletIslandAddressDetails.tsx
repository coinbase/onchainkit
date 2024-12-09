import { useCallback } from 'react';
import type { Address, Chain } from 'viem';
import { Avatar, Badge, Name } from '../../../identity';
import { cn, color, text } from '../../../styles/theme';
import { useWalletContext } from '../WalletProvider';

export default function AddressDetails() {
  const { address, chain } = useWalletContext();

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address ?? '');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  }, [address]);

  return (
    <div
      className={cn(
        'mt-2 flex flex-col items-center justify-center',
        color.foreground,
        text.body,
      )}
    >
      <div className="h-10 w-10">
        <Avatar address={address} chain={chain}>
          <Badge />
        </Avatar>
      </div>
      <div className="mt-2 text-base">
        <button type="button" onClick={handleCopyAddress}>
          <Name
            address={address}
            chain={chain}
            className="hover:text-[var(--ock-text-foreground-muted)] active:text-[var(--ock-text-primary)]"
          />
        </button>
      </div>
      <div className={cn(text.title1, 'mt-1')}>
        <AddressBalance address={address} chain={chain} />
      </div>
    </div>
  );
}

type AddressBalanceProps = {
  address?: Address | null;
  chain?: Chain | null;
};

function AddressBalance({ address, chain }: AddressBalanceProps) {
  const data = { address, chain }; // temp linter fix
  console.log({ data }); // temp linter fix
  return <span>$690.42</span>;
}
