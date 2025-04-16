import { useCallback, useEffect, useState } from 'react';
import { Connect } from './components/steps/Connect';
import { Domain } from './components/steps/Domain';
import { ValidateAccountAssociation } from './components/ValidateAccountAssociation';
import { Preview } from './components/Preview';
import { ValidateFrame } from './components/ValidateFrame';
import { FarcasterJson } from './types';
import { FarcasterJsonRaw } from './components/FarcasterJsonRaw';
import { Step } from './components/Step';
import { useWebsocket } from './hooks/useWebsocket';

function Verify() {
  useWebsocket();
  const [domain, setDomain] = useState<string>('');
  const [farcasterJson, setFarcasterJson] = useState<FarcasterJson>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const loadManifest = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    const response = await fetch(
      `/api/fetch-manifest?domain=${new URL(domain).hostname}`,
    );

    if (!response.ok) {
      setError(response.statusText);
      setIsLoading(false);
      return;
    }
    const data = await response.json();
    setFarcasterJson(data);
    setIsLoading(false);
  }, [domain]);

  useEffect(() => {
    if (domain) {
      loadManifest();
    }
  }, [domain, loadManifest]);

  return (
    <main className="flex min-h-screen w-full flex-col gap-6 font-sans">
      <div className="p-4">
        <Connect />

        <div className="flex gap-4 w-fit">
          <div>
            <Domain
              handleSetDomain={setDomain}
              description="This will be used to fetch and verify your Mini-App farcaster.json."
              requireValid={true}
              showHttpError={false}
              error={error}
            />
          </div>
          <button
            className="!bg-blue-500 hover:!bg-blue-600 disabled:!bg-gray-400 text-white px-4 py-2 rounded-md h-10 self-center"
            disabled={!domain}
            onClick={loadManifest}
          >
            {isLoading ? 'Loading...' : 'Refetch'}
          </button>
        </div>

        <Step
          number={3}
          label="Verifying account association"
          disabled={!farcasterJson}
        >
          <div>
            {farcasterJson && (
              <ValidateAccountAssociation
                accountAssociation={farcasterJson.accountAssociation}
              />
            )}
          </div>
        </Step>

        <Step
          number={4}
          label="Verifying frame"
          description={
            <span>
              Validation according to{' '}
              <a
                href="https://miniapps.farcaster.xyz/docs/specification"
                target="_blank"
                rel="noreferrer"
                className="!underline"
              >
                Mini-App specification
              </a>
              .
            </span>
          }
          disabled={!farcasterJson}
        >
          <div>
            <div className="w-fit">
              {farcasterJson && <ValidateFrame frame={farcasterJson.frame} />}
            </div>
            <div>
              {farcasterJson && (
                <FarcasterJsonRaw farcasterJson={farcasterJson} />
              )}
            </div>
          </div>
        </Step>

        <Step
          number={5}
          label="Preview"
          description="This will preview your mini-app, but does not include the frames sdk."
          disabled={!farcasterJson}
        >
          <div>{farcasterJson && <Preview frame={farcasterJson.frame} />}</div>
        </Step>
      </div>
    </main>
  );
}

export default Verify;
