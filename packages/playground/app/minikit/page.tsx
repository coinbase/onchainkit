'use client';

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from '@coinbase/onchainkit/minikit';
import { Name, Identity, Badge } from '@coinbase/onchainkit/identity';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Snake from './components/snake';
import { useAccount } from 'wagmi';
import Check from './svg/Check';

const SCHEMA_UID =
  '0x7889a09fb295b0a0c63a3d7903c4f00f7896cca4fa64d2c1313f8547390b7d39';

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const { address } = useAccount();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          type="button"
          onClick={handleAddFrame}
          className="cursor-pointer bg-transparent font-semibold text-sm"
        >
          + SAVE MINI-APP
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex animate-fade-out items-center space-x-1 font-semibold text-sm">
          <Check />
          <span>SAVED</span>
        </div>
      );
    }

    return null;
  }, [context, handleAddFrame, frameAdded]);

  return (
    <div className="snake-dark relative flex min-h-screen flex-col items-center bg-[#E5E5E5] font-sans text-black sm:min-h-[820px]">
      <div className="w-screen max-w-[520px]">
        <header className="mt-1 mr-2 flex justify-between">
          <div className="justify-start pl-1">
            {address ? (
              <Identity
                address={address}
                schemaId={SCHEMA_UID}
                className="!bg-inherit p-0 [&>div]:space-x-2"
              >
                <Name className="text-inherit">
                  <Badge
                    tooltip="High Scorer"
                    className="!bg-inherit high-score-badge"
                  />
                </Name>
              </Identity>
            ) : (
              <div className="pt-1 pl-2 font-semibold text-gray-500 text-sm">
                NOT CONNECTED
              </div>
            )}
          </div>
          <div className="justify-end pr-1">{saveFrameButton}</div>
        </header>

        <main className="font-serif">
          <Snake />
        </main>

        <footer className="absolute bottom-4 flex w-screen max-w-[520px] items-center justify-center">
          <button
            type="button"
            className="mt-4 ml-4 flex justify-start rounded-2xl border border-black px-2 py-1 font-semibold text-xs opacity-40"
            onClick={() => openUrl('https://base.org/builders/minikit')}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
      </div>
    </div>
  );
}
