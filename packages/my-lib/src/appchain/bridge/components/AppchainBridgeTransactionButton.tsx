'use client';
import { cn } from '@/styles/theme';
import { border, color, pressable, text } from '@/styles/theme';
import { ConnectWallet } from '@/wallet';
import { useAccount } from 'wagmi';
import { useDepositButton } from '../hooks/useDepositButton';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

export const AppchainBridgeTransactionButton = () => {
  const {
    handleDeposit,
    depositStatus,
    direction,
    handleWithdraw,
    withdrawStatus,
  } = useAppchainBridgeContext();
  const { bridgeParams } = useAppchainBridgeContext();
  const { isConnected } = useAccount();

  const { isRejected, buttonContent, isDisabled } = useDepositButton({
    depositStatus,
    withdrawStatus,
    bridgeParams,
  });

  const buttonHandler =
    direction === 'deposit' ? handleDeposit : handleWithdraw;

  if (!isConnected) {
    return <ConnectWallet className="w-full" />;
  }

  return (
    <div className="w-full pt-2">
      <button
        onClick={buttonHandler}
        className={cn(
          pressable.primary,
          border.radius,
          'w-full rounded-xl',
          'px-4 py-3 font-medium text-base text-white leading-6',
          text.headline,
          isDisabled && pressable.disabled,
        )}
        type="button"
        disabled={isDisabled}
      >
        <div
          className={cn(text.headline, color.inverse, 'flex justify-center')}
        >
          {buttonContent}
        </div>
      </button>
      {isRejected && (
        <div className={cn(text.label2, color.error, 'mt-2')}>
          Transaction denied
        </div>
      )}
    </div>
  );
};
