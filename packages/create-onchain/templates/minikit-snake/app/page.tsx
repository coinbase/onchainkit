/**
 * Mini-App template
 *
 * You can use this as a starting point for building your mini-app
 * Start modifying this component to build your own Mini-App.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { Name, Identity, Badge, Avatar, Address, EthBalance } from "@coinbase/onchainkit/identity";
import { WalletDropdownDisconnect, WalletDropdown, ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import Snake, { SCHEMA_UID } from "./components/snake";
import Check from "./svg/Check";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

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
        <div className="flex items-center space-x-1 text-sm font-semibold animate-fade-out">
          <Check />
          <span>SAVED</span>
        </div>
      );
    }

    return null;
  }, [context, handleAddFrame, frameAdded]);

  return (
    <div className="flex flex-col min-h-screen sm:min-h-[820px] font-sans bg-[#E5E5E5] text-black items-center snake-dark relative">
      <div className="w-screen max-w-[520px]">
        <header className="mr-2 mt-1 flex justify-between h-6">
          <div className="justify-start pl-1">
            <Wallet className="z-10">
              <ConnectWallet
                className="ml-1 py-0 px-2 bg-gray-400 bg-opacity-20 h-6 text-black hover:bg-gray-400 hover:bg-opacity-40 active:bg-gray-400 active:bg-opacity-60"
                disconnectedLabel="LOGIN"
              >
                <Identity
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
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
          <div className="pr-1 justify-end">{saveFrameButton}</div>
        </header>

        <main className="font-serif">
          <Snake />
        </main>

        <footer className="absolute bottom-4 flex items-center w-screen max-w-[520px] justify-center">
          <button
            type="button"
            className="mt-4 ml-4 px-2 py-1 flex justify-start rounded-2xl font-semibold opacity-40 border border-black text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
      </div>
    </div>
  );
}
