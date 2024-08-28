import { cn, text } from '../../styles/theme';
import type { SwapMessageReact } from '../types';
import { getSwapMessage } from '../utils/getSwapMessage';
import { useSwapContext } from './SwapProvider';

export function SwapMessage({ className }: SwapMessageReact) {
  const {
    address,
    to,
    from,
    error,
    loading,
    isTransactionPending,
    lifeCycleStatus: { statusData },
  } = useSwapContext();

  const isMissingRequiredFields =
    !!statusData &&
    'isMissingRequiredField' in statusData &&
    statusData?.isMissingRequiredField;

  const message = getSwapMessage({
    address,
    error,
    from,
    loading,
    isMissingRequiredFields,
    isTransactionPending,
    to,
  });

  return (
    <div
      className={cn('flex pt-2', text.label2, className)}
      data-testid="ockSwapMessage_Message"
    >
      {message}
    </div>
  );
}
