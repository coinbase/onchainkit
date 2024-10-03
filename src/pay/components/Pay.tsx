import { cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import type { PayReact } from '../types';
import { PayProvider } from './PayProvider';

export function Pay({
  chargeHandler,
  children,
  className,
  onStatus,
  productId,
}: PayReact) {
  const isMounted = useIsMounted();
  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <PayProvider
      chargeHandler={chargeHandler}
      onStatus={onStatus}
      productId={productId}
    >
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {children}
      </div>
    </PayProvider>
  );
}
