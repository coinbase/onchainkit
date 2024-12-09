import { addSvgForeground } from '../../../internal/svg/addForegroundSvg';
import { arrowUpRightSvg } from '../../../internal/svg/arrowUpRightSvg';
import { toggleSvg } from '../../../internal/svg/toggleSvg';
import { cn, color, pressable, text } from '../../../styles/theme';
import { useWalletIslandContext } from './WalletIslandProvider';

type TransactionActionProps = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

function WalletIslandTransactionAction({
  icon,
  label,
  action,
}: TransactionActionProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-center justify-center gap-1',
        'h-16 w-28',
        'rounded-lg',
        pressable.alternate,
      )}
      onClick={action}
    >
      <span className="h-4 w-4">{icon}</span>
      <span
        className={cn(
          text.label1,
          color.foreground,
          'flex flex-col justify-center',
        )}
      >
        {label}
      </span>
    </button>
  );
}

export default function WalletIslandTransactionActions() {
  const { setShowSwap } = useWalletIslandContext();
  return (
    <div
      className={cn(
        'my-3 flex w-full flex-row justify-center gap-2',
        'animate-walletIslandItem3 opacity-0',
      )}
    >
      <WalletIslandTransactionAction
        icon={addSvgForeground}
        label="Buy"
        action={() => {
          window.open('https://pay.coinbase.com', '_blank');
        }}
      />
      <WalletIslandTransactionAction
        icon={arrowUpRightSvg}
        label="Send"
        action={() => {
          window.open('https://wallet.coinbase.com', '_blank');
        }}
      />
      <WalletIslandTransactionAction
        icon={toggleSvg}
        label="Swap"
        action={() => {
          setShowSwap(true);
        }}
      />
    </div>
  );
}
