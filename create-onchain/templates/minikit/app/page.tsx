'use client';

import { 
  useMiniKit, 
  useAddFrame,
  useOpenUrl, 
} from '@coinbase/onchainkit/minikit';
import {
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { useEffect, useMemo, useState } from 'react';
import Sammy from './components/Sammy';
import { useAccount } from 'wagmi';
import Check from './svg/Check';

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


  const handleAddFrame = async () => {
    const frameAdded = await addFrame();
    console.log('frameAdded', frameAdded);
    setFrameAdded(Boolean(frameAdded));
  }

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button 
          type="button" 
          onClick={handleAddFrame} 
          className="cursor-pointer bg-transparent ock-font-family font-semibold text-sm">
          + SAVE FRAME
        </button>
      )
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm ock-font-family font-semibold fade-out">
          <Check />
          <span>SAVED</span>
        </div>
      )
    }

    return null;
  }, [context, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#E5E5E5] text-black items-center">
      <div className="w-full max-w-[500px]">
        <header className="flex justify-between items-center">
          <button 
            type="button" 
            className="mt-4 ml-4 px-2 py-1 flex justify-start rounded-2xl ock-font-family font-semibold opacity-40 border border-black text-sm"
            onClick={() => openUrl('https://base.org/builders/minikit')}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
          <div className="pt-4 pr-4 flex justify-end">
            {saveFrameButton}
          </div>
        </header>

        <div className="mt-2 mx-[10px]">
          <Sammy />
        </div>

        <div className="absolute bottom-2 right-4 flex items-center ock-font-family">
          <div>Connected:</div>
          {address ? (
            <Identity address={address} className="!bg-inherit space-x-1 px-0 [&>div]:space-x-2">
              <Name />
            </Identity>
          ) : <div className="pl-1">NOT CONNECTED</div>}
        </div>
      </div>
    </div>
  );
}
