'use client';
import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Popover } from '@/internal/components/Popover';
import { Skeleton } from '@/internal/components/Skeleton';
import { etherscanSvg } from '@/internal/svg/etherscanSvg';
import { infoSvg } from '@/internal/svg/infoSvg';
import { cn, text } from '@/styles/theme';
import { TokenImage } from '@/token';
import { useState } from 'react';
import { useEarnContext } from './EarnProvider';
import { PopoverTrigger } from '@radix-ui/react-popover';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-8">
      <div>{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

export function VaultDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const { vaultToken, vaultName, deposits, liquidity, vaultAddress } =
    useEarnContext();

  if (!vaultToken || !vaultName) {
    return <Skeleton className="!rounded-full h-7 min-w-28" />;
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      side="bottom"
      align="start"
      sideOffset={4}
      anchor={
        <div
          className={cn(
            text.label1,
            'text-ock-foreground-muted',
            'bg-ock-background-alternate',
            'flex items-center justify-center gap-2 rounded-full p-1 px-3',
          )}
          data-testid="ock-vaultDetails"
        >
          <TokenImage token={vaultToken} size={16} />
          <span className="max-w-24 truncate" title={vaultName}>
            {vaultName}
          </span>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-testid="ock-vaultDetailsButton"
              className={cn(
                'size-3 [&_path]:fill-ock-foreground-muted [&_path]:transition-colors [&_path]:ease-in-out [&_path]:hover:fill-ock-foreground',
                isOpen && '[&_path]:fill-ock-foreground',
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {infoSvg}
            </button>
          </PopoverTrigger>
        </div>
      }
    >
      <div
        className={cn(
          'bg-ock-background',
          'text-ock-foreground',
          'border-ock-background-active',
          'bg-ock-background',
          'flex min-w-40 flex-col gap-3 rounded-lg border p-3 text-sm',
          'fade-in animate-in duration-200',
        )}
      >
        <div className="font-semibold">{vaultName}</div>
        <div className="flex flex-col gap-2">
          <Row
            label="Token"
            value={
              <div className="flex items-center gap-1">
                <TokenImage token={vaultToken} size={16} />
                <span className="max-w-24 truncate">{vaultToken.symbol}</span>
              </div>
            }
          />
          {deposits ? (
            <Row
              label="Total deposits"
              value={`${getTruncatedAmount(deposits, 1, 'compact')} ${
                vaultToken.symbol
              }`}
            />
          ) : null}
          {liquidity ? (
            <Row
              label="Liquidity"
              value={`${getTruncatedAmount(liquidity, 1, 'compact')} ${
                vaultToken.symbol
              }`}
            />
          ) : null}
        </div>
        <a
          href={`https://basescan.org/address/${vaultAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'text-ock-primary',
            'flex max-w-fit items-center gap-1 hover:opacity-80',
          )}
          data-testid="ock-vaultDetailsBaseScanLink"
        >
          <div>View on BaseScan</div>
          <div className="h-3 w-3">{etherscanSvg}</div>
        </a>
      </div>
    </Popover>
  );
}
