'use client';
import { toggleSvg } from '@/internal/svg/toggleSvg';
import { cn, pressable } from '@/styles/theme';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';
interface AppchainNetworkToggleButtonProps {
  className?: string;
}

export function AppchainNetworkToggleButton({
  className,
}: AppchainNetworkToggleButtonProps) {
  const { handleToggle } = useAppchainBridgeContext();

  return (
    <button
      type="button"
      className={cn(
        pressable.alternate,
        'border-ock-bg-default',
        'flex h-14 w-14 items-center justify-center',
        'rounded-lg border-4 border-solid',
        'rotate-90',
        '-translate-x-1/2 absolute left-1/2 z-10',
        className,
      )}
      data-testid="AppchainNetworkToggleButton"
      onClick={handleToggle}
    >
      {toggleSvg}
    </button>
  );
}
