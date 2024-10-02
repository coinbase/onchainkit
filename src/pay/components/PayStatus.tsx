import { cn, text } from '../../styles/theme';
import { useGetPayStatus } from '../hooks/useGetPayStatus';

export function PayStatus({ className }: { className?: string }) {
  const { label, labelClassName } = useGetPayStatus();

  return (
    <div className={cn('flex justify-between', className)}>
      <div className={cn(text.label2, className)}>
        <p className={cn(labelClassName, className)}>{label}</p>
      </div>
    </div>
  );
}
