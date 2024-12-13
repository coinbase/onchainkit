import { addSvgForeground } from '../../../internal/svg/addForegroundSvg';
import { arrowUpRightSvg } from '../../../internal/svg/arrowUpRightSvg';
import { toggleSvg } from '../../../internal/svg/toggleSvg';
import { border, cn, color, pressable, text } from '../../../styles/theme';
import { useWalletIslandContext } from './WalletIslandProvider';

type TransactionActionProps = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

export function WalletIslandTransactionActions() {
  const { setShowSwap, animationClasses } = useWalletIslandContext();

  return (
    <div
      className={cn(
        'my-3 flex w-full flex-row justify-center gap-2',
        'opacity-0',
        animationClasses.transactionActions,
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

function WalletIslandTransactionAction({
  icon,
  label,
  action,
}: TransactionActionProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-center justify-center gap-2 pt-2.5 pb-2',
        'h-16 w-28',
        border.radius,
        pressable.alternate,
      )}
      onClick={action}
      aria-label={label}
    >
      <span className="flex h-4 w-4 flex-col items-center justify-center">
        {icon}
      </span>
      <span
        className={cn(
          text.label2,
          color.foreground,
          'flex flex-col justify-center',
        )}
      >
        {label}
      </span>
    </button>
  );
}
