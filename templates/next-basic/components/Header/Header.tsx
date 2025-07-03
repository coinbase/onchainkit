"use client";
import { Wallet } from "@coinbase/onchainkit/wallet";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.wrapper}>
      <Wallet />
    </header>
  );
}
