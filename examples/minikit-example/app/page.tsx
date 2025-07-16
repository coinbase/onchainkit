"use client";
import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect } from "react";
import { Button } from "./ui/Button";
import { IsInMiniApp } from "./actions/IsInMiniApp";
import { AddFrame } from "./actions/AddFrame";
import { ComposeCast } from "./actions/ComposeCast";
import { ViewCast } from "./actions/ViewCast";
import { CloseFrame } from "./actions/CloseFrame";
import { UserInfo } from "./components/UserInfo";

export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-4xl mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
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
          </div>
        </header>

        <main className="flex-1">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center text-[var(--app-foreground)]">
              MiniKit Examples
            </h1>

            <p className="text-center text-sm text-[var(--app-foreground-muted)]">
              This mini app is meant to show how you can use the actions
              available in MiniKit.
            </p>

            <div className="flex flex-col gap-3 justify-center items-stretch max-w-md mx-auto">
              <IsInMiniApp />
              <UserInfo />
              <AddFrame />
              <ComposeCast />
              <ViewCast />
              <CloseFrame />
            </div>
          </div>
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
