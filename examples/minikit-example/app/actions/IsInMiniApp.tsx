"use client";
import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";

export function IsInMiniApp() {
  const { isInMiniApp } = useIsInMiniApp();

  return (
    <p className="text-center text-sm text-[var(--app-foreground-muted)]">
      Are we in a mini app? {isInMiniApp ? "Yes! 🎉" : "No 😢"}
    </p>
  );
}
