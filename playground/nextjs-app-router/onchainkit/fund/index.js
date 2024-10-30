var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/fund/components/FundButton.tsx
import { useCallback } from "react";

// src/styles/theme.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
__name(cn, "cn");
var text = {
  body: "ock-font-family font-normal leading-normal",
  caption: "ock-font-family font-semibold text-xs leading-4",
  headline: "ock-font-family font-semibold leading-normal",
  label1: "ock-font-family font-semibold text-sm leading-5",
  label2: "ock-font-family text-sm leading-5",
  legal: "ock-font-family text-xs leading-4",
  title1: "ock-font-family font-semibold text-[1.75rem] leading-9",
  title3: "ock-font-family font-semibold text-xl leading-7"
};
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
var icon = {
  primary: "ock-icon-color-primary",
  foreground: "ock-icon-color-foreground",
  foregroundMuted: "ock-icon-color-foreground-muted",
  inverse: "ock-icon-color-inverse",
  error: "ock-icon-color-error",
  success: "ock-icon-color-success",
  warning: "ock-icon-color-warning"
};

// src/internal/svg/addSvg.tsx
var addSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-addSvg",
  role: "img",
  "aria-label": "ock-addSvg",
  width: "13",
  height: "12",
  viewBox: "0 0 13 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M7.125 0H5.875V5.37501L0.5 5.37501L0.5 6.62501H5.875V12H7.125V6.62501H12.5V5.37501H7.125V0Z",
  className: icon.inverse
}));

// src/internal/utils/openPopup.ts
function openPopup({ url, target, height, width }) {
  const left = Math.round((window.screen.width - width) / 2);
  const top = Math.round((window.screen.height - height) / 2);
  const windowFeatures = `width=${width},height=${height},resizable,scrollbars=yes,status=1,left=${left},top=${top}`;
  window.open(url, target, windowFeatures);
}
__name(openPopup, "openPopup");

// src/internal/hooks/usePreferredColorScheme.ts
import { useEffect, useState } from "react";
function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState("light");
  useEffect(() => {
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

// src/fund/hooks/useGetFundingUrl.ts
import { useMemo as useMemo3 } from "react";
import { useAccount as useAccount3 } from "wagmi";

// src/wallet/hooks/useIsWalletACoinbaseSmartWallet.ts
import { useAccount as useAccount2 } from "wagmi";

// src/internal/hooks/useCapabilitiesSafe.ts
import { useMemo as useMemo2 } from "react";
import { useAccount } from "wagmi";
import { useCapabilities } from "wagmi/experimental";
function useCapabilitiesSafe({ chainId }) {
  const { isConnected } = useAccount();
  const { data: capabilities, error } = useCapabilities({
    query: {
      enabled: isConnected
    }
  });
  return useMemo2(() => {
    if (error || !capabilities || !capabilities[chainId]) {
      return {};
    }
    return capabilities[chainId];
  }, [
    capabilities,
    chainId,
    error
  ]);
}
__name(useCapabilitiesSafe, "useCapabilitiesSafe");

// src/wallet/hooks/useIsWalletACoinbaseSmartWallet.ts
var COINBASE_WALLET_SDK_CONNECTOR_ID = "coinbaseWalletSDK";
function useIsWalletACoinbaseSmartWallet() {
  const { chain } = useOnchainKit();
  const { connector } = useAccount2();
  const walletCapabilities = useCapabilitiesSafe({
    chainId: chain.id
  });
  return connector?.id === COINBASE_WALLET_SDK_CONNECTOR_ID && walletCapabilities.atomicBatch?.supported === true;
}
__name(useIsWalletACoinbaseSmartWallet, "useIsWalletACoinbaseSmartWallet");

// src/version.ts
var version = "0.35.2";

// src/fund/utils/getCoinbaseSmartWalletFundUrl.ts
var COINBASE_SMART_WALLET_FUND_URL = "https://keys.coinbase.com/fund";
function getCoinbaseSmartWalletFundUrl() {
  const currentURL = window.location.href;
  const tabName = document.title;
  const fundUrl = `${COINBASE_SMART_WALLET_FUND_URL}?dappName=${encodeURIComponent(tabName)}&dappUrl=${encodeURIComponent(currentURL)}&version=${encodeURIComponent(version)}&source=onchainkit`;
  return fundUrl;
}
__name(getCoinbaseSmartWalletFundUrl, "getCoinbaseSmartWalletFundUrl");

// src/fund/constants.ts
var ONRAMP_BUY_URL = "https://pay.coinbase.com/buy";
var ONRAMP_POPUP_HEIGHT = 720;
var ONRAMP_POPUP_WIDTH = 460;

// src/fund/utils/getOnrampBuyUrl.ts
function getOnrampBuyUrl({ projectId, ...props }) {
  const url = new URL(ONRAMP_BUY_URL);
  if (projectId !== void 0) {
    url.searchParams.append("appId", projectId);
  }
  for (const key of Object.keys(props)) {
    const value = props[key];
    if (value !== void 0) {
      if ([
        "string",
        "number",
        "boolean"
      ].includes(typeof value)) {
        url.searchParams.append(key, value.toString());
      } else {
        url.searchParams.append(key, JSON.stringify(value));
      }
    }
  }
  url.searchParams.append("sdkVersion", `onchainkit@${version}`);
  url.searchParams.sort();
  return url.toString();
}
__name(getOnrampBuyUrl, "getOnrampBuyUrl");

// src/fund/hooks/useGetFundingUrl.ts
function useGetFundingUrl() {
  const { projectId, chain: defaultChain } = useOnchainKit();
  const { address, chain: accountChain } = useAccount3();
  const isCoinbaseSmartWallet = useIsWalletACoinbaseSmartWallet();
  const chain = accountChain || defaultChain;
  return useMemo3(() => {
    if (isCoinbaseSmartWallet) {
      return getCoinbaseSmartWalletFundUrl();
    }
    if (projectId === null || address === void 0) {
      return void 0;
    }
    return getOnrampBuyUrl({
      projectId,
      addresses: {
        [address]: [
          chain.name.toLowerCase()
        ]
      }
    });
  }, [
    isCoinbaseSmartWallet,
    projectId,
    address,
    chain
  ]);
}
__name(useGetFundingUrl, "useGetFundingUrl");

// src/internal/utils/getWindowDimensions.ts
var popupSizes = {
  sm: {
    width: "24.67vw",
    height: "30.83vw"
  },
  md: {
    width: "29vw",
    height: "36.25vw"
  },
  lg: {
    width: "35vw",
    height: "43.75vw"
  }
};
var getWindowDimensions = /* @__PURE__ */ __name((size) => {
  const { width, height } = popupSizes[size];
  const minWidth = 280;
  const minHeight = 350;
  const vwToPx = /* @__PURE__ */ __name((vw) => vw / 100 * window.innerWidth, "vwToPx");
  const widthPx = Math.max(minWidth, Math.round(vwToPx(Number.parseFloat(width))));
  const heightPx = Math.max(minHeight, Math.round(vwToPx(Number.parseFloat(height))));
  const maxWidth = Math.round(window.innerWidth * 0.9);
  const maxHeight = Math.round(window.innerHeight * 0.9);
  const adjustedWidthPx = Math.min(widthPx, maxWidth);
  const adjustedHeightPx = Math.min(heightPx, maxHeight);
  return {
    width: adjustedWidthPx,
    height: adjustedHeightPx
  };
}, "getWindowDimensions");

// src/fund/utils/getFundingPopupSize.ts
function getFundingPopupSize(size, fundingUrl) {
  if (fundingUrl?.includes(ONRAMP_BUY_URL)) {
    return {
      height: ONRAMP_POPUP_HEIGHT,
      width: ONRAMP_POPUP_WIDTH
    };
  }
  return getWindowDimensions(size);
}
__name(getFundingPopupSize, "getFundingPopupSize");

// src/fund/components/FundButton.tsx
function FundButton({ className, disabled = false, fundingUrl, hideIcon = false, hideText = false, openIn = "popup", popupSize = "md", rel, target, text: buttonText = "Fund" }) {
  const componentTheme = useTheme();
  const fundingUrlToRender = fundingUrl ?? useGetFundingUrl();
  const isDisabled = disabled || !fundingUrlToRender;
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (fundingUrlToRender) {
      const { height, width } = getFundingPopupSize(popupSize, fundingUrlToRender);
      openPopup({
        url: fundingUrlToRender,
        height,
        width,
        target
      });
    }
  }, [
    fundingUrlToRender,
    popupSize,
    target
  ]);
  const classNames = cn(componentTheme, pressable.primary, "px-4 py-3 inline-flex items-center justify-center space-x-2 disabled", isDisabled && pressable.disabled, text.headline, border.radius, color.inverse, className);
  const buttonContent = /* @__PURE__ */ React.createElement(React.Fragment, null, hideIcon || /* @__PURE__ */ React.createElement("span", {
    className: "flex h-6 items-center"
  }, addSvg), hideText || /* @__PURE__ */ React.createElement("span", null, buttonText));
  if (openIn === "tab") {
    return /* @__PURE__ */ React.createElement("a", {
      className: classNames,
      href: fundingUrlToRender,
      // If openIn is 'tab', default target to _blank so we don't accidentally navigate in the current tab
      target: target ?? "_blank",
      rel
    }, buttonContent);
  }
  return /* @__PURE__ */ React.createElement("button", {
    className: classNames,
    onClick: handleClick,
    type: "button",
    disabled: isDisabled
  }, buttonContent);
}
__name(FundButton, "FundButton");
export {
  FundButton,
  getCoinbaseSmartWalletFundUrl,
  getOnrampBuyUrl
};
//# sourceMappingURL=index.js.map