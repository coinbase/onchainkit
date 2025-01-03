import { border, cn, color, pressable, text } from '@/styles/theme';
import { Avatar, Badge, Name } from '@/ui/react/identity';
import { useCallback, useState } from 'react';
import type { Address, Chain } from 'viem';
// import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

export function AddressDetails() {
  const { address, chain, isClosing } = useWalletContext();
  // const { animationClasses } = useWalletIslandContext();
  const [copyText, setCopyText] = useState('Copy');

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address ?? '');
      setCopyText('Copied');
      setTimeout(() => setCopyText('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      setCopyText('Failed to copy');
      setTimeout(() => setCopyText('Copy'), 2000);
    }
  }, [address]);

  if (isClosing || !chain) {
    return <div className="mt-1 h-28 w-10" />;
  }

  return (
    <div
      className={cn(
        'mt-2 flex flex-col items-center justify-center',
        color.foreground,
        text.body,
        // 'opacity-0',
        // animationClasses.addressDetails,
      )}
    >
      <div className="h-10 w-10">
        <Avatar address={address} chain={chain}>
          <Badge />
        </Avatar>
      </div>
      <div className="group relative mt-2 text-base">
        <button
          type="button"
          onClick={handleCopyAddress}
          data-testid="ockWalletIsland_NameButton"
        >
          <Name
            address={address}
            chain={chain}
            className="hover:text-[var(--ock-text-foreground-muted)] active:text-[var(--ock-text-primary)]"
          />
        </button>
        <button
          type="button"
          onClick={handleCopyAddress}
          className={cn(
            pressable.alternate,
            text.legal,
            color.foreground,
            border.default,
            border.radius,
            'absolute top-full right-[0%] z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
          )}
          aria-live="polite"
          data-testid="ockWalletIsland_NameTooltip"
        >
          {copyText}
        </button>
      </div>
      <div className={cn(text.title1, 'mt-1 font-normal')}>
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
  return <span data-testid="ockWalletIsland_AddressBalance">$690.42</span>;
}
