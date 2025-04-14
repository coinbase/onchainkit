import { useState } from 'react';
import { Timer } from './Timer';
import { AccountAssociation } from '../types';

type SuccessProps = {
  accountAssocation: AccountAssociation | null;
  handleClose: () => void;
};

export function Success({ accountAssocation, handleClose }: SuccessProps) {
  const [cancelClose, setCancelClose] = useState(false);

  if (!accountAssocation) {
    return null;
  }

  const displayAccountAssocation = {
    header: accountAssocation.header,
    payload: accountAssocation.payload,
    signature: accountAssocation.signature,
  };

  return (
    <div className="flex flex-col gap-2 rounded p-4 text-black">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">
          Mini-App Manifest Generated Successfully!
        </h3>
        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(
              JSON.stringify(displayAccountAssocation, null, 2),
            )
          }
          className="rounded !bg-blue-800 px-2 py-1 text-sm text-white hover:!bg-blue-600"
        >
          Copy
        </button>
      </div>
      <pre className="max-w-[600px] overflow-auto rounded p-4">
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
      <div className="flex gap-2 w-full">
        <button
          type="button"
          className="flex-grow rounded !bg-blue-800 px-2 py-2 text-white hover:!bg-blue-600"
          onClick={handleClose}
        >
          {cancelClose ? (
            'Close window and return to CLI'
          ) : (
            <>
              This window will close automatically in{' '}
              <Timer startMs={5000} callback={handleClose} />
            </>
          )}
        </button>
        {!cancelClose && (
          <button
            type="button"
            onClick={() => setCancelClose(true)}
            className="rounded !bg-red-800 px-2 py-2 text-white hover:!bg-red-600"
          >
            Cancel close
          </button>
        )}
      </div>
    </div>
  );
}
