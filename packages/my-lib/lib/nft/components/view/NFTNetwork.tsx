import type { ReactNode } from 'react';
import { type Chain, base } from 'viem/chains';
import { useChainId } from 'wagmi';
import { baseSvg } from '../../../internal/svg/baseSvg';
import { cn, color, text } from '../../../styles/theme';

type NFTNetworkReact = {
  className?: string;
  label?: ReactNode;
};

const networkMap = {
  8453: {
    chain: base,
    icon: baseSvg,
  },
} as Record<number, { chain: Chain; icon: ReactNode }>;

export function NFTNetwork({ className, label = 'Network' }: NFTNetworkReact) {
  const chainId = useChainId();

  if (!chainId || !networkMap[chainId]) {
    return null;
  }

  const { chain, icon } = networkMap[chainId];

  return (
    <div
      className={cn(
        text.label2,
        'flex items-center justify-between',
        className,
      )}
    >
      <div className={cn(color.foregroundMuted)}>{label}</div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 object-cover">{icon}</div>
        <div>{chain.name}</div>
      </div>
    </div>
  );
}
