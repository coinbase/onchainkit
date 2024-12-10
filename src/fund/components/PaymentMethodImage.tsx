import { useMemo } from 'react';
import { cn, icon as iconTheme} from '../../styles/theme';
//import type { TokenImageReact } from '../types';
// import { getTokenImageColor } from '../utils/getTokenImageColor';
import type { PaymentMethod } from './PaymentMethodSelectorDropdown';
import { useIcon } from '../../internal/hooks/useIcon';

type Props = {
  className?: string;
  size?: number;
  paymentMethod: PaymentMethod
};

export function PaymentMethodImage({ className, size = 24, paymentMethod }: Props) {
  const { icon, name } = paymentMethod;
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
        //background: getTokenImageColor(name),
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
    // <img
    //   className={cn('overflow-hidden rounded-[50%]', className)}
    //   alt="token-image"
    //   data-testid="ockTokenImage_Image"
    //   style={styles.image}
    //   src={iconSvg}
    // />
  );
}
