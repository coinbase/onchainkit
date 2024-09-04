import { useIsMounted } from '../../useIsMounted';
import { PayProvider } from './PayProvider';

export function Pay({
  chainId,
  chargeId,
  children,
  className,
}: {
  chainId: number;
  chargeId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isMounted = useIsMounted();
  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <PayProvider chargeId={chargeId} chainId={chainId} className={className}>
      {children}
    </PayProvider>
  );
}
