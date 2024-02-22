import { frameResultsAtom } from '@/utils/store';
import { vNextSchema } from '@/utils/validation';
import { useAtom } from 'jotai';
import { PropsWithChildren, useMemo } from 'react';
import { type SchemaDescription } from 'yup';

const REQUIRED_FIELD_NAMES = Object.entries(vNextSchema.describe().fields).reduce(
  (acc, [name, description]) =>
    (description as SchemaDescription).optional ? acc : [...acc, name],
  [] as string[],
);

export function ValidationResults() {
  const [results] = useAtom(frameResultsAtom);

  if (results.length === 0) {
    return <ValidationResultsPlaceholder />;
  }

  return <ValidationResultsContent />;
}

function ValidationResultsPlaceholder() {
  return (
    <div className="flex flex-col gap-4">
      <h2>Frame validations</h2>
      <div className="bg-content flex w-full flex-col gap-4 rounded-xl p-6">
        <p>No data yet.</p>
      </div>
    </div>
  );
}

function ValidationResultsContent() {
  const [results] = useAtom(frameResultsAtom);
  const latestResult = results[results.length - 1];
  const optionalTags = useMemo(() => {
    const requiredNames = new Set(REQUIRED_FIELD_NAMES);
    const tagEntries = Object.entries(latestResult?.tags);
    return tagEntries.filter((tag) => !requiredNames.has(tag[0]));
  }, [latestResult]);

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
        <ValidationEntriesWrapper title="Required Fields">
          {REQUIRED_FIELD_NAMES.map((name) => {
            const value = latestResult.tags[name];
            return (
              <ValidationEntry
                key={name}
                name={name}
                value={value}
                error={latestResult.errors[name]}
              />
            );
          })}
        </ValidationEntriesWrapper>
        {optionalTags.length > 0 && (
          <ValidationEntriesWrapper title="Optional Fields">
            {optionalTags.map(([key, value]) => (
              <ValidationEntry
                key={key}
                name={key}
                value={value}
                error={latestResult.errors[key]}
              />
            ))}
          </ValidationEntriesWrapper>
        )}
      </div>
    </div>
  );
}

function ValidationEntriesWrapper({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <figure>
      <figcaption className="border-pallette-line mb-4 border-b pb-4 pt-4 text-center font-bold first:pt-0">
        {title}
      </figcaption>
      <ul className="flex list-none flex-col gap-4 p-0">{children}</ul>
    </figure>
  );
}

type ValidationEntryProps = { name: string; value?: string; error?: string };
function ValidationEntry({ name, value, error }: ValidationEntryProps) {
  return (
    <div
      className={`border-pallette-line flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0`}
    >
      <div className="flex justify-between">
        <span>{name}</span>
        <span>{error ? '🔴' : '🟢'}</span>
      </div>
      <div className="font-mono">{value || 'Not set'}</div>
      {!!error && <div className="font-mono italic">{error}</div>}
    </div>
  );
}
