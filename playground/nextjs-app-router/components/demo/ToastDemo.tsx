import { ReactNode, useContext, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { successSvg } from '@/onchainkit/src/internal/svg/successSvg';
import { errorSvg } from '@/onchainkit/src/internal/svg/errorSvg';
import { Spinner } from '@/onchainkit/src/internal/components/Spinner';
import { Toast } from '@/onchainkit/src/global/components/Toast';
import { getChainExplorer } from '@/onchainkit/src/network/getChainExplorer';
import { cn, color, text } from '@/onchainkit/src/styles/theme';

export default function ToastDemo() {
  const {
    toastPosition,
    isToastVisible,
    setIsToastVisible,
    toastDurationMs,
    toastTransactionHash,
    toastParentComponent,
    toastTransactionStatus,
    toastErrorMessage,
  } = useContext(AppContext);

  return (
    <>
      {toastParentComponent === OnchainKitComponent.Swap ? (
        <SwapToast
          toastPosition={toastPosition ?? 'bottom-center'}
          isToastVisible={isToastVisible ?? true}
          setIsToastVisible={setIsToastVisible}
          toastDurationMs={toastDurationMs ?? 3000}
          toastTransactionHash={toastTransactionHash ?? ''}
        />
      ) : (
        <TransactionToast
          toastPosition={toastPosition ?? 'bottom-center'}
          isToastVisible={isToastVisible ?? true}
          setIsToastVisible={setIsToastVisible}
          toastDurationMs={toastDurationMs ?? 3000}
          toastTransactionHash={toastTransactionHash ?? ''}
          txStatus={toastTransactionStatus ?? 'default'}
          txToastErrorMessage={toastErrorMessage ?? ''}
        />
      )}
    </>
  );
}

function SwapToast({
  toastPosition,
  isToastVisible,
  setIsToastVisible,
  toastDurationMs,
  toastTransactionHash,
}: {
  toastPosition: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  isToastVisible: boolean;
  setIsToastVisible: (isToastVisible: boolean) => void;
  toastDurationMs: number;
  toastTransactionHash: string;
}) {
  const { chainId } = useAccount();
  const chainExplorer = getChainExplorer(chainId);
  const txHash = '0x1234567890abcdef';

  return (
    <Toast
      position={toastPosition ?? 'bottom-center'}
      isToastVisible={isToastVisible ?? true}
      setIsToastVisible={setIsToastVisible}
      closeToast={() => setIsToastVisible(false)}
      durationMs={toastDurationMs ?? 3000}
    >
      <div className={cn(text.label2)}>{successSvg}</div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <p className={color.foreground}>Successful</p>
      </div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <a
          href={`${chainExplorer}/tx/${toastTransactionHash ?? txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      </div>
    </Toast>
  );
}

function TransactionToast({
  toastPosition,
  isToastVisible,
  setIsToastVisible,
  toastDurationMs,
  toastTransactionHash,
  txToastErrorMessage,
  txToastTransactionId,
  txStatus,
}: {
  toastPosition: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  isToastVisible: boolean;
  setIsToastVisible: (isToastVisible: boolean) => void;
  toastDurationMs: number;
  toastTransactionHash?: string;
  txToastErrorMessage?: string;
  txToastTransactionId?: string;
  txStatus: 'isBuildingTx' | 'inProgress' | 'success' | 'error' | 'default';
}) {
  return (
    <Toast
      position={toastPosition ?? 'bottom-center'}
      isToastVisible={isToastVisible ?? true}
      setIsToastVisible={setIsToastVisible}
      closeToast={() => setIsToastVisible(false)}
      durationMs={toastDurationMs ?? 3000}
    >
      <TransactionToastIconDemo txStatus={txStatus} />
      <TransactionToastLabelDemo txStatus={txStatus} />
      <TransactionToastActionDemo
        chainId={84532}
        transactionHash={toastTransactionHash}
        errorMessage={txToastErrorMessage}
        transactionId={txToastTransactionId}
        txStatus={txStatus}
      />
    </Toast>
  );
}

function TransactionToastIconDemo({
  txStatus,
  className,
}: {
  txStatus: 'isBuildingTx' | 'inProgress' | 'success' | 'error' | 'default';
  className?: string;
}) {
  const icon = useMemo(() => {
    if (txStatus === 'success') {
      return successSvg;
    }
    if (txStatus === 'error') {
      return errorSvg;
    }
    if (txStatus === 'inProgress' || txStatus === 'isBuildingTx') {
      return <Spinner className="px-1.5 py-1.5" />;
    }
    return null;
  }, [txStatus]);

  if (!icon) {
    return null;
  }

  return <div className={cn(text.label2, className)}>{icon}</div>;
}

function TransactionToastLabelDemo({
  txStatus,
  className,
}: {
  txStatus: 'isBuildingTx' | 'inProgress' | 'success' | 'error' | 'default';
  className?: string;
}) {
  const { label, labelClassName } = useMemo(() => {
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (txStatus === 'isBuildingTx') {
      label = 'Building transaction';
    }

    if (txStatus === 'inProgress') {
      label = 'Transaction in progress';
    }

    if (txStatus === 'success') {
      label = 'Successful';
    }

    if (txStatus === 'error') {
      label = 'Something went wrong';
      labelClassName = color.error;
    }

    return { label, labelClassName };
  }, [txStatus]);
  return (
    <div className={cn(text.label1, 'text-nowrap', className, labelClassName)}>
      <p className={color.foreground}>{label}</p>
    </div>
  );
}

function TransactionToastActionDemo({
  className,
  chainId,
  transactionHash,
  transactionId,
  errorMessage,
  txStatus,
}: {
  className?: string;
  chainId: number;
  transactionHash?: string;
  transactionId?: string;
  errorMessage?: string;
  txStatus: 'isBuildingTx' | 'inProgress' | 'success' | 'error' | 'default';
}) {
  const { showCallsStatus } = useShowCallsStatus();
  const onSubmit = () => {
    console.log('Playground.Transaction.onSubmit');
  };

  const { actionElement } = useMemo(() => {
    const chainExplorer = getChainExplorer(chainId);

    let actionElement: ReactNode = null;

    // EOA will have txn hash
    if (transactionHash) {
      actionElement = (
        <a
          href={`${chainExplorer}/tx/${transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      );
    }

    // SW will have txn id
    if (transactionId) {
      actionElement = (
        <button
          onClick={() => showCallsStatus({ id: transactionId })}
          type="button"
        >
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </button>
      );
    }

    if (errorMessage) {
      actionElement = (
        <button type="button" onClick={onSubmit}>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      );
    }

    return { actionElement };
  }, [
    errorMessage,
    onSubmit,
    showCallsStatus,
    transactionHash,
    transactionId,
    txStatus,
  ]);

  return (
    <div className={cn(text.label1, 'text-nowrap', className)}>
      {actionElement}
    </div>
  );
}
