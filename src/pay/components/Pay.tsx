import { cn } from '../../styles/theme';
import type { LifecycleStatus } from '../../transaction';
import { useIsMounted } from '../../useIsMounted';
import { PayProvider } from './PayProvider';

type PayProps = {
  chainId: number;
  chargeHandler: () => Promise<string>;
  children: React.ReactNode;
  className?: string;
  onStatus?: (status: LifecycleStatus) => void;
};

export function Pay({
  chainId,
  chargeHandler,
  children,
  className,
  onStatus,
}: PayProps) {
  const isMounted = useIsMounted();
  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <PayProvider
      chargeHandler={chargeHandler}
      chainId={chainId}
      className={className}
      onStatus={onStatus}
    >
      <div className={cn(className, 'flex w-full flex-col gap-2')}>
        {children}
      </div>
    </PayProvider>
  );
}
