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
import { SendToken } from "./actions/SendToken";
import { SwapToken } from "./actions/SwapToken";
import styles from "./page.module.css";

export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div>
            <div className={styles.walletSection}>
              <Wallet className={styles.wallet}>
                <ConnectWallet>
                  <Name className={styles.walletName} />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className={styles.identity} hasCopyAddressOnClick>
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

        <main className={styles.main}>
          <div className={styles.content}>
            <h1 className={styles.title}>MiniKit Examples</h1>

            <p className={styles.description}>
              This mini app is meant to show how you can use the actions
              available in MiniKit.
            </p>

            <div className={styles.actionsList}>
              <IsInMiniApp />
              <UserInfo />
              <AddFrame />
              <ComposeCast />
              <ViewCast />
              <SendToken />
              <SwapToken />
              <CloseFrame />
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <Button
            variant="ghost"
            size="sm"
            className={styles.footerButton}
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
