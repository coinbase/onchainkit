import { cn } from '../../styles/theme';

export function NFTErrorFallback({ error }: { error: Error }) {
  return (
    <div
      className={cn(
        'text-ock-foreground',
        'bg-ock-background',
        'border-ock-background-active',
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
