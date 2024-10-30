var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/styles/theme.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
__name(cn, "cn");
var pressable = {
  default: "cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)]",
  alternate: "cursor-pointer ock-bg-alternate active:bg-[var(--ock-bg-alternate-active)] hover:[var(--ock-bg-alternate-hover)]",
  inverse: "cursor-pointer ock-bg-inverse active:bg-[var(--ock-bg-inverse-active)] hover:bg-[var(--ock-bg-inverse-hover)]",
  primary: "cursor-pointer ock-bg-primary active:bg-[var(--ock-bg-primary-active)] hover:bg-[var(--ock-bg-primary-hover)]",
  secondary: "cursor-pointer ock-bg-secondary active:bg-[var(--ock-bg-secondary-active)] hover:bg-[var(--ock-bg-secondary-hover)]",
  coinbaseBranding: "cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]",
  shadow: "ock-shadow-default",
  disabled: "opacity-[0.38] pointer-events-none"
};
var background = {
  default: "ock-bg-default",
  alternate: "ock-bg-alternate",
  inverse: "ock-bg-inverse",
  primary: "ock-bg-primary",
  secondary: "ock-bg-secondary",
  error: "ock-bg-error",
  warning: "ock-bg-warning",
  success: "ock-bg-success",
  washed: "ock-bg-primary-washed",
  disabled: "ock-bg-primary-disabled",
  reverse: "ock-bg-default-reverse"
};
var color = {
  inverse: "ock-text-inverse",
  foreground: "ock-text-foreground",
  foregroundMuted: "ock-text-foreground-muted",
  error: "ock-text-error",
  primary: "ock-text-primary",
  success: "ock-text-success",
  warning: "ock-text-warning",
  disabled: "ock-text-disabled"
};
var border = {
  default: "ock-border-default",
  defaultActive: "ock-border-default-active",
  radius: "ock-border-radius",
  radiusInner: "ock-border-radius-inner"
};

// src/useIsMounted.ts
import { useEffect, useState } from "react";
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });
  return isMounted;
}
__name(useIsMounted, "useIsMounted");

// src/internal/hooks/usePreferredColorScheme.ts
import { useEffect as useEffect2, useState as useState2 } from "react";
function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState2("light");
  useEffect2(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(mediaQuery.matches ? "dark" : "light");
    function updateColorScheme(event) {
      setColorScheme(event.matches ? "dark" : "light");
    }
    __name(updateColorScheme, "updateColorScheme");
    mediaQuery.addEventListener("change", updateColorScheme);
    return () => mediaQuery.removeEventListener("change", updateColorScheme);
  }, []);
  return colorScheme;
}
__name(usePreferredColorScheme, "usePreferredColorScheme");

// src/useOnchainKit.tsx
import { useContext } from "react";

// src/OnchainKitProvider.tsx
import { createContext, useMemo } from "react";

// src/OnchainKitConfig.ts
import { baseSepolia } from "viem/chains";
var ONCHAIN_KIT_CONFIG = {
  address: null,
  apiKey: null,
  chain: baseSepolia,
  config: {
    appearance: {
      name: null,
      logo: null,
      mode: null,
      theme: null
    },
    paymaster: null
  },
  rpcUrl: null,
  schemaId: null,
  projectId: null
};

// src/OnchainKitProvider.tsx
var OnchainKitContext = /* @__PURE__ */ createContext(ONCHAIN_KIT_CONFIG);

// src/useOnchainKit.tsx
function useOnchainKit() {
  return useContext(OnchainKitContext);
}
__name(useOnchainKit, "useOnchainKit");

// src/useTheme.ts
function useTheme() {
  const preferredMode = usePreferredColorScheme();
  const { config: { appearance } = {} } = useOnchainKit();
  const { theme = "default", mode = "auto" } = appearance || {};
  if (theme === "cyberpunk" || theme === "base" || theme === "hacker") {
    return theme;
  }
  switch (mode) {
    case "auto":
      return `${theme}-${preferredMode}`;
    case "dark":
      return `${theme}-dark`;
    case "light":
      return `${theme}-light`;
    default:
      return `${theme}-${preferredMode}`;
  }
}
__name(useTheme, "useTheme");

// src/nft/types.ts
var LifecycleType = /* @__PURE__ */ function(LifecycleType2) {
  LifecycleType2["VIEW"] = "view";
  LifecycleType2["MINT"] = "mint";
  return LifecycleType2;
}({});

// src/nft/components/NFTLifecycleProvider.tsx
import { createContext as createContext2, useContext as useContext2, useEffect as useEffect3 } from "react";

// src/internal/hooks/useValue.ts
import { useMemo as useMemo2 } from "react";
function useValue(object) {
  return useMemo2(() => object, [
    object
  ]);
}
__name(useValue, "useValue");

// src/nft/hooks/useLifecycleStatus.ts
import { useCallback, useState as useState3 } from "react";
function useLifecycleStatus(initialState) {
  const [lifecycleStatus, setLifecycleStatus] = useState3(initialState);
  const updateLifecycleStatus = useCallback((newStatus) => {
    setLifecycleStatus((prevStatus) => {
      const persistedStatusData = prevStatus.statusName === "error" ? (({ error, code, message, ...statusData }) => statusData)(prevStatus.statusData) : prevStatus.statusData;
      return {
        statusName: newStatus.statusName,
        statusData: {
          ...persistedStatusData,
          ...newStatus.statusData
        }
      };
    });
  }, []);
  return [
    lifecycleStatus,
    updateLifecycleStatus
  ];
}
__name(useLifecycleStatus, "useLifecycleStatus");

// src/nft/components/NFTLifecycleProvider.tsx
var emptyContext = {};
var NFTLifecycleContext = /* @__PURE__ */ createContext2(emptyContext);
function NFTLifecycleProvider({ type, onStatus, onError, onSuccess, children }) {
  const [lifecycleStatus, updateLifecycleStatus] = useLifecycleStatus({
    statusName: "init",
    statusData: null
  });
  useEffect3(() => {
    if (lifecycleStatus.statusName === "error") {
      onError?.(lifecycleStatus.statusData);
    }
    if (lifecycleStatus.statusName === "success") {
      onSuccess?.(lifecycleStatus.statusData?.transactionReceipts?.[0]);
    }
    onStatus?.(lifecycleStatus);
  }, [
    onError,
    onStatus,
    onSuccess,
    lifecycleStatus,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName
  ]);
  const value = useValue({
    lifecycleStatus,
    type,
    updateLifecycleStatus
  });
  return /* @__PURE__ */ React.createElement(NFTLifecycleContext.Provider, {
    value
  }, children);
}
__name(NFTLifecycleProvider, "NFTLifecycleProvider");

// src/nft/components/NFTProvider.tsx
import { createContext as createContext3, useCallback as useCallback2, useContext as useContext3, useState as useState4 } from "react";
var emptyContext2 = {};
var NFTContext = /* @__PURE__ */ createContext3(emptyContext2);
function NFTProvider({ children, contractAddress, tokenId, isSponsored, useNFTData, buildMintTransaction }) {
  const [quantity, setQuantity] = useState4(1);
  const nftData = useNFTData(contractAddress, tokenId);
  const handleSetQuantity = useCallback2((quantity2) => {
    setQuantity(Number.parseInt(quantity2, 10));
  }, []);
  const value = useValue({
    contractAddress,
    tokenId,
    isSponsored,
    quantity,
    setQuantity: handleSetQuantity,
    buildMintTransaction,
    ...nftData
  });
  return /* @__PURE__ */ React.createElement(NFTContext.Provider, {
    value
  }, children);
}
__name(NFTProvider, "NFTProvider");

// src/nft/components/NFTMintCard.tsx
function NFTMintCard({ children, className, contractAddress, tokenId, isSponsored, useNFTData, buildMintTransaction, onStatus, onError, onSuccess }) {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();
  if (!isMounted) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(NFTLifecycleProvider, {
    type: LifecycleType.MINT,
    onStatus,
    onError,
    onSuccess
  }, /* @__PURE__ */ React.createElement(NFTProvider, {
    contractAddress,
    tokenId,
    isSponsored,
    useNFTData,
    buildMintTransaction
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(componentTheme, color.foreground, background.default, border.defaultActive, border.radius, "flex w-full max-w-[500px] flex-col border px-6 py-4", className),
    "data-testid": "ockNFTMintCard_Container"
  }, children)));
}
__name(NFTMintCard, "NFTMintCard");

// src/nft/components/NFTCard.tsx
import { useCallback as useCallback3 } from "react";
import { useAccount } from "wagmi";
function NFTCard({ children, className, contractAddress, tokenId, useNFTData, onStatus, onError, onSuccess }) {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();
  const { chain } = useAccount();
  const handleOnClick = useCallback3(() => {
    const network = chain?.name.toLowerCase() ?? "base";
    const openSeaUrl = `https://opensea.io/assets/${network}/${contractAddress}/${tokenId}`;
    window.open(openSeaUrl, "_blank", "noopener,noreferrer");
  }, [
    chain,
    contractAddress,
    tokenId
  ]);
  if (!isMounted) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(NFTLifecycleProvider, {
    type: LifecycleType.VIEW,
    onStatus,
    onError,
    onSuccess
  }, /* @__PURE__ */ React.createElement(NFTProvider, {
    contractAddress,
    tokenId,
    useNFTData
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: cn(componentTheme, color.foreground, pressable.default, border.radius, "flex w-full max-w-[500px] flex-col items-stretch border p-4 text-left", `hover:border-[${border.defaultActive}]`, className),
    "data-testid": "ockNFTCard_Container",
    onClick: handleOnClick
  }, children)));
}
__name(NFTCard, "NFTCard");
export {
  NFTCard,
  NFTMintCard
};
//# sourceMappingURL=index.js.map