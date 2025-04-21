import { useCallback, useEffect, useState } from 'react';
import { Connect } from './components/steps/Connect';
import { Domain } from './components/steps/Domain';
import { ValidateAccountAssociation } from './components/ValidateAccountAssociation';
import { Preview } from './components/Preview';
import { FarcasterManifest, FrameMetadata } from './types';
import { ShowJson } from './components/ShowJson';
import { Step } from './components/Step';
import { useWebsocket } from './hooks/useWebsocket';
import { ValidateSchema } from './components/ValidateSchema';
import {
  domainFrameConfigSchema,
  frameEmbedNextSchema,
} from '@farcaster/frame-core';

function Verify() {
  useWebsocket();
  const [domain, setDomain] = useState<string>('');
  const [farcasterJson, setFarcasterJson] = useState<FarcasterManifest>();
  const [frameMetadataJson, setFrameMetadataJson] = useState<FrameMetadata>();
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

  const testFarcasterJson = {
    version: '2',
    homeUrl: 'https://onchainkit.xyz/playground/minikit',
    iconUrl: 'https://onchainkit.xyz/playground/snake.png',
    imageUrl: 'https://onchainkit.xyz/playground/snake.png',
    buttonTitle: 'Launch MiniKit',
    splashImageUrl: 'https://onchainkit.xyz/playground/snake.png',
    splashBackgroundColor: '#FFFFFF',
    webhookUrl: 'https://onchainkit.xyz/playground/api/webhook',
  };

  const testFrameData = {
    version: '1',
    imageUrl: 'https://onchainkit.xyz/playground/snake.png',
    button: {
      title: 'Launch MiniKit',
      action: {
        type: 'launch_framestuff',
        name: 'MiniKit',
        url: 'https://onchainkit.xyz/playground/minikit',
        splashImageUrl: 'https://onchainkit.xyz/playground/snake.png',
        splashBackgroundColor: '#FFFFFF',
      },
    },
  };

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
            className="!bg-blue-500 hover:!bg-blue-600 disabled:!bg-gray-400 text-white px-4 py-2 rounded-md h-10 relative top-20"
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
          label="Verifying farcaster.json"
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
              {/*farcasterJson.frame*/}
              {farcasterJson && (
                <ValidateSchema
                  schema={domainFrameConfigSchema}
                  schemaData={testFarcasterJson}
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
          number={5}
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
                  schema={frameEmbedNextSchema}
                  schemaData={testFrameData}
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
          number={6}
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
