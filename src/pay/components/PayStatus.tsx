import { cn, text } from '../../styles/theme';
import { useGetPayStatus } from '../hooks/useGetPayStatus';
import type { PayStatusReact } from '../types';

export function PayStatus({ className }: PayStatusReact) {
  const { label, labelClassName } = useGetPayStatus();

  return (
    <div className={cn('flex justify-between', className)}>
      <div className={text.label2}>
        <p className={labelClassName}>{label}</p>
      </div>
    </div>
  );
}
