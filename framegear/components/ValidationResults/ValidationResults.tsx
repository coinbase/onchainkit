import { frameResultsAtom } from '@/utils/store';
import { useAtom } from 'jotai';

export function ValidationResults() {
  const [results] = useAtom(frameResultsAtom);
  const latestResult = results[results.length - 1];
  return (
    <div className="flex flex-col gap-4">
      <h2>
        Frame validations{' '}
        {!!latestResult && (
          <span className="">
            (<b>tl;dr:</b> {latestResult.isValid ? 'lgtm ✅' : 'borked ❌'})
          </span>
        )}
      </h2>
      <div className="bg-content flex w-full flex-col gap-4 rounded-xl p-6">
        {latestResult && (
          <dl className="flex flex-col gap-4">
            {Object.entries(latestResult.tags).map(([key, value]) => (
              <ValidationEntry
                key={key}
                name={key}
                value={value}
                error={latestResult.errors[key]}
              />
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

function ValidationEntry({ name, value, error }: { name: string; value: string; error?: string }) {
  return (
    <div
      className={`border-pallette-line flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0`}
    >
      <div className="flex justify-between">
        <span>{name}</span>
        <span>{error ? '🔴' : '🟢'}</span>
      </div>
      <div className="font-mono">{value}</div>
    </div>
  );
}
