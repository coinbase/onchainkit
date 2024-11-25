import { cn, pressable, color, text } from '../../styles/theme';
import { addSvgForeground } from '../../internal/svg/addForegroundSvg';
import { toggleSvg } from '../../internal/svg/toggleSvg';
import { arrowUpRightSvg } from '../../internal/svg/arrowUpRightSvg';

type TransactionActionProps = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

function TransactionAction({ icon, label, action }: TransactionActionProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        'w-[104px] h-16',
        'rounded-lg',
        pressable.alternate,
      )}
      onClick={action}
    >
      <span>{icon}</span>
      <span className={cn(text.label1, color.foreground)}>{label}</span>
    </div>
  );
}

export default function WalletIslandTransactionActions() {
  return (
    <div className="flex flex-row gap-2 mx-4 mt-2">
      <TransactionAction
        icon={addSvgForeground}
        label="Buy"
        action={() => {
          window.open('https://pay.coinbase.com', '_blank');
        }}
      />
      <TransactionAction
        icon={arrowUpRightSvg}
        label="Send"
        action={() => {
          window.open('https://wallet.coinbase.com', '_blank');
        }}
      />
      <TransactionAction icon={toggleSvg} label="Swap" action={() => {}} />
    </div>
  );
}
