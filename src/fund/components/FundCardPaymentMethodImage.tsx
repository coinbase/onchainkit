import { useIcon } from '../../core-react/internal/hooks/useIcon';
import { cn, icon as iconTheme } from '../../styles/theme';
import type { FundCardPaymentMethodImagePropsReact } from '../types';

export function FundCardPaymentMethodImage({
  className,
  paymentMethod,
}: FundCardPaymentMethodImagePropsReact) {
  const { icon } = paymentMethod;

  // Special case for coinbasePay icon color
  const iconColor = icon === 'coinbasePay' ? iconTheme.primary : undefined;

  const iconSvg = useIcon({ icon, className: `${iconColor}` });

  return (
    <div
      data-testid="fundCardPaymentMethodImage__iconContainer"
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-[50%]',
        className,
      )}
    >
      {iconSvg}
    </div>
  );
}
