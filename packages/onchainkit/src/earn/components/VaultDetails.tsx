'use client';
import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Popover } from '@/internal/components/Popover';
import { Skeleton } from '@/internal/components/Skeleton';
import { etherscanSvg } from '@/internal/svg/etherscanSvg';
import { infoSvg } from '@/internal/svg/infoSvg';
import { background, border, cn, color, text } from '@/styles/theme';
import { TokenImage } from '@/token';
import { useRef } from 'react';
import { useState } from 'react';
import { useEarnContext } from './EarnProvider';

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { vaultToken, vaultName, deposits, liquidity, vaultAddress } =
    useEarnContext();

  if (!vaultToken || !vaultName) {
    return <Skeleton className="!rounded-full h-7 min-w-28" />;
  }

  return (
    <div
      ref={anchorRef}
      className={cn(
        text.label1,
        color.foregroundMuted,
        background.alternate,
        'flex items-center justify-center gap-2 rounded-full p-1 px-3',
      )}
      data-testid="ock-vaultDetails"
    >
      <TokenImage token={vaultToken} size={16} />
      <span className="max-w-24 truncate" title={vaultName}>
        {vaultName}
      </span>
      <button
        ref={triggerRef}
        type="button"
        data-testid="ock-vaultDetailsButton"
        className={cn(
          'size-3 [&_path]:fill-[var(--ock-icon-color-foreground-muted)] [&_path]:transition-colors [&_path]:ease-in-out [&_path]:hover:fill-[var(--ock-icon-color-foreground)]',
          isOpen && '[&_path]:fill-[var(--ock-icon-color-foreground)]',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {infoSvg}
      </button>

      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="bottom"
        align="start"
        trigger={triggerRef}
        anchor={anchorRef.current}
        offset={4}
      >
        <div
          className={cn(
            background.default,
            color.foreground,
            border.defaultActive,
            background.default,
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
              color.primary,
              'flex max-w-fit items-center gap-1 hover:opacity-80',
            )}
            data-testid="ock-vaultDetailsBaseScanLink"
          >
            <div>View on BaseScan</div>
            <div className="h-3 w-3">{etherscanSvg}</div>
          </a>
        </div>
      </Popover>
    </div>
  );
}
