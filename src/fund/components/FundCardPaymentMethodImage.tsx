import { useMemo } from 'react';
import { cn, icon as iconTheme} from '../../styles/theme';
import { useIcon } from '../../core-react/internal/hooks/useIcon';
import type { FundCardPaymentMethodImagePropsReact } from '../types';

export function FundCardPaymentMethodImage({ className, size = 24, paymentMethod }: FundCardPaymentMethodImagePropsReact) {
  const { icon } = paymentMethod;

  // Special case for coinbasePay icon color
  const iconColor = icon === 'coinbasePay' ? iconTheme.primary : undefined;

  const iconSvg = useIcon({ icon, className: iconColor });

  const styles = useMemo(() => {
    return {
      image: {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      },
      placeholderImage: {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      },
    };
  }, [size]);

  if (!iconSvg) {
    return (
      <div
        className={cn('overflow-hidden rounded-full', className)}
        data-testid="ockTokenImage_NoImage"
        style={styles.image}
      >
        <div style={styles.placeholderImage} />
      </div>
    );
  }

  return (
    <div  className={cn('flex items-center justify-center overflow-hidden rounded-[50%]', className)} style={styles.image}>
      {iconSvg}
    </div>
  );
}
