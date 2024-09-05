import { Spinner } from '../../internal/components/Spinner';
import { coinbasePaySvg } from '../../internal/svg/coinbasePaySvg';
import { cn, text as styleText } from '../../styles/theme';
import { usePayContext } from './PayProvider';

export function PayButton({ text = 'Pay with Crypto' }: { text?: string }) {
  const { lifeCycleStatus, handleSubmit } = usePayContext();

  const isLoading = lifeCycleStatus?.statusName === 'transactionPending';

  return (
    <button
      className={cn(
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        styleText.headline,
        isLoading
          ? 'bg-[#9DBCFE]'
          : 'bg-[#0052FF] hover:bg-[#0045D8] active:bg-[#003AC2]',
        'transition-colors duration-200',
        'flex items-center justify-center',
        'h-[52px]',
        'min-w-[200px]',
      )}
      onClick={handleSubmit}
      type="button"
    >
      {isLoading ? (
        <Spinner className="w-5 h-5" />
      ) : (
        <>
          <div className="w-5 h-5 mr-2 flex items-center justify-center shrink-0">
            {coinbasePaySvg}
          </div>
          <span className={cn(styleText.headline, 'text-white')}>{text}</span>
        </>
      )}
    </button>
  );
}
