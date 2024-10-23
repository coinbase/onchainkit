import type { ReactNode } from 'react';
import { baseSvg } from '../../../internal/svg/baseSvg';
import { cn, text } from '../../../styles/theme';
import { useOnchainKit } from '../../../useOnchainKit';

type NFTNetworkProps = {
  className?: string;
  label?: ReactNode;
};

const networkMap = {
  Base: baseSvg,
} as Record<string, ReactNode>;

export function NFTNetwork({ className, label = 'Network' }: NFTNetworkProps) {
  const { chain } = useOnchainKit();

  if (!chain || !networkMap[chain.name]) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between py-2',
        text.label2,
        className,
      )}
    >
      <div>{label}</div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 object-cover">{networkMap[chain.name]}</div>
        <div>{chain.name}</div>
      </div>
    </div>
  );
}
