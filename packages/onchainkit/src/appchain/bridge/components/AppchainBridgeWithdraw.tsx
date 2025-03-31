'use client';
import { Spinner } from '@/internal/components/Spinner';
import { ErrorSvg } from '@/internal/svg/fullWidthErrorSvg';
import { SuccessSvg } from '@/internal/svg/fullWidthSuccessSvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useEffect } from 'react';
import { useWithdrawButton } from '../hooks/useWithdrawButton';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

const buttonStyles = cn(
  pressable.primary,
  border.radius,
  'w-full rounded-xl',
  'px-4 py-3 font-medium text-base text-white leading-6',
  text.headline,
);

export const AppchainBridgeWithdraw = () => {
  const {
    withdrawStatus,
    waitForWithdrawal,
    resumeWithdrawalTxHash,
    handleResetState,
  } = useAppchainBridgeContext();

  const { shouldShowClaim, label, isError, isPending } = useWithdrawButton({
    withdrawStatus,
  });

  useEffect(() => {
    (async () => {
      if (withdrawStatus === 'withdrawSuccess') {
        // If appchain withdrawal is successful, wait for claim to be ready
        waitForWithdrawal();
      }
      if (resumeWithdrawalTxHash) {
        // If the user has resumed a withdrawal transaction, wait for claim to be ready
        waitForWithdrawal(resumeWithdrawalTxHash);
      }
    })();
  }, [withdrawStatus, waitForWithdrawal, resumeWithdrawalTxHash]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <div className="flex items-center">
          <h2 className="ock-text-foreground flex-1 text-center font-medium text-lg">
            {label}
          </h2>
        </div>
      </div>
      <div className="mt-16 px-4 pb-4">
        {isError && <ErrorContent onBack={handleResetState} />}
        {isPending && <LoadingContent />}
        {shouldShowClaim && <ClaimContent />}
        {withdrawStatus === 'claimRejected' && (
          <div className={cn(text.label2, color.error, 'mt-2')}>
            Transaction denied
          </div>
        )}
      </div>
    </div>
  );
};

function LoadingContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16">
      <Spinner className="!border-t-[var(--ock-bg-primary)] h-24 w-24" />
      <span className="px-4 text-center font-medium text-base">
        Waiting for claim to be ready...
        <br />
        Please do not close this window.
      </span>
    </div>
  );
}

function ErrorContent({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex justify-center">
        <div className="h-20 w-20">
          <ErrorSvg fill="var(--ock-bg-error)" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <span className="px-4 text-center font-medium text-base">
          There was an error processing your withdrawal.
          <br />
          If the issue persists, please contact support.
        </span>
        <button onClick={onBack} className={buttonStyles} type="button">
          <div
            className={cn(text.headline, color.inverse, 'flex justify-center')}
          >
            Back to bridge
          </div>
        </button>
      </div>
    </div>
  );
}

function ClaimContent() {
  const { withdrawStatus, proveAndFinalizeWithdrawal } =
    useAppchainBridgeContext();

  const { buttonDisabled, buttonContent } = useWithdrawButton({
    withdrawStatus,
  });

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex justify-center">
        <div className="h-20 w-20">
          <SuccessSvg fill="var(--ock-bg-primary)" />
        </div>
      </div>
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
}
