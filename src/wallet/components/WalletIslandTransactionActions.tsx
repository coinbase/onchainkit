import { useOnchainKit } from '@/core-react/useOnchainKit';
import { addSvgForeground } from '@/internal/svg/addForegroundSvg';
import { arrowUpRightSvg } from '@/internal/svg/arrowUpRightSvg';
import { toggleSvg } from '@/internal/svg/toggleSvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

type TransactionActionProps = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

export function WalletIslandTransactionActions() {
  const { address } = useWalletContext();
  const { chain, projectId } = useOnchainKit();
  const { isFetchingPortfolioData, setShowSwap, animations } =
    useWalletIslandContext();

  const handleBuy = useCallback(() => {
    const baseUrl = 'https://pay.coinbase.com/buy/select-asset';
    const params = [
      `appId=${projectId}`,
      `destinationWallets=[{"address": "${address}", "blockchains":["${chain.name.toLowerCase()}"]}]`,
      'defaultAsset=USDC',
      'defaultPaymentMethod=CRYPTO_ACCOUNT',
      'presetFiatAmount=25',
    ];

    window.open(
      `${baseUrl}?${params.join('&')}`,
      'popup',
      'width=400,height=600,scrollbars=yes',
    );
  }, [address, chain.name, projectId]);

  const handleSend = useCallback(() => {
    window.open('https://wallet.coinbase.com', '_blank');
  }, []);

  const handleSwap = useCallback(() => {
    setShowSwap(true);
  }, [setShowSwap]);

  if (isFetchingPortfolioData) {
    return (
      <div
        data-testid="ockWalletIsland_LoadingPlaceholder"
        className="my-3 h-16 w-full"
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
      <WalletIslandTransactionAction
        icon={addSvgForeground}
        label="Buy"
        action={handleBuy}
      />
      <WalletIslandTransactionAction
        icon={arrowUpRightSvg}
        label="Send"
        action={handleSend}
      />
      <WalletIslandTransactionAction
        icon={toggleSvg}
        label="Swap"
        action={handleSwap}
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
