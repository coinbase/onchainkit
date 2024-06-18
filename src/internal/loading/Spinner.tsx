import { cn } from '../../utils/cn';

/* istanbul ignore next */
export function Spinner() {
  return (
    <div
      className="flex justify-center items-center h-full"
      data-testid="ockSpinner"
    >
      <div
        className={cn(
          'animate-spin border-4 border-t-3 border-gray-200',
          'rounded-full border-t-blue-500 px-2.5 py-2.5',
        )}
      ></div>
    </div>
  );
}
