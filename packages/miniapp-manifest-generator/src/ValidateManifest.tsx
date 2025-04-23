import { useCallback, useEffect, useState } from 'react';
import { Domain } from './components/steps/Domain';
import { ValidateAccountAssociation } from './components/ValidateAccountAssociation';
import { Preview } from './components/Preview';
import {
  FarcasterManifest,
  FrameEmbed,
  frameEmbedSchema,
  frameSchema,
} from './types';
import { ShowJson } from './components/ShowJson';
import { Step } from './components/Step';
import { useWebsocket } from './hooks/useWebsocket';
import { ValidateSchema } from './components/ValidateSchema';

function Verify() {
  useWebsocket();
  const [domain, setDomain] = useState<string>('');
  const [farcasterJson, setFarcasterJson] = useState<FarcasterManifest>();
  const [frameMetadataJson, setFrameMetadataJson] = useState<FrameEmbed>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const loadManifest = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(
        `/api/fetch-manifest?domain=${new URL(domain).hostname}`,
      );

      if (!response.ok) {
        throw new Error(`Error fetching manifest: ${response.statusText}`);
      }
      const data = await response.json();
      setFarcasterJson(data);

      const metaResponse = await fetch(
        `/api/fetch-frame-meta?domain=${domain}`,
      );
      if (!metaResponse.ok) {
        throw new Error(
          `Error fetching frame metadata: ${metaResponse.statusText}`,
        );
      }

      const metaData = await metaResponse.json();
      setFrameMetadataJson(metaData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    if (domain) {
      loadManifest();
    }
  }, [domain, loadManifest]);

  return (
    <main className="flex min-h-screen w-full flex-col gap-6 font-sans">
      <div className="p-4">
        <div className="flex gap-4 w-fit">
          <div>
            <Domain
              step={1}
              handleSetDomain={setDomain}
              description="This will be used to fetch and verify your Mini-App farcaster.json and frame metadata."
              requireValid={true}
              showHttpError={false}
              error={error}
            />
          </div>
          <button
            className="!bg-blue-500 hover:!bg-blue-600 disabled:!bg-gray-400 text-white px-4 py-2 rounded-md h-10 relative top-20"
            disabled={!domain}
            onClick={loadManifest}
          >
            {isLoading ? 'Loading...' : 'Refetch'}
          </button>
        </div>

        <Step
          number={2}
          label="Verifying farcaster.json account association"
          disabled={!farcasterJson}
        >
          <div>
            <div className="w-fit">
              {farcasterJson && (
                <ValidateAccountAssociation
                  accountAssociation={farcasterJson.accountAssociation}
                />
              )}
            </div>
            <div className={farcasterJson ? 'mt-4' : ''}>
              {farcasterJson && (
                <ShowJson label="farcaster.json" json={farcasterJson} />
              )}
            </div>
          </div>
        </Step>

        <Step
          number={3}
          label="Verifying farcaster.json frame data"
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
              {farcasterJson?.frame && (
                <ValidateSchema
                  schema={frameSchema}
                  schemaData={farcasterJson.frame}
                />
              )}
            </div>
            <div>
              {farcasterJson && (
                <ShowJson label="farcaster.json" json={farcasterJson} />
              )}
            </div>
          </div>
        </Step>

        <Step
          number={4}
          label="Verifying frame metadata"
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
          disabled={!frameMetadataJson}
        >
          <div>
            <div className="w-fit">
              {frameMetadataJson && (
                <ValidateSchema
                  schema={frameEmbedSchema}
                  schemaData={frameMetadataJson}
                />
              )}
            </div>
            <div>
              {frameMetadataJson && (
                <ShowJson label="frame metadata" json={frameMetadataJson} />
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
          <div>
            {frameMetadataJson && <Preview frameMetadata={frameMetadataJson} />}
          </div>
        </Step>
      </div>
    </main>
  );
}

export default Verify;
