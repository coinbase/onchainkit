'use client';
import { Address } from '@/identity';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { TextInput } from '../../../internal/components/TextInput';
import { isValidAmount } from '../../../internal/utils/isValidAmount';
import { background, border, cn, color, text } from '../../../styles/theme';
import { TokenSelectDropdown } from '../../../token';
import { ETH_BY_CHAIN } from '../constants';
import type { BridgeableToken } from '../types';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

interface AppchainBridgeInputProps {
  className?: string;
  delayMs?: number;
  bridgeableTokens?: BridgeableToken[];
}

const defaultBridgeableTokens = [
  {
    ...ETH_BY_CHAIN[8453],
    remoteToken: ETH_BY_CHAIN[8453].address,
  } as BridgeableToken,
  {
    name: 'RunChainsDMC',
    address: '0x4AC38D58d44f67c71BD1CE8eBad9a4D2b0FD3320',
    symbol: 'RCDMC',
    decimals: 18,
    image: 'https://img.cryptorank.io/coins/weth1701090834118.png',
    chainId: 8453,
    remoteToken: '0x8D4e2e4fd51f80A055ecb36833EC381D40B3C7e6',
  } as BridgeableToken,
];

export function AppchainBridgeInput({
  className,
  delayMs = 50,
  bridgeableTokens = defaultBridgeableTokens,
}: AppchainBridgeInputProps) {
  const {
    balance,
    bridgeParams,
    to,
    isPriceLoading,
    handleAmountChange,
    setIsAddressModalOpen,
  } = useAppchainBridgeContext();
  const [currentToken, setCurrentToken] = useState(bridgeableTokens[0]);
  const { address } = useAccount();
  const insufficientBalance = useMemo(() => {
    return balance && Number(balance) < Number(bridgeParams.amount);
  }, [balance, bridgeParams.amount]);

  const label = insufficientBalance ? (
    'Insufficient funds'
  ) : isPriceLoading ? (
    <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
  ) : bridgeParams.amountUSD === 'NaN' ? (
    ''
  ) : (
    `~$${bridgeParams.amountUSD}`
  );

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
          >
            <Address
              address={
                bridgeParams.recipient ||
                '0x0000000000000000000000000000000000000000'
              }
              hasCopyAddressOnClick={false}
              className="!text-white"
            />
          </button>{' '}
          on <span className="inline-flex items-center w-4 h-4">{to.icon}</span>
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
