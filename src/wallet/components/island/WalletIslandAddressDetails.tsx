import type { Address, Chain } from 'viem';
import { Avatar, Badge, Name } from '../../../identity';
import { cn, color, text } from '../../../styles/theme';
import { useWalletContext } from '../WalletProvider';

export default function AddressDetails() {
  const { address, chain } = useWalletContext();
  return (
    <div
      className={cn(
        'mt-2 flex flex-col items-center justify-center gap-1',
        color.foreground,
        text.body,
      )}
    >
      <div className="h-10 w-10">
        <Avatar address={address} chain={chain}>
          <Badge />
        </Avatar>
      </div>
      <div className="text-base">
        <Name address={address} chain={chain} />
      </div>
      <div className={cn(text.title1)}>
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
