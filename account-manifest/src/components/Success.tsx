'use client';

import { useCallback } from 'react';
import type { AccountAssociation } from '../hooks/useSignManifest';
import { Timer } from './Timer';

type SuccessProps = {
  accountAssocation: AccountAssociation | null;
};

export function Success({ accountAssocation }: SuccessProps) {
  if (!accountAssocation) {
    return null;
  }

  const displayAccountAssocation = {
    header: accountAssocation.header,
    payload: accountAssocation.payload,
    signature: accountAssocation.signature,
  };

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">
          Account Association Generated Successfully!
        </h3>
        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(
              JSON.stringify(displayAccountAssocation, null, 2),
            )
          }
          className="rounded bg-blue-800! px-2 py-1 text-sm hover:bg-blue-600!"
        >
          Copy
        </button>
      </div>
      <pre className="overflow-auto rounded p-4">
        {`{
  header: ${accountAssocation.header},
  payload: ${accountAssocation.payload},
  signature: ${accountAssocation.signature}
}`}
      </pre>
      <h3>
        This information has automatically been added to your .env file for use
        in the farcaster/.well-known file. Please close this window to return to
        the CLI.
      </h3>
      <button
        type="button"
        className="rounded bg-blue-800! px-2 py-2 hover:bg-blue-600!"
        onClick={handleClose}
      >
        This window will close in{' '}
        <Timer startMs={5000} callback={handleClose} />
      </button>
    </div>
  );
}
