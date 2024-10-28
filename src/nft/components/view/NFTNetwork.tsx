import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { baseSvg } from '../../../internal/svg/baseSvg';
import { cn, color, text } from '../../../styles/theme';

type NFTNetworkReact = {
  className?: string;
  label?: ReactNode;
};

const networkMap = {
  Base: baseSvg,
} as Record<string, ReactNode>;

export function NFTNetwork({ className, label = 'Network' }: NFTNetworkReact) {
  const { chain } = useAccount();

  if (!chain || !networkMap[chain.name]) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between py-0.5',
        text.label2,
        className,
      )}
    >
      <div className={cn(color.foregroundMuted)}>{label}</div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 object-cover">{networkMap[chain.name]}</div>
        <div>{chain.name}</div>
      </div>
    </div>
  );
}
