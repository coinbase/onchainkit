import { cn } from '../../styles/theme';

export function NFTErrorFallback({ error }: { error: Error }) {
  return (
    <div
      className={cn(
        'text-ock-text-foreground',
        'bg-ock-bg-default',
        'border-ock-bg-default-active',
        'rounded-ock-default',
        'flex w-full max-w-[500px] flex-col items-center justify-center border px-6 py-4',
      )}
      data-testid="ockNFTErrorFallback_Container"
    >
      <div>Sorry, please try again later.</div>
      <div>{error.message}</div>
    </div>
  );
}
