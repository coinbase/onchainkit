import { useIcon } from '../../internal/hooks/useIcon';
import { cn } from '../../styles/theme';
import type { FundCardPaymentMethodImagePropsReact } from '../types';

export function FundCardPaymentMethodImage({
  className,
  paymentMethod,
}: FundCardPaymentMethodImagePropsReact) {
  const { icon } = paymentMethod;

  const iconSvg = useIcon({ icon });

  return (
    <div
      data-testid="ockFundCardPaymentMethodImage__iconContainer"
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-[50%]',
        className,
      )}
    >
      {iconSvg}
    </div>
  );
}
