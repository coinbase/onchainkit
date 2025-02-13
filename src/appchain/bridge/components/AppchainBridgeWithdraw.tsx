import { Spinner } from '@/internal/components/Spinner';
import { SuccessSvg } from '@/internal/svg/fullWidthSuccessSvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useEffect } from 'react';
import { useWithdrawButton } from '../hooks/useWithdrawButton';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

export const AppchainBridgeWithdraw = () => {
  const {
    withdrawStatus,
    waitForWithdrawal,
    proveAndFinalizeWithdrawal,
    setIsWithdrawModalOpen,
  } = useAppchainBridgeContext();

  const { isSuccess, buttonDisabled, buttonContent, shouldShowClaim, label } =
    useWithdrawButton({
      withdrawStatus,
    });

  useEffect(() => {
    (async () => {
      if (withdrawStatus === 'withdrawSuccess') {
        // If appchain withdrawal is successful, wait for claim to be ready
        waitForWithdrawal();
      }
    })();
  }, [withdrawStatus, waitForWithdrawal]);

  const buttonStyles = cn(
    pressable.primary,
    border.radius,
    'w-full rounded-xl',
    'px-4 py-3 font-medium text-base text-white leading-6',
    text.headline,
  );

  const SuccessIcon = () => (
    <div className="flex justify-center">
      <div className="w-20 h-20">
        <SuccessSvg fill="var(--ock-bg-primary)" />
      </div>
    </div>
  );

  const LoadingContent = () => (
    <div className="flex flex-col items-center gap-16 h-full justify-center">
      <Spinner className="w-24 h-24 !border-t-[var(--ock-bg-primary)]" />
      <span className="text-base font-medium text-center px-4">
        Waiting for claim to be ready...
        <br />
        Please do not close this window.
      </span>
    </div>
  );

  const SuccessContent = () => (
    <div className="flex flex-col items-center gap-16">
      <SuccessIcon />
      <button
        onClick={() => setIsWithdrawModalOpen(false)}
        className={buttonStyles}
        type="button"
      >
        <div
          className={cn(text.headline, color.inverse, 'flex justify-center')}
        >
          Back to Bridge
        </div>
      </button>
    </div>
  );

  const ClaimContent = () => (
    <div className="flex flex-col items-center gap-16">
      <SuccessIcon />
      <button
        onClick={proveAndFinalizeWithdrawal}
        className={cn(buttonStyles, buttonDisabled && pressable.disabled)}
        type="button"
      >
        <div
          className={cn(text.headline, color.inverse, 'flex justify-center')}
        >
          {buttonContent}
        </div>
      </button>
    </div>
  );

  const renderContent = () => {
    if (isSuccess) {
      return <SuccessContent />;
    }
    return shouldShowClaim ? <ClaimContent /> : <LoadingContent />;
  };

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div>
        <div className="flex items-center">
          <h2 className="text-lg ock-text-foreground font-medium text-center flex-1">
            {label}
          </h2>
        </div>
      </div>
      <div className="px-4 pb-4 mt-16">
        {renderContent()}
        {withdrawStatus === 'claimRejected' && (
          <div className={cn(text.label2, color.error, 'mt-2')}>
            Transaction denied
          </div>
        )}
      </div>
    </div>
  );
};
