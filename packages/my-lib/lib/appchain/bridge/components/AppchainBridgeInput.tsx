'use client';
import { Address } from '@/identity';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { TextInput } from '../../../internal/components/TextInput';
import { isValidAmount } from '../../../internal/utils/isValidAmount';
import { background, border, cn, color, text } from '../../../styles/theme';
import { TokenSelectDropdown } from '../../../token';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

interface AppchainBridgeInputProps {
  className?: string;
  delayMs?: number;
}

export function AppchainBridgeInput({
  className,
  delayMs = 50,
}: AppchainBridgeInputProps) {
  const {
    balance,
    bridgeParams,
    bridgeableTokens,
    to,
    isPriceLoading,
    handleAmountChange,
    setIsAddressModalOpen,
    resetDepositStatus,
  } = useAppchainBridgeContext();
  const [currentToken, setCurrentToken] = useState(bridgeableTokens[0]);
  const { address } = useAccount();
  const insufficientBalance = useMemo(() => {
    return balance && Number(balance) < Number(bridgeParams.amount);
  }, [balance, bridgeParams.amount]);

  const label = useMemo(() => {
    if (insufficientBalance) {
      return 'Insufficient funds';
    }
    if (isPriceLoading) {
      return (
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      );
    }
    if (bridgeParams.amountUSD === 'NaN') {
      return '';
    }
    return `~$${bridgeParams.amountUSD}`;
  }, [insufficientBalance, isPriceLoading, bridgeParams.amountUSD]);

  return (
    <div
      className={cn(
        background.secondary,
        border.radius,
        'box-border flex h-[148px] w-full flex-col items-start p-4',
        className,
      )}
      data-testid="ockBridgeAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <span
          className={cn(
            text.label2,
            color.foregroundMuted,
            'flex items-center gap-1',
          )}
        >
          Send to{' '}
          <button
            type="button"
            className={cn(
              'cursor-pointer hover:underline focus:outline-none',
              text.label2,
            )}
            onClick={() => {
              setIsAddressModalOpen(true);
            }}
            title={bridgeParams.recipient}
          >
            <Address
              address={
                bridgeParams.recipient ||
                '0x0000000000000000000000000000000000000000'
              }
              hasCopyAddressOnClick={false}
              className={cn(text.label2, '!text-[var(--ock-text-foreground)]')}
            />
          </button>{' '}
          on <span className="inline-flex h-4 w-4 items-center">{to.icon}</span>
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <TextInput
          className={cn(
            'mr-2 w-full border-[none] bg-transparent font-display text-[2.5rem]',
            'leading-none outline-none',
            color.foreground,
            insufficientBalance && color.error,
          )}
          placeholder="0.00"
          delayMs={delayMs}
          inputValidator={isValidAmount}
          onChange={(value) => {
            handleAmountChange({
              amount: value,
              token: currentToken,
            });
          }}
          value={bridgeParams.amount}
        />
        <TokenSelectDropdown
          token={currentToken}
          options={bridgeableTokens}
          setToken={(token) => {
            handleAmountChange({
              amount: bridgeParams.amount,
              token: token,
            });
            resetDepositStatus();
            setCurrentToken(token);
          }}
        />
      </div>
      <div className="mt-4 flex w-full justify-between">
        <div className="flex items-center">
          <span
            className={cn(
              text.label2,
              color.foregroundMuted,
              insufficientBalance && color.error,
            )}
          >
            {label}
          </span>
        </div>
        {address && (
          <div className="flex items-center">
            <span
              className={cn(text.label2, color.foregroundMuted)}
            >{`Balance: ${Number(balance).toLocaleString(undefined, {
              maximumFractionDigits: 5,
              minimumFractionDigits: 0,
            })}`}</span>
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center px-2 py-1"
              data-testid="ockBridgeAmountInput_MaxButton"
              onClick={() => {
                handleAmountChange({
                  amount: balance,
                  token: bridgeParams.token,
                });
              }}
            >
              <span className={cn(text.label1, color.primary)}>Max</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
