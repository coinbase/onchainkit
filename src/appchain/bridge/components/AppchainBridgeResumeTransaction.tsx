'use client';
import { PressableIcon } from '@/internal/components/PressableIcon';
import { TextInput } from '@/internal/components/TextInput';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { background, border, cn, color, pressable, text } from '@/styles/theme';
import { useState } from 'react';
import type { Hex } from 'viem';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

export const AppchainBridgeResumeTransaction = () => {
  const { setIsResumeTransactionModalOpen, handleResumeTransaction } =
    useAppchainBridgeContext();
  const [withdrawalTxHash, setWithdrawalTxHash] = useState<string | null>(null);
  const [invalidInput, setInvalidInput] = useState<boolean>(false);

  const backButton = (
    <PressableIcon
      ariaLabel="Back button"
      onClick={() => {
        setIsResumeTransactionModalOpen(false);
      }}
    >
      <div className="p-2">{backArrowSvg}</div>
    </PressableIcon>
  );

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <div className="flex items-center">
          {backButton}
          <h2 className="ock-text-foreground flex-1 text-center font-medium text-md">
            Resume Transaction
          </h2>
        </div>
        <div
          className={cn(
            background.secondary,
            border.radius,
            'box-border flex h-20 w-full flex-col items-start justify-center gap-2 p-4',
            'mt-4',
          )}
        >
          <span
            className={cn(
              text.label2,
              color.foregroundMuted,
              'flex items-center gap-1',
            )}
          >
            Transaction hash
          </span>
          <TextInput
            className={cn(
              text.label2,
              color.foregroundMuted,
              background.secondary,
              'w-full border-none',
              'focus:border-none focus:outline-none focus:ring-0',
            )}
            placeholder="0x..."
            onChange={(value) => {
              setWithdrawalTxHash(value);
            }}
            value={withdrawalTxHash || ''}
          />
        </div>
        {withdrawalTxHash && invalidInput && (
          <div className="mt-2 flex">
            <p className="text-foregroundMuted text-red-500 text-sm">
              Please enter a valid transaction hash
            </p>
          </div>
        )}
      </div>
      <div className="flex w-full justify-between">
        <button
          type="button"
          className={cn(
            pressable.primary,
            'w-full rounded-xl px-4 py-3 font-medium text-base leading-6',
            'text-center',
          )}
          onClick={() => {
            if (
              !withdrawalTxHash?.startsWith('0x') ||
              withdrawalTxHash.length !== 66
            ) {
              setInvalidInput(true);
              return;
            }
            handleResumeTransaction(withdrawalTxHash as Hex);
          }}
        >
          <div
            className={cn(text.headline, color.inverse, 'flex justify-center')}
          >
            Resume Transaction
          </div>
        </button>
      </div>
    </div>
  );
};
