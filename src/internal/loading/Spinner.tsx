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
          'border-4 border-t-3 border-gray-200 animate-spin',
          'border-t-blue-500 rounded-full px-2.5 py-2.5',
        )}
      ></div>
    </div>
  );
}
