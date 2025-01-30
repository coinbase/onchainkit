'use client';

import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { getChainExplorer } from '@/core/network/getChainExplorer';
import { Transaction } from '@/transaction/components/Transaction';
import { TransactionButton } from '@/transaction/components/TransactionButton';
import { TransactionSponsor } from '@/transaction/components/TransactionSponsor';
import { TransactionStatus } from '@/transaction/components/TransactionStatus';
import { TransactionStatusAction } from '@/transaction/components/TransactionStatusAction';
import { TransactionStatusLabel } from '@/transaction/components/TransactionStatusLabel';
import { useTransactionContext } from '@/transaction/components/TransactionProvider';
import type { Call, TransactionButtonReact } from '@/transaction/types';
import { useCallback, useMemo } from 'react';
import type { TransactionReceipt } from 'viem';
import { type Chain, base } from 'viem/chains';
import { useChainId } from 'wagmi';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useWalletContext } from '../../WalletProvider';
import type { SendLifecycleStatus } from '../types';

type SendButtonProps = {
  label?: string;
  senderChain?: Chain | null;
  cryptoAmount: string | null;
  selectedToken: PortfolioTokenWithFiatValue | null;
  callData: Call | null;
  sendTransactionError: string | null;
  onStatus?: (status: SendLifecycleStatus) => void;
  className?: string;
} & Pick<
  TransactionButtonReact,
  'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'
>;

export function SendButton({
  label = 'Continue',
  senderChain,
  disabled,
  selectedToken,
  cryptoAmount,
  callData,
  onStatus,
  pendingOverride,
  successOverride,
  sendTransactionError,
  errorOverride,
  className,
}: SendButtonProps) {
  const isSponsored = false;

  const sendButtonLabel = useMemo(() => {
    if (
      Number(cryptoAmount) >
      Number(selectedToken?.cryptoBalance) /
        10 ** Number(selectedToken?.decimals)
    ) {
      return 'Insufficient balance';
    }
    return label;
  }, [cryptoAmount, label, selectedToken]);

  const isDisabled = useMemo(() => {
    if (disabled) {
      return true;
    }
    if (Number(cryptoAmount) <= 0) {
      return true;
    }
    if (
      Number(cryptoAmount) >
      Number(selectedToken?.cryptoBalance) /
        10 ** Number(selectedToken?.decimals)
    ) {
      return true;
    }
    return false;
  }, [cryptoAmount, disabled, selectedToken]);

  return (
    <Transaction
      isSponsored={isSponsored}
      chainId={senderChain?.id ?? base.id}
      calls={callData ? [callData] : []}
      onStatus={onStatus}
    >
      <SendTransactionButton
        className={className}
        senderChain={senderChain}
        pendingOverride={pendingOverride}
        errorOverride={errorOverride}
        successOverride={successOverride}
        disabled={isDisabled}
        label={sendButtonLabel}
      />
      {!sendTransactionError && <TransactionSponsor />}
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}

/**
 * SendTransactionButton required to be a nested component in order to pull from TransactionContext.
 * Need to pull from TransactionContext in order to get transactionHash and transactionId.
 * Need transactionHash and transactionId in order to determine where to open the transaction in the wallet or explorer.
 */
function SendTransactionButton({
  className,
  senderChain,
  pendingOverride,
  errorOverride,
  successOverride,
  disabled,
  label,
}: {
  className?: string;
  senderChain?: Chain | null;
  pendingOverride?: TransactionButtonReact['pendingOverride'];
  errorOverride?: TransactionButtonReact['errorOverride'];
  successOverride?: TransactionButtonReact['successOverride'];
  disabled?: boolean;
  label: string;
}) {
  const { address } = useWalletContext();
  const { setShowSend } = useWalletAdvancedContext();

  const { transactionHash, transactionId } = useTransactionContext();

  const accountChainId = senderChain?.id ?? useChainId();

  const defaultSuccessHandler = useCallback(
    (receipt: TransactionReceipt | undefined) => {
      // SW will have txn id so open in wallet
      if (
        receipt &&
        transactionId &&
        transactionHash &&
        senderChain?.id &&
        address
      ) {
        const url = new URL('https://wallet.coinbase.com/assets/transactions');
        url.searchParams.set('contentParams[txHash]', transactionHash);
        url.searchParams.set(
          'contentParams[chainId]',
          JSON.stringify(senderChain?.id),
        );
        url.searchParams.set('contentParams[fromAddress]', address);
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // EOA will not have txn id so open in explorer
        const chainExplorer = getChainExplorer(accountChainId);
        window.open(
          `${chainExplorer}/tx/${transactionHash}`,
          '_blank',
          'noopener,noreferrer',
        );
      }
      setShowSend(false);
    },
    [
      address,
      senderChain,
      transactionId,
      transactionHash,
      accountChainId,
      setShowSend,
    ],
  );

  const defaultSuccessOverride = {
    onClick: defaultSuccessHandler,
  };

  return (
    <TransactionButton
      className={className}
      text={label}
      pendingOverride={pendingOverride}
      successOverride={successOverride ?? defaultSuccessOverride}
      errorOverride={errorOverride}
      disabled={disabled}
    />
  );
}
