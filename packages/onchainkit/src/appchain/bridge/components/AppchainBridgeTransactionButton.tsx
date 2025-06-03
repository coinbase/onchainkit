'use client';
import { cn, pressable, text } from '@/styles/theme';
import { ConnectWallet, Wallet } from '@/wallet';
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
    return (
      <Wallet>
        <ConnectWallet className="w-full" />
      </Wallet>
    );
  }

  return (
    <div className="w-full pt-2">
      <button
        onClick={buttonHandler}
        className={cn(
          pressable.primary,
          'rounded-ock-default',
          'w-full rounded-xl',
          'px-4 py-3 font-medium text-base text-white leading-6',
          text.headline,
          isDisabled && pressable.disabled,
        )}
        type="button"
        disabled={isDisabled}
      >
        <div
          className={cn(
            text.headline,
            'text-ock-text-inverse',
            'flex justify-center',
          )}
        >
          {buttonContent}
        </div>
      </button>
      {isRejected && (
        <div className={cn(text.label2, 'text-ock-text-error', 'mt-2')}>
          Transaction denied
        </div>
      )}
    </div>
  );
};
