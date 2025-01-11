import { useOnchainKit } from '@/core-react/useOnchainKit';
import { addSvgForeground } from '@/internal/svg/addForegroundSvg';
import { arrowUpRightSvg } from '@/internal/svg/arrowUpRightSvg';
import { toggleSvg } from '@/internal/svg/toggleSvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

type TransactionActionProps = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

export function WalletAdvancedTransactionActions() {
  const { address, chain } = useWalletContext();
  const { projectId } = useOnchainKit();
  const { isFetchingPortfolioData, setShowSwap, animations } =
    useWalletAdvancedContext();

  const handleBuy = useCallback(() => {
    if (!projectId || !address || !chain?.name) {
      return;
    }

    const url = new URL('https://pay.coinbase.com/buy/select-asset');
    const params = new URLSearchParams({
      appId: projectId,
      destinationWallets: JSON.stringify([
        {
          address,
          blockchains: [chain.name.toLowerCase()],
        },
      ]),
      defaultAsset: 'USDC',
      defaultPaymentMethod: 'CRYPTO_ACCOUNT',
      presetFiatAmount: '25',
    });

    window.open(
      `${url}?${params}`,
      'popup',
      'width=400,height=600,scrollbars=yes',
    );
  }, [address, chain?.name, projectId]);

  const handleSend = useCallback(() => {
    window.open('https://wallet.coinbase.com', '_blank');
  }, []);

  const handleSwap = useCallback(() => {
    setShowSwap(true);
  }, [setShowSwap]);

  if (isFetchingPortfolioData) {
    return (
      <div
        data-testid="ockWalletAdvanced_LoadingPlaceholder"
        className="my-3 h-16 w-80"
      />
    ); // Prevent layout shift
  }

  return (
    <div
      className={cn(
        'my-3 flex w-full flex-row justify-center gap-2',
        animations.content,
      )}
    >
      <WalletAdvancedTransactionAction
        icon={addSvgForeground}
        label="Buy"
        action={handleBuy}
      />
      <WalletAdvancedTransactionAction
        icon={arrowUpRightSvg}
        label="Send"
        action={handleSend}
      />
      <WalletAdvancedTransactionAction
        icon={toggleSvg}
        label="Swap"
        action={handleSwap}
      />
    </div>
  );
}

function WalletAdvancedTransactionAction({
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
