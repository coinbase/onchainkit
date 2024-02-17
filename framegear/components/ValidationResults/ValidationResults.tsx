import { frameResultsAtom } from '@/utils/store';
import { useAtom } from 'jotai';

export function ValidationResults() {
  const [results] = useAtom(frameResultsAtom);
  const latestResult = results[results.length - 1];
  return (
    <div className="w-full rounded-xl bg-slate-200 p-2 text-black">
      {latestResult && (
        <>
          <span>
            <b>tl;dr</b> {latestResult.isValid ? 'lgtm ✅' : 'borked ❌'}
          </span>
          <dl className="grid grid-cols-2 border-t border-black">
            {Object.entries(latestResult.tags).map(([key, _value]) => (
              <>
                <dt>{key}</dt>
                <dd>{latestResult.errors[key] || '✅'}</dd>
              </>
            ))}
          </dl>
        </>
      )}
    </div>
  );
}
