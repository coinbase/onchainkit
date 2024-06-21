import { cn } from '../../styles/theme';

export function Spinner() {
  return (
    <div
      className="flex h-full items-center justify-center"
      data-testid="ockSpinner"
    >
      <div
        className={cn(
          'animate-spin border-4 border-gray-200 border-t-3',
          'rounded-full border-t-blue-500 px-2.5 py-2.5',
        )}
      />
    </div>
  );
}
