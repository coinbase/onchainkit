import { useWalletContext } from '../../wallet/components/WalletProvider';
import { cn, color, text } from '../../styles/theme';
import { Avatar, Badge, Name } from '../../identity';
import { Address, Chain } from 'viem';

export default function AddressDetails() {
  const { address, chain } = useWalletContext();
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center gap-2 mt-2',
        color.foreground,
        text.body,
      )}
    >
      <div className="w-10 h-10">
        <Avatar address={address} chain={chain}>
          <Badge />
        </Avatar>
      </div>
      <div className="text-base">
        <Name address={address} chain={chain} />
      </div>
      <div className={cn('text-xl', text.title3)}>
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
  return <span>$690.42</span>;
}
