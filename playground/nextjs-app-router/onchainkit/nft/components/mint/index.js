var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/identity/components/Address.tsx
import { useState } from "react";

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
var icon = {
  primary: "ock-icon-color-primary",
  foreground: "ock-icon-color-foreground",
  foregroundMuted: "ock-icon-color-foreground-muted",
  inverse: "ock-icon-color-inverse",
  error: "ock-icon-color-error",
  success: "ock-icon-color-success",
  warning: "ock-icon-color-warning"
};

// src/identity/utils/getSlicedAddress.ts
var getSlicedAddress = /* @__PURE__ */ __name((address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}, "getSlicedAddress");

// src/identity/components/IdentityProvider.tsx
import { createContext as createContext2, useContext as useContext2 } from "react";

// src/internal/hooks/useValue.ts
import { useMemo } from "react";
function useValue(object) {
  return useMemo(() => object, [
    object
  ]);
}
__name(useValue, "useValue");

// src/useOnchainKit.tsx
import { useContext } from "react";

// src/OnchainKitProvider.tsx
import { createContext, useMemo as useMemo2 } from "react";

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

// src/identity/components/IdentityProvider.tsx
var emptyContext = {};
var IdentityContext = /* @__PURE__ */ createContext2(emptyContext);
function useIdentityContext() {
  return useContext2(IdentityContext);
}
__name(useIdentityContext, "useIdentityContext");
function IdentityProvider(props) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = props.chain ?? contextChain;
  const value = useValue({
    address: props.address || "",
    chain: accountChain,
    schemaId: props.schemaId
  });
  return /* @__PURE__ */ React.createElement(IdentityContext.Provider, {
    value
  }, props.children);
}
__name(IdentityProvider, "IdentityProvider");

// src/identity/components/Address.tsx
function Address({ address = null, className, isSliced = true }) {
  const [copyText, setCopyText] = useState("Copy");
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error("Address: an Ethereum address must be provided to the Identity or Address component.");
    return null;
  }
  const accountAddress = address ?? contextAddress;
  const handleClick = /* @__PURE__ */ __name(() => {
    navigator.clipboard.writeText(accountAddress).then(() => {
      setCopyText("Copied");
      setTimeout(() => setCopyText("Copy"), 2e3);
    }).catch((err) => {
      console.error("Failed to copy address: ", err);
    });
  }, "handleClick");
  const handleKeyDown = /* @__PURE__ */ __name((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, "handleKeyDown");
  return /* @__PURE__ */ React.createElement("span", {
    "data-testid": "ockAddress",
    className: cn(color.foregroundMuted, text.label2, className, "group relative cursor-pointer"),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: "button"
  }, isSliced ? getSlicedAddress(accountAddress) : accountAddress, /* @__PURE__ */ React.createElement("span", {
    className: cn(pressable.alternate, text.legal, color.foreground, border.default, border.radius, "absolute top-full left-[0%] z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100")
  }, copyText));
}
__name(Address, "Address");

// src/identity/components/Avatar.tsx
import { Children, useMemo as useMemo3 } from "react";

// src/internal/svg/defaultAvatarSVG.tsx
var defaultAvatarSVG = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-defaultAvatarSVG",
  role: "img",
  "aria-label": "ock-defaultAvatarSVG",
  width: "100%",
  height: "100%",
  viewBox: "0 0 40 40",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40ZM25.6641 13.9974C25.6641 10.8692 23.1282 8.33333 20.0001 8.33333C16.8719 8.33333 14.336 10.8692 14.336 13.9974C14.336 17.1256 16.8719 19.6615 20.0001 19.6615C23.1282 19.6615 25.6641 17.1256 25.6641 13.9974ZM11.3453 23.362L9.53476 28.1875C12.2141 30.8475 15.9019 32.493 19.974 32.5H20.026C24.0981 32.493 27.7859 30.8475 30.4653 28.1874L28.6547 23.362C28.0052 21.625 26.3589 20.4771 24.5162 20.4318C24.4557 20.4771 22.462 21.9271 20 21.9271C17.538 21.9271 15.5443 20.4771 15.4839 20.4318C13.6412 20.462 11.9948 21.625 11.3453 23.362Z",
  className: icon.foreground
}));

// src/internal/svg/defaultLoadingSVG.tsx
var defaultLoadingSVG = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-defaultLoadingSVG",
  role: "img",
  "aria-label": "ock-defaultLoadingSVG",
  width: "100%",
  height: "100%",
  viewBox: "0 0 100 100",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "45",
  stroke: "#333",
  fill: "none",
  strokeWidth: "10",
  strokeLinecap: "round"
}, /* @__PURE__ */ React.createElement("animateTransform", {
  attributeName: "transform",
  type: "rotate",
  from: "0 50 50",
  to: "360 50 50",
  dur: "1s",
  repeatCount: "indefinite"
})));

// src/internal/utils/findComponent.ts
import { isValidElement } from "react";
function findComponent(component) {
  return (child) => {
    return isValidElement(child) && child.type === component;
  };
}
__name(findComponent, "findComponent");

// src/identity/hooks/useAvatar.ts
import { useQuery } from "@tanstack/react-query";
import { mainnet as mainnet3 } from "viem/chains";

// src/identity/utils/getAvatar.ts
import { mainnet as mainnet2 } from "viem/chains";
import { normalize } from "viem/ens";

// src/isBase.ts
import { base, baseSepolia as baseSepolia2 } from "viem/chains";
function isBase({ chainId, isMainnetOnly = false }) {
  if (isMainnetOnly && chainId === base.id) {
    return true;
  }
  if (!isMainnetOnly && (chainId === baseSepolia2.id || chainId === base.id)) {
    return true;
  }
  return false;
}
__name(isBase, "isBase");

// src/isEthereum.ts
import { mainnet, sepolia } from "viem/chains";
function isEthereum({ chainId, isMainnetOnly = false }) {
  if (isMainnetOnly && chainId === mainnet.id) {
    return true;
  }
  if (!isMainnetOnly && (chainId === sepolia.id || chainId === mainnet.id)) {
    return true;
  }
  return false;
}
__name(isEthereum, "isEthereum");

// src/network/getChainPublicClient.ts
import { http, createPublicClient } from "viem";
function getChainPublicClient(chain) {
  return createPublicClient({
    chain,
    transport: http()
  });
}
__name(getChainPublicClient, "getChainPublicClient");

// src/identity/constants.ts
import { base as base2, baseSepolia as baseSepolia3 } from "viem/chains";
var RESOLVER_ADDRESSES_BY_CHAIN_ID = {
  [baseSepolia3.id]: "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA",
  [base2.id]: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD"
};
var BASE_DEFAULT_PROFILE_PICTURES1 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72801)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2596.93 1721.27C2605.58 1648.75 2610.21 1574.9 2610.21 1500C2610.21 1425.1 2605.58 1351.4 2596.93 1278.73C2770.3 1177.28 2815.96 914.534 2631.1 772.941C2553.96 713.858 2472.05 660.593 2385.96 614.042C2339.26 528.102 2286.14 446.041 2227.06 368.904C2085.47 184.192 1822.72 229.699 1721.27 403.071C1648.75 394.417 1574.9 389.792 1500 389.792C1425.1 389.792 1351.4 394.417 1278.73 403.071C1177.28 229.699 914.534 184.043 772.941 368.904C713.858 446.041 660.593 527.953 614.042 614.042C528.102 660.742 446.041 713.858 368.904 772.941C184.192 914.534 229.699 1177.28 403.071 1278.73C394.417 1351.25 389.792 1425.1 389.792 1500C389.792 1574.9 394.417 1648.6 403.071 1721.27C229.699 1822.72 184.043 2085.47 368.904 2227.06C446.041 2286.14 527.953 2339.41 614.042 2385.96C660.742 2471.9 713.858 2553.96 772.941 2631.1C914.534 2815.81 1177.28 2770.3 1278.73 2596.93C1351.25 2605.58 1425.1 2610.21 1500 2610.21C1574.9 2610.21 1648.6 2605.58 1721.27 2596.93C1822.72 2770.3 2085.47 2815.96 2227.06 2631.1C2286.14 2553.96 2339.41 2472.05 2385.96 2385.96C2471.9 2339.26 2553.96 2286.14 2631.1 2227.06C2815.81 2085.47 2770.3 1822.72 2596.93 1721.27Z" fill="white"/><path d="M1391.06 1500C1391.06 1647.89 1358.4 1781.62 1305.74 1878.28C1253.03 1975.05 1180.69 2034 1101.53 2034C1022.36 2034 950.031 1975.05 897.314 1878.28C844.66 1781.62 812 1647.89 812 1500C812 1352.11 844.66 1218.38 897.314 1121.72C950.031 1024.95 1022.36 966 1101.53 966C1180.69 966 1253.03 1024.95 1305.74 1121.72C1358.4 1218.38 1391.06 1352.11 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1102.57" cy="1194.93" rx="126.414" ry="231.934" fill="white"/><path d="M2187.16 1500C2187.16 1647.89 2154.5 1781.62 2101.84 1878.28C2049.13 1975.05 1976.79 2034 1897.63 2034C1818.46 2034 1746.13 1975.05 1693.41 1878.28C1640.76 1781.62 1608.1 1647.89 1608.1 1500C1608.1 1352.11 1640.76 1218.38 1693.41 1121.72C1746.13 1024.95 1818.46 966 1897.63 966C1976.79 966 2049.13 1024.95 2101.84 1121.72C2154.5 1218.38 2187.16 1352.11 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1896.58" cy="1194.93" rx="126.414" ry="231.934" fill="white"/></g><defs><clipPath id="clip0_5569_72801"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES2 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72809)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2188.12 1131.95C2691.11 591.187 2356.8 256.94 1815.91 759.826C1767.57 804.826 1737.56 866.494 1733.32 932.403C1733.32 933.767 1733.17 934.979 1733.02 936.343C1722.56 1094.68 1853.35 1225.44 2011.72 1214.98C2013.08 1214.98 2014.29 1214.83 2015.66 1214.68C2081.58 1210.44 2143.26 1180.44 2188.27 1132.1L2188.12 1131.95Z" fill="white"/><path d="M759.879 1816.05C256.885 2356.81 591.204 2691.06 1132.08 2188.17C1180.43 2143.17 1210.44 2081.51 1214.68 2015.6C1214.68 2014.23 1214.83 2013.02 1214.98 2011.66C1225.44 1853.32 1094.65 1722.56 936.283 1733.02C934.919 1733.02 933.706 1733.17 932.342 1733.32C866.418 1737.56 804.738 1767.56 759.727 1815.9L759.879 1816.05Z" fill="white"/><path d="M1131.96 759.922C591.247 256.826 256.881 591.264 759.869 1132.09C804.865 1180.43 866.527 1210.44 932.431 1214.68C933.794 1214.68 935.006 1214.83 936.37 1214.98C1094.69 1225.44 1225.44 1094.66 1214.98 936.309C1214.98 934.946 1214.83 933.733 1214.68 932.369C1210.44 866.452 1180.44 804.777 1132.11 759.771L1131.96 759.922Z" fill="white"/><path d="M1816.05 2188.12C2356.81 2691.11 2691.06 2356.8 2188.17 1815.91C2143.17 1767.57 2081.51 1737.56 2015.6 1733.32C2014.23 1733.32 2013.02 1733.17 2011.66 1733.02C1853.32 1722.56 1722.56 1853.35 1733.02 2011.72C1733.02 2013.08 1733.17 2014.29 1733.32 2015.66C1737.56 2081.58 1767.56 2143.26 1815.9 2188.27L1816.05 2188.12Z" fill="white"/><path d="M1737.18 727.02C1710.36 -10.3398 1237.66 -10.3398 1210.84 727.02C1208.42 792.869 1230.84 857.658 1274.48 907.31C1275.39 908.37 1276.14 909.278 1277.05 910.338C1381.59 1029.62 1566.43 1029.62 1670.97 910.338C1671.88 909.278 1672.63 908.37 1673.54 907.31C1717.18 857.81 1739.45 793.02 1737.18 727.02Z" fill="white"/><path d="M727.02 1210.82C-10.3398 1237.64 -10.3398 1710.34 727.02 1737.16C792.869 1739.58 857.658 1717.16 907.31 1673.52C908.218 1672.62 909.278 1671.86 910.338 1670.95C1029.62 1566.41 1029.62 1381.57 910.338 1277.03C909.278 1276.12 908.37 1275.37 907.31 1274.46C857.81 1230.82 793.02 1208.55 727.02 1210.82Z" fill="white"/><path d="M2040.69 1274.48C2039.63 1275.39 2038.72 1276.14 2037.66 1277.05C1918.38 1381.59 1918.38 1566.43 2037.66 1670.97C2038.72 1671.88 2039.63 1672.63 2040.69 1673.54C2090.19 1717.18 2154.98 1739.45 2220.98 1737.18C2958.34 1710.36 2958.34 1237.66 2220.98 1210.84C2155.13 1208.42 2090.34 1230.84 2040.69 1274.48Z" fill="white"/><path d="M1210.82 2220.98C1237.64 2958.34 1710.34 2958.34 1737.16 2220.98C1739.58 2155.13 1717.16 2090.34 1673.52 2040.69C1672.62 2039.63 1671.86 2038.72 1670.95 2037.66C1566.41 1918.38 1381.57 1918.38 1277.03 2037.66C1276.12 2038.72 1275.37 2039.63 1274.46 2040.69C1230.82 2090.19 1208.55 2154.98 1210.82 2220.98Z" fill="white"/><circle cx="1474.5" cy="1474.5" r="886.5" fill="white"/><path d="M1391.06 1500C1391.06 1352.11 1358.4 1218.38 1305.74 1121.72C1253.03 1024.95 1180.69 966 1101.53 966C1022.36 966 950.031 1024.95 897.314 1121.72C844.66 1218.38 812 1352.11 812 1500C812 1647.89 844.66 1781.62 897.314 1878.28C950.031 1975.05 1022.36 2034 1101.53 2034C1180.69 2034 1253.03 1975.05 1305.74 1878.28C1358.4 1781.62 1391.06 1647.89 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 976.16 2037)" fill="white"/><path d="M2187.16 1500C2187.16 1352.11 2154.5 1218.38 2101.84 1121.72C2049.12 1024.95 1976.79 966 1897.63 966C1818.46 966 1746.13 1024.95 1693.41 1121.72C1640.76 1218.38 1608.1 1352.11 1608.1 1500C1608.1 1647.89 1640.76 1781.62 1693.41 1878.28C1746.13 1975.05 1818.46 2034 1897.63 2034C1976.79 2034 2049.12 1975.05 2101.84 1878.28C2154.5 1781.62 2187.16 1647.89 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 1770.17 2037)" fill="white"/></g><defs><clipPath id="clip0_5569_72809"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES3 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72826)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M587.596 2230.75C839.799 2148.27 1126.41 2048.74 1282.85 1934.35C1406.13 1849.79 1458.98 1757.13 1483.16 1651.34C1488.13 1629.73 1511.93 1629.73 1516.8 1651.34C1540.98 1757.01 1593.83 1849.67 1717.11 1934.35C1873.55 2048.74 2160.26 2148.28 2412.36 2230.75C2681.77 2308.44 2735.86 2334.34 2656.73 2207.31C2588.97 2088.63 2388.28 1817.51 2407.39 1489.82C2407.39 1489.21 2407.39 1488.59 2407.39 1487.86C2397.17 1162.25 2598.34 899.36 2662.18 786.079C2737.77 664.821 2675.65 693.54 2406.72 771.597C2154.43 854.195 1870.3 953.362 1715.2 1067.5C1593.25 1151.7 1540.79 1203.99 1516.8 1309.05C1511.83 1330.65 1488.03 1330.65 1483.16 1309.05C1459.17 1203.87 1406.71 1151.7 1284.76 1067.5C1129.66 953.362 845.533 854.195 593.234 771.597C324.307 693.54 262.284 664.821 337.782 786.079C401.621 899.36 602.791 1162.37 592.47 1488.1C592.47 1488.72 592.47 1489.33 592.47 1490.07C611.583 1817.76 410.891 2088.87 343.134 2207.55C264.004 2334.46 318.095 2308.68 587.5 2231L587.596 2230.75Z" fill="white"/><path d="M769.249 587.596C851.725 839.799 951.26 1126.41 1065.65 1282.85C1150.21 1406.13 1242.87 1458.98 1348.66 1483.16C1370.26 1488.13 1370.26 1511.93 1348.66 1516.8C1242.99 1540.98 1150.33 1593.83 1065.65 1717.11C951.26 1873.55 851.725 2160.26 769.249 2412.36C691.56 2681.77 665.664 2735.86 792.691 2656.73C911.372 2588.97 1182.49 2388.28 1510.18 2407.39C1510.79 2407.39 1511.41 2407.39 1512.14 2407.39C1837.75 2397.17 2100.64 2598.34 2213.92 2662.18C2335.18 2737.77 2306.46 2675.65 2228.4 2406.72C2145.8 2154.43 2046.64 1870.3 1932.5 1715.2C1848.3 1593.25 1796.01 1540.79 1690.95 1516.8C1669.35 1511.83 1669.35 1488.03 1690.95 1483.16C1796.13 1459.17 1848.3 1406.71 1932.5 1284.76C2046.64 1129.66 2145.8 845.533 2228.4 593.234C2306.46 324.307 2335.18 262.284 2213.92 337.782C2100.64 401.621 1837.63 602.791 1511.9 592.47C1511.28 592.47 1510.67 592.47 1509.93 592.47C1182.24 611.583 911.127 410.891 792.446 343.134C665.541 264.004 691.315 318.095 769.004 587.5L769.249 587.596Z" fill="white"/><path d="M1391.06 1500C1391.06 1352.11 1358.4 1218.38 1305.74 1121.72C1253.03 1024.95 1180.69 966 1101.53 966C1022.36 966 950.031 1024.95 897.314 1121.72C844.66 1218.38 812 1352.11 812 1500C812 1647.89 844.66 1781.62 897.314 1878.28C950.031 1975.05 1022.36 2034 1101.53 2034C1180.69 2034 1253.03 1975.05 1305.74 1878.28C1358.4 1781.62 1391.06 1647.89 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 976.159 2037)" fill="white"/><path d="M2187.16 1500C2187.16 1352.11 2154.5 1218.38 2101.84 1121.72C2049.12 1024.95 1976.79 966 1897.63 966C1818.46 966 1746.13 1024.95 1693.41 1121.72C1640.76 1218.38 1608.1 1352.11 1608.1 1500C1608.1 1647.89 1640.76 1781.62 1693.41 1878.28C1746.13 1975.05 1818.46 2034 1897.63 2034C1976.79 2034 2049.12 1975.05 2101.84 1878.28C2154.5 1781.62 2187.16 1647.89 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 1770.17 2037)" fill="white"/></g><defs><clipPath id="clip0_5569_72826"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES4 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72835)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2713.13 1500C2731.2 1680.92 2615.13 1818.15 2507.78 1924.42C2394.7 2032.13 2290.44 2108.88 2200.88 2200.61C2109.15 2290.16 2032.22 2394.61 1924.51 2507.68C1818.15 2615.04 1680.92 2731.11 1500 2713.13C1319.08 2731.2 1181.85 2615.13 1075.58 2507.78C967.866 2394.7 891.12 2290.44 799.389 2200.88C709.837 2109.15 605.39 2032.22 492.315 1924.51C384.962 1818.15 268.89 1680.92 286.873 1500C268.799 1319.08 384.871 1181.85 492.224 1075.58C605.299 967.866 709.564 891.12 799.116 799.389C890.848 709.837 967.775 605.39 1075.49 492.315C1181.85 384.871 1319.08 268.799 1500 286.873C1680.92 268.799 1818.15 384.871 1924.42 492.224C2032.13 605.299 2108.88 709.564 2200.61 799.116C2290.16 890.848 2394.61 967.775 2507.68 1075.49C2615.04 1181.85 2731.11 1319.08 2713.13 1500Z" fill="white"/><path d="M1391.06 1500C1391.06 1647.89 1358.4 1781.62 1305.74 1878.28C1253.03 1975.05 1180.69 2034 1101.53 2034C1022.36 2034 950.031 1975.05 897.314 1878.28C844.66 1781.62 812 1647.89 812 1500C812 1352.11 844.66 1218.38 897.314 1121.72C950.031 1024.95 1022.36 966 1101.53 966C1180.69 966 1253.03 1024.95 1305.74 1121.72C1358.4 1218.38 1391.06 1352.11 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1102.57" cy="1194.93" rx="126.414" ry="231.934" fill="white"/><path d="M2187.16 1500C2187.16 1647.89 2154.5 1781.62 2101.84 1878.28C2049.12 1975.05 1976.79 2034 1897.63 2034C1818.46 2034 1746.13 1975.05 1693.41 1878.28C1640.76 1781.62 1608.1 1647.89 1608.1 1500C1608.1 1352.11 1640.76 1218.38 1693.41 1121.72C1746.13 1024.95 1818.46 966 1897.63 966C1976.79 966 2049.12 1024.95 2101.84 1121.72C2154.5 1218.38 2187.16 1352.11 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1896.58" cy="1194.93" rx="126.414" ry="231.934" fill="white"/></g><defs><clipPath id="clip0_5569_72835"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES5 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72843)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2321.64 1500C3048.65 1727.51 2902.59 1900.1 2182.54 1787.44C2625.43 2169.27 2494.23 2265.93 1974.71 1974.53C2266.19 2493.97 2169.44 2625.34 1787.53 2182.54C1900.19 2902.68 1727.6 3048.65 1500 2321.64C1272.49 3048.65 1099.9 2902.59 1212.56 2182.54C830.733 2625.43 734.069 2494.23 1025.47 1974.71C506.03 2266.19 374.655 2169.44 817.464 1787.53C97.3173 1900.19 -48.6455 1727.6 678.356 1500C-48.6455 1272.49 97.4051 1099.9 817.464 1212.56C374.567 830.733 505.767 734.069 1025.29 1025.47C733.806 506.03 830.558 374.655 1212.47 817.464C1099.81 97.3173 1272.4 -48.6455 1500 678.356C1727.51 -48.6455 1900.1 97.4051 1787.44 817.464C2169.27 374.567 2265.93 505.767 1974.53 1025.29C2493.97 733.806 2625.34 830.558 2182.54 1212.47C2902.68 1099.81 3048.65 1272.4 2321.64 1500Z" fill="white"/><path d="M1402.29 1500.15C1402.29 1632.88 1372.98 1752.91 1325.73 1839.64C1278.42 1926.48 1213.56 1979.29 1142.65 1979.29C1071.73 1979.29 1006.87 1926.48 959.562 1839.64C912.315 1752.91 883 1632.88 883 1500.15C883 1367.41 912.315 1247.38 959.562 1160.65C1006.87 1073.81 1071.73 1021 1142.65 1021C1213.56 1021 1278.42 1073.81 1325.73 1160.65C1372.98 1247.38 1402.29 1367.41 1402.29 1500.15Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="998.466" cy="1500.14" rx="113.501" ry="208.242" fill="white"/><path d="M2117.07 1500.15C2117.07 1632.88 2087.76 1752.91 2040.51 1839.64C1993.2 1926.48 1928.34 1979.29 1857.42 1979.29C1786.51 1979.29 1721.65 1926.48 1674.34 1839.64C1627.09 1752.91 1597.78 1632.88 1597.78 1500.15C1597.78 1367.41 1627.09 1247.38 1674.34 1160.65C1721.65 1073.81 1786.51 1021 1857.42 1021C1928.34 1021 1993.2 1073.81 2040.51 1160.65C2087.76 1247.38 2117.07 1367.41 2117.07 1500.15Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1712.74" cy="1498.06" rx="113.501" ry="208.242" fill="white"/></g><defs><clipPath id="clip0_5569_72843"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES6 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72851)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2538.7 1207.34C2483.17 1184.33 2431.23 1159.94 2382.18 1133.9C2398.44 1080.86 2417.87 1026.85 2440.88 971.324C2548.89 711.06 2287.94 450.106 2027.68 558.125C1972.15 581.134 1918.14 600.699 1865.1 616.819C1839.06 567.907 1814.67 515.827 1791.66 460.302C1684.05 199.899 1314.94 199.899 1207.34 460.302C1184.33 515.827 1159.94 567.769 1133.9 616.819C1080.86 600.561 1026.85 581.134 971.324 558.125C711.06 450.106 450.106 711.06 558.125 971.324C581.134 1026.85 600.699 1080.86 616.819 1133.9C567.907 1159.94 515.827 1184.33 460.302 1207.34C199.899 1314.94 199.899 1684.05 460.302 1791.66C515.827 1814.67 567.769 1839.06 616.819 1865.1C600.561 1918.14 581.134 1972.15 558.125 2027.68C450.106 2287.94 711.06 2548.89 971.324 2440.88C1026.85 2417.87 1080.86 2398.3 1133.9 2382.18C1159.94 2431.09 1184.33 2483.17 1207.34 2538.7C1314.94 2799.1 1684.05 2799.1 1791.66 2538.7C1814.67 2483.17 1839.06 2431.23 1865.1 2382.18C1918.14 2398.44 1972.15 2417.87 2027.68 2440.88C2287.94 2548.89 2548.89 2287.94 2440.88 2027.68C2417.87 1972.15 2398.3 1918.14 2382.18 1865.1C2431.09 1839.06 2483.17 1814.67 2538.7 1791.66C2799.1 1684.05 2799.1 1314.94 2538.7 1207.34ZM1735.31 1727.87C1732.83 1730.35 1730.35 1732.83 1727.87 1735.31C1697.42 1766.58 1662.15 1790.01 1624.53 1806.13C1587.47 1820.46 1547.24 1828.17 1504.94 1827.62C1501.36 1827.62 1497.92 1827.62 1494.33 1827.62C1452.04 1828.17 1411.67 1820.32 1374.74 1806.13C1337.13 1790.01 1301.86 1766.58 1271.41 1735.31C1268.93 1732.83 1266.45 1730.35 1263.97 1727.87C1232.69 1697.42 1209.27 1662.15 1193.15 1624.53C1178.82 1587.61 1171.1 1547.24 1171.65 1504.94C1171.65 1501.36 1171.65 1497.92 1171.65 1494.33C1171.1 1452.04 1178.96 1411.67 1193.15 1374.74C1209.27 1337.13 1232.69 1301.86 1263.97 1271.41C1266.45 1268.93 1268.93 1266.45 1271.41 1263.97C1301.86 1232.69 1337.13 1209.27 1374.74 1193.15C1411.67 1178.82 1452.04 1171.1 1494.33 1171.65C1497.92 1171.65 1501.36 1171.65 1504.94 1171.65C1547.24 1171.1 1587.61 1178.96 1624.53 1193.15C1662.15 1209.27 1697.42 1232.69 1727.87 1263.97C1730.35 1266.45 1732.83 1268.93 1735.31 1271.41C1766.58 1301.86 1790.01 1337.13 1806.13 1374.74C1820.46 1411.8 1828.17 1452.04 1827.62 1494.33C1827.62 1497.92 1827.62 1501.36 1827.62 1504.94C1828.17 1547.24 1820.32 1587.61 1806.13 1624.53C1790.01 1662.15 1766.58 1697.42 1735.31 1727.87Z" fill="white"/><circle cx="1476" cy="1442" r="443" fill="white"/><path d="M1400.59 1202.5C1400.59 1334.79 1371.37 1454.31 1324.38 1540.58C1277.28 1627.04 1213.04 1679 1143.3 1679C1073.56 1679 1009.31 1627.04 962.215 1540.58C915.221 1454.31 886 1334.79 886 1202.5C886 1070.21 915.221 950.688 962.215 864.42C1009.31 777.961 1073.56 726 1143.3 726C1213.04 726 1277.28 777.961 1324.38 864.42C1371.37 950.688 1400.59 1070.21 1400.59 1202.5Z" fill="#155DFD" stroke="white" stroke-width="10"/><ellipse cx="1141.26" cy="931.03" rx="113.349" ry="207.963" fill="white"/><path d="M2114.41 1202.5C2114.41 1334.79 2085.19 1454.31 2038.19 1540.58C1991.1 1627.04 1926.85 1679 1857.11 1679C1787.37 1679 1723.13 1627.04 1676.03 1540.58C1629.04 1454.31 1599.82 1334.79 1599.82 1202.5C1599.82 1070.21 1629.04 950.688 1676.03 864.42C1723.13 777.961 1787.37 726 1857.11 726C1926.85 726 1991.1 777.961 2038.19 864.42C2085.19 950.688 2114.41 1070.21 2114.41 1202.5Z" fill="#155DFD" stroke="white" stroke-width="10"/><ellipse cx="1861.96" cy="928.963" rx="113.349" ry="207.963" fill="white"/></g><defs><clipPath id="clip0_5569_72851"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES7 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72860)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M1500.19 1499.87C1365.57 1351.79 1298.1 1205.48 1296.93 988.1C1296.16 779.052 1361.71 498.983 1502.29 274.909C1565.01 170.441 1645.1 119.866 1696.41 125.097C1750.22 129.37 1775.2 189.413 1785.5 284.511C1806.04 473.278 1775.29 803.798 1990.99 1009.07C2196.26 1224.77 2526.78 1194.09 2715.59 1214.68C2810.65 1224.78 2870.69 1249.84 2874.93 1303.61C2880.12 1354.96 2829.55 1435.05 2725.08 1497.77C2501.01 1638.35 2220.94 1703.91 2011.89 1703.13C1794.55 1702 1648.19 1634.49 1500.12 1499.87L1500.19 1499.87Z" fill="white"/><path d="M1499.98 1500.01C1634.61 1648.08 1702.07 1794.4 1703.24 2011.77C1704.02 2220.82 1638.47 2500.89 1497.89 2724.97C1435.16 2829.43 1355.07 2880.01 1303.77 2874.78C1249.96 2870.5 1224.97 2810.46 1214.68 2715.36C1194.13 2526.6 1224.89 2196.08 1009.18 1990.81C803.914 1775.1 473.394 1805.78 284.59 1785.2C189.528 1775.09 129.486 1750.03 125.249 1696.26C120.055 1644.91 170.63 1564.82 275.098 1502.1C499.172 1361.52 779.24 1295.97 988.289 1296.75C1205.63 1297.88 1351.98 1365.38 1500.06 1500.01L1499.98 1500.01Z" fill="white"/><path d="M1481.64 1518.29C1630.16 1383.18 1776.72 1315.24 1994.12 1313.37C2203.19 1311.92 2483.08 1376.57 2706.72 1516.45C2811 1578.84 2861.32 1658.78 2855.93 1710.11C2851.48 1763.93 2791.35 1789.12 2696.21 1799.72C2507.36 1820.87 2176.9 1791.18 1970.91 2007.57C1754.52 2213.55 1784.15 2544.01 1762.95 2732.9C1752.54 2828.01 1727.28 2888.14 1673.49 2892.55C1622.12 2897.91 1542.19 2847.58 1479.79 2743.31C1339.92 2519.66 1275.26 2239.77 1276.71 2030.7C1278.54 1813.33 1346.52 1666.75 1481.64 1518.22L1481.64 1518.29Z" fill="white"/><path d="M1481.81 1518.43C1333.29 1653.54 1186.74 1721.48 969.339 1723.34C760.267 1724.79 480.38 1660.13 256.734 1520.25C152.457 1457.85 102.133 1377.92 107.529 1326.59C111.975 1272.76 172.103 1247.58 267.243 1236.98C456.094 1215.83 786.549 1245.53 992.528 1029.15C1208.91 823.167 1179.28 492.713 1200.47 303.825C1210.92 208.685 1236.11 148.557 1289.93 144.111C1341.3 138.752 1421.23 189.076 1483.63 293.353C1623.51 516.999 1688.17 796.885 1686.72 1005.96C1684.9 1223.32 1616.92 1369.91 1481.81 1518.43Z" fill="white"/><path d="M1403.24 1500C1403.24 1630.77 1374.36 1749 1327.82 1834.44C1281.21 1919.99 1217.33 1972 1147.49 1972C1077.65 1972 1013.76 1919.99 967.153 1834.44C920.611 1749 891.731 1630.77 891.731 1500C891.731 1369.23 920.611 1251 967.153 1165.56C1013.76 1080.01 1077.65 1028 1147.49 1028C1217.33 1028 1281.21 1080.01 1327.82 1165.56C1374.36 1251 1403.24 1369.23 1403.24 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1148.41" cy="1230.16" rx="111.819" ry="205.156" fill="white"/><path d="M2107.42 1500C2107.42 1630.77 2078.55 1749 2032 1834.44C1985.4 1919.99 1921.51 1972 1851.67 1972C1781.83 1972 1717.94 1919.99 1671.34 1834.44C1624.79 1749 1595.92 1630.77 1595.92 1500C1595.92 1369.23 1624.79 1251 1671.34 1165.56C1717.94 1080.01 1781.83 1028 1851.67 1028C1921.51 1028 1985.4 1080.01 2032 1165.56C2078.55 1251 2107.42 1369.23 2107.42 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1850.75" cy="1230.16" rx="111.819" ry="205.156" fill="white"/></g><defs><clipPath id="clip0_5569_72860"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES = [
  BASE_DEFAULT_PROFILE_PICTURES1,
  BASE_DEFAULT_PROFILE_PICTURES2,
  BASE_DEFAULT_PROFILE_PICTURES3,
  BASE_DEFAULT_PROFILE_PICTURES4,
  BASE_DEFAULT_PROFILE_PICTURES5,
  BASE_DEFAULT_PROFILE_PICTURES6,
  BASE_DEFAULT_PROFILE_PICTURES7
];

// src/identity/utils/getBaseDefaultProfilePictureIndex.tsx
import { sha256 } from "viem";
var getBaseDefaultProfilePictureIndex = /* @__PURE__ */ __name((name, optionsLength) => {
  const nameAsUint8Array = Uint8Array.from(name.split("").map((letter) => letter.charCodeAt(0)));
  const hash = sha256(nameAsUint8Array);
  const hashValue = Number.parseInt(hash, 16);
  const remainder = hashValue % optionsLength;
  const index = remainder;
  return index;
}, "getBaseDefaultProfilePictureIndex");

// src/identity/utils/getBaseDefaultProfilePicture.tsx
var getBaseDefaultProfilePicture = /* @__PURE__ */ __name((username) => {
  const profilePictureIndex = getBaseDefaultProfilePictureIndex(username, BASE_DEFAULT_PROFILE_PICTURES.length);
  const selectedProfilePicture = BASE_DEFAULT_PROFILE_PICTURES[profilePictureIndex];
  const base64Svg = btoa(selectedProfilePicture);
  const dataUri = `data:image/svg+xml;base64,${base64Svg}`;
  return dataUri;
}, "getBaseDefaultProfilePicture");

// src/identity/utils/isBasename.tsx
var isBasename = /* @__PURE__ */ __name((username) => {
  if (username.endsWith(".base.eth")) {
    return true;
  }
  if (username.endsWith(".basetest.eth")) {
    return true;
  }
  return false;
}, "isBasename");

// src/identity/utils/getAvatar.ts
var getAvatar = /* @__PURE__ */ __name(async ({ ensName, chain = mainnet2 }) => {
  const chainIsBase = isBase({
    chainId: chain.id
  });
  const chainIsEthereum = isEthereum({
    chainId: chain.id
  });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  const usernameIsBasename = isBasename(ensName);
  if (!chainSupportsUniversalResolver) {
    return Promise.reject("ChainId not supported, avatar resolution is only supported on Ethereum and Base.");
  }
  let client = getChainPublicClient(chain);
  let baseEnsAvatar = null;
  if (chainIsBase) {
    try {
      baseEnsAvatar = await client.getEnsAvatar({
        name: normalize(ensName),
        universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id]
      });
      if (baseEnsAvatar) {
        return baseEnsAvatar;
      }
    } catch (_error) {
    }
  }
  client = getChainPublicClient(mainnet2);
  const mainnetEnsAvatar = await client.getEnsAvatar({
    name: normalize(ensName)
  });
  if (mainnetEnsAvatar) {
    return mainnetEnsAvatar;
  }
  if (usernameIsBasename) {
    return getBaseDefaultProfilePicture(ensName);
  }
  return null;
}, "getAvatar");

// src/identity/hooks/useAvatar.ts
var useAvatar = /* @__PURE__ */ __name(({ ensName, chain = mainnet3 }, queryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-avatar-${ensName}-${chain.id}`;
  return useQuery({
    queryKey: [
      "useAvatar",
      ensActionKey
    ],
    queryFn: /* @__PURE__ */ __name(async () => {
      return getAvatar({
        ensName,
        chain
      });
    }, "queryFn"),
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
}, "useAvatar");

// src/identity/hooks/useName.ts
import { useQuery as useQuery2 } from "@tanstack/react-query";
import { mainnet as mainnet6 } from "viem/chains";

// src/identity/utils/getName.ts
import { base as base3, mainnet as mainnet5 } from "viem/chains";

// src/identity/abis/L2ResolverAbi.ts
var L2ResolverAbi_default = [
  {
    inputs: [
      {
        internalType: "contract ENS",
        name: "ens_",
        type: "address"
      },
      {
        internalType: "address",
        name: "registrarController_",
        type: "address"
      },
      {
        internalType: "address",
        name: "reverseRegistrar_",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error"
  },
  {
    inputs: [],
    name: "CantSetSelfAsDelegate",
    type: "error"
  },
  {
    inputs: [],
    name: "CantSetSelfAsOperator",
    type: "error"
  },
  {
    inputs: [],
    name: "NewOwnerIsZeroAddress",
    type: "error"
  },
  {
    inputs: [],
    name: "NoHandoverRequest",
    type: "error"
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "contentType",
        type: "uint256"
      }
    ],
    name: "ABIChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "address",
        name: "a",
        type: "address"
      }
    ],
    name: "AddrChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "coinType",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "newAddress",
        type: "bytes"
      }
    ],
    name: "AddressChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "Approved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "hash",
        type: "bytes"
      }
    ],
    name: "ContenthashChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "resource",
        type: "uint16"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "record",
        type: "bytes"
      }
    ],
    name: "DNSRecordChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "resource",
        type: "uint16"
      }
    ],
    name: "DNSRecordDeleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "lastzonehash",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "zonehash",
        type: "bytes"
      }
    ],
    name: "DNSZonehashChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementer",
        type: "address"
      }
    ],
    name: "InterfaceChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string"
      }
    ],
    name: "NameChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "OwnershipHandoverCanceled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "OwnershipHandoverRequested",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "x",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "y",
        type: "bytes32"
      }
    ],
    name: "PubkeyChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRegistrarController",
        type: "address"
      }
    ],
    name: "RegistrarControllerUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newReverseRegistrar",
        type: "address"
      }
    ],
    name: "ReverseRegistrarUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "string",
        name: "indexedKey",
        type: "string"
      },
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string"
      },
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string"
      }
    ],
    name: "TextChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newVersion",
        type: "uint64"
      }
    ],
    name: "VersionChanged",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "contentTypes",
        type: "uint256"
      }
    ],
    name: "ABI",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "addr",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "coinType",
        type: "uint256"
      }
    ],
    name: "addr",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "delegate",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "cancelOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "clearRecords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "completeOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "contenthash",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32"
      },
      {
        internalType: "uint16",
        name: "resource",
        type: "uint16"
      }
    ],
    name: "dnsRecord",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "ens",
    outputs: [
      {
        internalType: "contract ENS",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32"
      }
    ],
    name: "hasDNSRecords",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      }
    ],
    name: "interfaceImplementer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "delegate",
        type: "address"
      }
    ],
    name: "isApprovedFor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "nodehash",
        type: "bytes32"
      },
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "multicallWithNodeCheck",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "result",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "ownershipHandoverExpiresAt",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "pubkey",
    outputs: [
      {
        internalType: "bytes32",
        name: "x",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "y",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "recordVersions",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "registrarController",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "requestOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "reverseRegistrar",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "contentType",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "setABI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "coinType",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "a",
        type: "bytes"
      }
    ],
    name: "setAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "a",
        type: "address"
      }
    ],
    name: "setAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "hash",
        type: "bytes"
      }
    ],
    name: "setContenthash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "setDNSRecords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      },
      {
        internalType: "address",
        name: "implementer",
        type: "address"
      }
    ],
    name: "setInterface",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "newName",
        type: "string"
      }
    ],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "x",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "y",
        type: "bytes32"
      }
    ],
    name: "setPubkey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "registrarController_",
        type: "address"
      }
    ],
    name: "setRegistrarController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "reverseRegistrar_",
        type: "address"
      }
    ],
    name: "setReverseRegistrar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "key",
        type: "string"
      },
      {
        internalType: "string",
        name: "value",
        type: "string"
      }
    ],
    name: "setText",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "hash",
        type: "bytes"
      }
    ],
    name: "setZonehash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "key",
        type: "string"
      }
    ],
    name: "text",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "zonehash",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// src/identity/utils/convertReverseNodeToBytes.ts
import { encodePacked, keccak256, namehash } from "viem";

// src/identity/utils/convertChainIdToCoinType.ts
import { mainnet as mainnet4 } from "viem/chains";
var convertChainIdToCoinType = /* @__PURE__ */ __name((chainId) => {
  if (chainId === mainnet4.id) {
    return "addr";
  }
  const cointype = (2147483648 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
}, "convertChainIdToCoinType");

// src/identity/utils/convertReverseNodeToBytes.ts
var convertReverseNodeToBytes = /* @__PURE__ */ __name((address, chainId) => {
  const addressFormatted = address.toLocaleLowerCase();
  const addressNode = keccak256(addressFormatted.substring(2));
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(`${chainCoinType.toLocaleUpperCase()}.reverse`);
  const addressReverseNode = keccak256(encodePacked([
    "bytes32",
    "bytes32"
  ], [
    baseReverseNode,
    addressNode
  ]));
  return addressReverseNode;
}, "convertReverseNodeToBytes");

// src/identity/utils/getName.ts
var getName = /* @__PURE__ */ __name(async ({ address, chain = mainnet5 }) => {
  const chainIsBase = isBase({
    chainId: chain.id
  });
  const chainIsEthereum = isEthereum({
    chainId: chain.id
  });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  if (!chainSupportsUniversalResolver) {
    return Promise.reject("ChainId not supported, name resolution is only supported on Ethereum and Base.");
  }
  let client = getChainPublicClient(chain);
  if (chainIsBase) {
    const addressReverseNode = convertReverseNodeToBytes(address, base3.id);
    try {
      const basename = await client.readContract({
        abi: L2ResolverAbi_default,
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        functionName: "name",
        args: [
          addressReverseNode
        ]
      });
      if (basename) {
        return basename;
      }
    } catch (_error) {
    }
  }
  client = getChainPublicClient(mainnet5);
  const ensName = await client.getEnsName({
    address
  });
  return ensName ?? null;
}, "getName");

// src/identity/hooks/useName.ts
var useName = /* @__PURE__ */ __name(({ address, chain = mainnet6 }, queryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-name-${address}-${chain.id}`;
  return useQuery2({
    queryKey: [
      "useName",
      ensActionKey
    ],
    queryFn: /* @__PURE__ */ __name(async () => {
      return await getName({
        address,
        chain
      });
    }, "queryFn"),
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
}, "useName");

// src/internal/svg/badgeSvg.tsx
var badgeSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-badgeSvg",
  width: "12",
  height: "12",
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M8.12957 3.73002L5.11957 6.74002L3.77957 5.40002C3.49957 5.12002 3.04957 5.12002 2.76957 5.40002C2.48957 5.68002 2.48957 6.13002 2.76957 6.41002L4.10957 7.75002L4.59957 8.24002C4.90957 8.55002 5.41957 8.55002 5.72957 8.24002L9.17957 4.79002C9.45957 4.51002 9.45957 4.06002 9.17957 3.78002L9.12957 3.73002C8.84957 3.45002 8.39957 3.45002 8.11957 3.73002H8.12957Z",
  "data-testid": "ock-badgeSvg",
  className: icon.foreground
}));

// src/identity/components/Badge.tsx
function Badge({ className }) {
  const badgeSize = "12px";
  return /* @__PURE__ */ React.createElement("span", {
    className: cn(background.primary, "rounded-full border border-transparent", className),
    "data-testid": "ockBadge",
    style: {
      height: badgeSize,
      width: badgeSize,
      maxHeight: badgeSize,
      maxWidth: badgeSize
    }
  }, badgeSvg);
}
__name(Badge, "Badge");

// src/identity/hooks/useAttestations.ts
import { useEffect, useState as useState2 } from "react";

// src/network/attestations.ts
import { gql } from "graphql-request";
import { getAddress } from "viem";

// src/network/createEasGraphQLClient.ts
import { GraphQLClient } from "graphql-request";

// src/network/definitions/base.ts
import { base as base4 } from "viem/chains";
var easChainBase = {
  id: base4.id,
  easGraphqlAPI: "https://base.easscan.org/graphql",
  schemaUids: [
    // VERIFIED_COUNTRY
    // https://base.easscan.org/schema/view/0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065
    "0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065",
    // VERIFIED_ACCOUNT
    // https://base.easscan.org/schema/view/0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9
    "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
  ]
};

// src/network/definitions/baseSepolia.ts
import { baseSepolia as baseSepolia4 } from "viem/chains";
var easChainBaseSepolia = {
  id: baseSepolia4.id,
  easGraphqlAPI: "https://base-sepolia.easscan.org/graphql",
  schemaUids: [
    // VERIFIED_COUNTRY
    // https://base-sepolia.easscan.org/schema/view/0xef54ae90f47a187acc050ce631c55584fd4273c0ca9456ab21750921c3a84028
    "0xef54ae90f47a187acc050ce631c55584fd4273c0ca9456ab21750921c3a84028",
    // VERIFIED_ACCOUNT
    // https://base-sepolia.easscan.org/schema/view/0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69
    "0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69"
  ]
};

// src/network/definitions/optimism.ts
import { optimism } from "viem/chains";
var easChainOptimism = {
  id: optimism.id,
  easGraphqlAPI: "https://optimism.easscan.org/graphql",
  schemaUids: [
    // N_A
    // https://optimism.easscan.org/schema/view/0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929
    "0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929",
    // GITCOIN_PASSPORT_SCORES_V1:
    // https://optimism.easscan.org/schema/view/0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89
    "0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89",
    // OPTIMISM_GOVERNANCE_SEASON_4_CO_GRANT_PARTICIPANT:
    // https://optimism.easscan.org/schema/view/0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf
    "0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf"
  ]
};

// src/identity/utils/easSupportedChains.ts
var easSupportedChains = {
  [easChainBase.id]: easChainBase,
  [easChainBaseSepolia.id]: easChainBaseSepolia,
  [easChainOptimism.id]: easChainOptimism
};
function isChainSupported(chain) {
  return chain.id in easSupportedChains;
}
__name(isChainSupported, "isChainSupported");
function getChainEASGraphQLAPI(chain) {
  return easSupportedChains[chain.id]?.easGraphqlAPI ?? "";
}
__name(getChainEASGraphQLAPI, "getChainEASGraphQLAPI");

// src/network/createEasGraphQLClient.ts
function createEasGraphQLClient(chain) {
  const endpoint = getChainEASGraphQLAPI(chain);
  return new GraphQLClient(endpoint);
}
__name(createEasGraphQLClient, "createEasGraphQLClient");

// src/network/attestations.ts
var attestationQuery = gql`
  query AttestationsForUsers(
    $where: AttestationWhereInput
    $distinct: [AttestationScalarFieldEnum!]
    $take: Int
  ) {
    attestations(where: $where, distinct: $distinct, take: $take) {
      id
      txid
      schemaId
      attester
      recipient
      revoked
      revocationTime
      expirationTime
      time
      timeCreated
      decodedDataJson
    }
  }
`;
function getAttestationQueryVariables(address, filters) {
  const checksummedAddress = getAddress(address);
  const conditions = {
    recipient: {
      equals: checksummedAddress
    },
    revoked: {
      equals: filters.revoked
    }
  };
  if (typeof filters.expirationTime === "number") {
    conditions.OR = [
      {
        expirationTime: {
          equals: 0
        }
      },
      {
        expirationTime: {
          gt: filters.expirationTime
        }
      }
    ];
  }
  if (filters?.schemas && filters.schemas.length > 0) {
    conditions.schemaId = {
      in: filters.schemas
    };
  }
  return {
    where: {
      AND: [
        conditions
      ]
    },
    distinct: [
      "schemaId"
    ],
    take: filters.limit
  };
}
__name(getAttestationQueryVariables, "getAttestationQueryVariables");
async function getAttestationsByFilter(address, chain, filters) {
  const easGraphqlClient = createEasGraphQLClient(chain);
  const attestationQueryVariables = getAttestationQueryVariables(address, filters);
  const { attestations } = await easGraphqlClient.request(attestationQuery, attestationQueryVariables);
  return attestations;
}
__name(getAttestationsByFilter, "getAttestationsByFilter");

// src/identity/utils/getAttestations.ts
async function getAttestations(address, chain, options) {
  if (!isChainSupported(chain)) {
    console.log("Error in getAttestation: Chain is not supported");
    return [];
  }
  try {
    const defaultQueryVariablesFilter = {
      revoked: false,
      expirationTime: Math.round(Date.now() / 1e3),
      limit: 10
    };
    const queryVariablesFilter = {
      ...defaultQueryVariablesFilter,
      ...options
    };
    return await getAttestationsByFilter(address, chain, queryVariablesFilter);
  } catch (error) {
    console.log(`Error in getAttestation: ${error.message}`);
    return [];
  }
}
__name(getAttestations, "getAttestations");

// src/identity/hooks/useAttestations.ts
function useAttestations({ address, chain, schemaId }) {
  if (!schemaId) {
    return [];
  }
  const [attestations, setAttestations] = useState2([]);
  useEffect(() => {
    const fetchData = /* @__PURE__ */ __name(async () => {
      const foundAttestations = await getAttestations(address, chain, {
        schemas: [
          schemaId
        ]
      });
      setAttestations(foundAttestations);
    }, "fetchData");
    fetchData();
  }, [
    address,
    chain,
    schemaId
  ]);
  return attestations;
}
__name(useAttestations, "useAttestations");

// src/identity/components/DisplayBadge.tsx
function DisplayBadge({ children, address }) {
  const { chain, schemaId } = useOnchainKit();
  const { schemaId: contextSchemaId, address: contextAddress } = useIdentityContext();
  if (!contextSchemaId && !schemaId) {
    throw new Error("Name: a SchemaId must be provided to the OnchainKitProvider or Identity component.");
  }
  const attestations = useAttestations({
    address: address ?? contextAddress,
    chain,
    schemaId: contextSchemaId ?? schemaId
  });
  if (attestations.length === 0) {
    return null;
  }
  return children;
}
__name(DisplayBadge, "DisplayBadge");

// src/identity/components/Avatar.tsx
function Avatar({ address = null, chain, className, defaultComponent, loadingComponent, children, ...props }) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  if (!accountAddress) {
    console.error("Avatar: an Ethereum address must be provided to the Identity or Avatar component.");
    return null;
  }
  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain
  });
  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar({
    ensName: name ?? "",
    chain: accountChain
  }, {
    enabled: !!name
  });
  const badge = useMemo3(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [
    children
  ]);
  const defaultAvatar = defaultComponent || defaultAvatarSVG;
  const loadingAvatar = loadingComponent || defaultLoadingSVG;
  if (isLoadingName || isLoadingAvatar) {
    return /* @__PURE__ */ React.createElement("div", {
      className: cn("h-8 w-8 overflow-hidden rounded-full", className)
    }, loadingAvatar);
  }
  const displayAvatarImg = name && avatar;
  return /* @__PURE__ */ React.createElement("div", {
    className: "relative"
  }, /* @__PURE__ */ React.createElement("div", {
    "data-testid": "ockAvatar_ImageContainer",
    className: cn("h-10 w-10 overflow-hidden rounded-full", className)
  }, displayAvatarImg ? /* @__PURE__ */ React.createElement("img", {
    className: "min-h-full min-w-full object-cover",
    "data-testid": "ockAvatar_Image",
    loading: "lazy",
    width: "100%",
    height: "100%",
    decoding: "async",
    src: avatar,
    alt: name,
    ...props
  }) : defaultAvatar), badge && /* @__PURE__ */ React.createElement(DisplayBadge, {
    address: accountAddress
  }, /* @__PURE__ */ React.createElement("div", {
    "data-testid": "ockAvatar_BadgeContainer",
    className: "-bottom-0.5 -right-0.5 absolute flex h-[15px] w-[15px] items-center justify-center rounded-full bg-transparent"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex h-3 w-3 items-center justify-center"
  }, badge))));
}
__name(Avatar, "Avatar");

// src/internal/utils/getRoundedAmount.ts
function getRoundedAmount(balance, fractionDigits) {
  if (balance === "0") {
    return balance;
  }
  const parsedBalance = Number.parseFloat(balance);
  const result = Number(parsedBalance)?.toFixed(fractionDigits).replace(/0+$/, "");
  if (parsedBalance > 0 && Number.parseFloat(result) === 0) {
    return "0";
  }
  return result;
}
__name(getRoundedAmount, "getRoundedAmount");

// src/wallet/hooks/useGetETHBalance.ts
import { useMemo as useMemo4 } from "react";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";

// src/swap/constants.ts
var GENERAL_SWAP_ERROR_CODE = "SWAP_ERROR";
var GENERAL_SWAP_QUOTE_ERROR_CODE = "SWAP_QUOTE_ERROR";
var GENERAL_SWAP_BALANCE_ERROR_CODE = "SWAP_BALANCE_ERROR";
var LOW_LIQUIDITY_ERROR_CODE = "SWAP_QUOTE_LOW_LIQUIDITY_ERROR";
var TOO_MANY_REQUESTS_ERROR_CODE = "TOO_MANY_REQUESTS_ERROR";
var UNCAUGHT_SWAP_QUOTE_ERROR_CODE = "UNCAUGHT_SWAP_QUOTE_ERROR";
var UNCAUGHT_SWAP_ERROR_CODE = "UNCAUGHT_SWAP_ERROR";

// src/swap/utils/getSwapErrorCode.ts
function getSwapErrorCode(context, errorCode) {
  if (errorCode === -32001) {
    return TOO_MANY_REQUESTS_ERROR_CODE;
  }
  if (errorCode === -32602) {
    return LOW_LIQUIDITY_ERROR_CODE;
  }
  if (context === "uncaught-swap") {
    return UNCAUGHT_SWAP_ERROR_CODE;
  }
  if (context === "uncaught-quote") {
    return UNCAUGHT_SWAP_QUOTE_ERROR_CODE;
  }
  if (context === "quote") {
    return GENERAL_SWAP_QUOTE_ERROR_CODE;
  }
  if (context === "balance") {
    return GENERAL_SWAP_BALANCE_ERROR_CODE;
  }
  return GENERAL_SWAP_ERROR_CODE;
}
__name(getSwapErrorCode, "getSwapErrorCode");

// src/wallet/hooks/useGetETHBalance.ts
var ETH_DECIMALS = 18;
function useGetETHBalance(address) {
  const ethBalanceResponse = useBalance({
    address
  });
  return useMemo4(() => {
    let error;
    if (ethBalanceResponse?.error) {
      error = {
        code: getSwapErrorCode("balance"),
        error: ethBalanceResponse?.error?.message,
        message: ""
      };
    }
    if (!ethBalanceResponse?.data?.value && ethBalanceResponse?.data?.value !== 0n) {
      return {
        convertedBalance: "",
        error,
        response: ethBalanceResponse,
        roundedBalance: ""
      };
    }
    const convertedBalance = formatUnits(ethBalanceResponse?.data?.value, ETH_DECIMALS);
    const roundedBalance = getRoundedAmount(convertedBalance, 8);
    return {
      convertedBalance,
      error,
      response: ethBalanceResponse,
      roundedBalance
    };
  }, [
    ethBalanceResponse
  ]);
}
__name(useGetETHBalance, "useGetETHBalance");

// src/identity/components/EthBalance.tsx
function EthBalance({ address, className }) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error("Address: an Ethereum address must be provided to the Identity or EthBalance component.");
    return null;
  }
  const { convertedBalance: balance, error } = useGetETHBalance(address ?? contextAddress);
  if (!balance || error) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("span", {
    "data-testid": "ockEthBalance",
    className: cn(text.label2, color.foregroundMuted, className)
  }, getRoundedAmount(balance, 4), " ETH");
}
__name(EthBalance, "EthBalance");

// src/identity/components/Identity.tsx
import { useCallback as useCallback2 } from "react";

// src/identity/components/IdentityLayout.tsx
import { Children as Children3, useMemo as useMemo6 } from "react";

// src/internal/hooks/usePreferredColorScheme.ts
import { useEffect as useEffect2, useState as useState3 } from "react";
function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState3("light");
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

// src/identity/hooks/usePopover.ts
import { useCallback, useEffect as useEffect3, useState as useState4 } from "react";
function usePopover(onClick) {
  const [popoverText, setPopoverText] = useState4("Copy");
  const [showPopover, setShowPopover] = useState4(false);
  const [isHovered, setIsHovered] = useState4(false);
  const handleMouseEnter = useCallback(() => {
    setPopoverText("Copy");
    setIsHovered(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowPopover(false);
  }, []);
  const handleClick = useCallback(async () => {
    if (onClick) {
      const result = await onClick();
      if (result) {
        setPopoverText("Copied");
        setTimeout(() => {
          setShowPopover(false);
        }, 1e3);
      }
    }
  }, [
    onClick
  ]);
  useEffect3(() => {
    let timer;
    if (isHovered) {
      timer = setTimeout(() => setShowPopover(true), 200);
    } else {
      setShowPopover(false);
    }
    return () => clearTimeout(timer);
  }, [
    isHovered
  ]);
  if (!onClick) {
    return {};
  }
  return {
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    showPopover,
    popoverText
  };
}
__name(usePopover, "usePopover");

// src/identity/components/Name.tsx
import { Children as Children2, useMemo as useMemo5 } from "react";
function Name({ address = null, className, children, chain, ...props }) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error("Name: an Ethereum address must be provided to the Identity or Name component.");
    return null;
  }
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  const { data: name, isLoading } = useName({
    address: accountAddress,
    chain: accountChain
  });
  const badge = useMemo5(() => {
    return Children2.toArray(children).find(findComponent(Badge));
  }, [
    children
  ]);
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("span", {
      className
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-1"
  }, /* @__PURE__ */ React.createElement("span", {
    "data-testid": "ockIdentity_Text",
    className: cn(text.headline, color.foreground, className),
    ...props
  }, name || getSlicedAddress(accountAddress)), badge && /* @__PURE__ */ React.createElement(DisplayBadge, {
    address: accountAddress
  }, badge));
}
__name(Name, "Name");

// src/identity/hooks/useSocials.tsx
import { useQuery as useQuery3 } from "@tanstack/react-query";
import { mainnet as mainnet8 } from "viem/chains";

// src/identity/utils/getSocials.ts
import { mainnet as mainnet7 } from "viem/chains";
import { normalize as normalize2 } from "viem/ens";
var getSocials = /* @__PURE__ */ __name(async ({ ensName, chain = mainnet7 }) => {
  const chainIsBase = isBase({
    chainId: chain.id
  });
  const chainIsEthereum = isEthereum({
    chainId: chain.id
  });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  if (!chainSupportsUniversalResolver) {
    return Promise.reject("ChainId not supported, socials resolution is only supported on Ethereum and Base.");
  }
  const client = getChainPublicClient(chain);
  const normalizedName = normalize2(ensName);
  const fetchTextRecord = /* @__PURE__ */ __name(async (key) => {
    try {
      const result = await client.getEnsText({
        name: normalizedName,
        key,
        universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id]
      });
      return result || null;
    } catch (error) {
      console.warn(`Failed to fetch ENS text record for ${key}:`, error);
      return null;
    }
  }, "fetchTextRecord");
  const [twitter, github, farcaster, website] = await Promise.all([
    fetchTextRecord("com.twitter"),
    fetchTextRecord("com.github"),
    fetchTextRecord("xyz.farcaster"),
    fetchTextRecord("url")
  ]);
  return {
    twitter,
    github,
    farcaster,
    website
  };
}, "getSocials");

// src/identity/hooks/useSocials.tsx
var useSocials = /* @__PURE__ */ __name(({ ensName, chain = mainnet8 }, queryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-socials-${ensName}-${chain.id}`;
  return useQuery3({
    queryKey: [
      "useSocials",
      ensActionKey
    ],
    queryFn: /* @__PURE__ */ __name(async () => {
      return getSocials({
        ensName,
        chain
      });
    }, "queryFn"),
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
}, "useSocials");

// src/internal/svg/githubSvg.tsx
var githubSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-githubSvg",
  role: "img",
  "aria-label": "ock-githubSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
  className: icon.foreground
}));

// src/internal/svg/twitterSvg.tsx
var twitterSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-twitterSvg",
  role: "img",
  "aria-label": "ock-twitterSvg",
  width: "100%",
  height: "100%",
  viewBox: "-1 -1 14 14",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("g", {
  clipPath: "url(#clip0_6998_47)"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M7.14163 5.07857L11.6089 0H10.5503L6.67137 4.40965L3.57328 0H0L4.68492 6.66817L0 11.9938H1.05866L5.15491 7.33709L8.42672 11.9938H12L7.14137 5.07857H7.14163ZM5.69165 6.72692L5.21697 6.06292L1.44011 0.779407H3.06615L6.11412 5.04337L6.5888 5.70737L10.5508 11.2499H8.92476L5.69165 6.72718V6.72692Z",
  className: icon.foreground
})), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
  id: "clip0_6998_47"
}, /* @__PURE__ */ React.createElement("rect", {
  width: "12",
  height: "12",
  fill: "white"
}))));

// src/internal/svg/warpcastSvg.tsx
var warpcastSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-warpcastSvg",
  role: "img",
  "aria-label": "ock-warpcastSvg",
  width: "100%",
  height: "100%",
  viewBox: "9 9 14 14",
  xmlns: "http://www.w3.org/2000/svg",
  className: `h-full w-full ${icon.foreground}`
}, /* @__PURE__ */ React.createElement("path", {
  d: "M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z",
  className: icon.inverse
}), /* @__PURE__ */ React.createElement("path", {
  d: "M11.7305 10H20.115V22H18.8843V16.5032H18.8722C18.7362 14.984 17.4676 13.7935 15.9227 13.7935C14.3779 13.7935 13.1093 14.984 12.9733 16.5032H12.9612V22H11.7305V10Z",
  className: icon.foreground
}), /* @__PURE__ */ React.createElement("path", {
  d: "M9.5 11.7031L10 13.4064H10.4231V20.2967C10.2106 20.2967 10.0385 20.47 10.0385 20.6838V21.1483H9.96154C9.74913 21.1483 9.57691 21.3216 9.57691 21.5354V21.9999H13.8846V21.5354C13.8846 21.3216 13.7124 21.1483 13.5 21.1483H13.4231V20.6838C13.4231 20.47 13.2508 20.2967 13.0384 20.2967H12.5769V11.7031H9.5Z",
  className: icon.foreground
}), /* @__PURE__ */ React.createElement("path", {
  d: "M18.9614 20.2967C18.749 20.2967 18.5768 20.47 18.5768 20.6838V21.1483H18.4998C18.2874 21.1483 18.1152 21.3216 18.1152 21.5354V21.9999H22.4229V21.5354C22.4229 21.3216 22.2507 21.1483 22.0383 21.1483H21.9614V20.6838C21.9614 20.47 21.7892 20.2967 21.5768 20.2967V13.4064H21.9998L22.4998 11.7031H19.4229V20.2967H18.9614Z",
  className: icon.foreground
}));

// src/internal/svg/websiteSvg.tsx
var websiteSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-websiteSvg",
  role: "img",
  "aria-label": "ock-websiteSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 12 12",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: `h-full w-full ${icon.foreground}`
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M6 0C9.31356 0 12 2.68644 12 6C12 9.31356 9.31356 12 6 12C2.69689 12 0.0245556 9.35356 0 6C0.0244789 2.64689 2.69689 0 6 0ZM9.34844 9.97867C9.15053 9.88544 8.9422 9.80002 8.72553 9.72346C8.56251 10.0854 8.36772 10.4313 8.13856 10.7412C8.57762 10.5427 8.98439 10.2854 9.34844 9.97867ZM7.95156 9.49742C7.46353 9.38284 6.9427 9.30992 6.4 9.28597V11.1381C7.04791 10.9365 7.58233 10.2766 7.95156 9.49742ZM5.6 9.28597C5.05729 9.30993 4.53646 9.38284 4.04844 9.49742C4.41771 10.2766 4.95209 10.936 5.6 11.1375V9.28597ZM3.27456 9.72347C3.05737 9.80003 2.84956 9.88544 2.65164 9.97868C3.01571 10.2854 3.42248 10.5427 3.86153 10.7412C3.63237 10.4313 3.43758 10.0854 3.27456 9.72347ZM2.05267 9.38492C2.34486 9.2318 2.65736 9.09534 2.98809 8.97763C2.73913 8.21044 2.58288 7.33386 2.54799 6.40008H0.815211C0.901669 7.53597 1.35323 8.5703 2.05277 9.38497L2.05267 9.38492ZM3.75156 8.74742C4.33229 8.60263 4.95367 8.512 5.6 8.48545V6.4H3.34844C3.3823 7.25677 3.52553 8.05522 3.75157 8.74733L3.75156 8.74742ZM6.4 8.48545C7.04636 8.51201 7.66767 8.60263 8.24844 8.74794C8.47449 8.05523 8.61771 7.25728 8.65157 6.40061L6.40001 6.40009L6.4 8.48545ZM9.012 8.97763C9.34273 9.09534 9.65576 9.2318 9.94742 9.38492C10.6469 8.56982 11.0984 7.53603 11.185 6.40003H9.4522C9.4173 7.33389 9.26106 8.21048 9.0121 8.97759L9.012 8.97763ZM9.94742 2.61508C9.65523 2.7682 9.34273 2.90466 9.012 3.02237C9.26096 3.78956 9.41721 4.66614 9.4521 5.59992H11.1849C11.0984 4.46403 10.6469 3.4297 9.94732 2.61503L9.94742 2.61508ZM8.24853 3.25258C7.6678 3.39737 7.04642 3.488 6.40009 3.51456V5.6H8.65164C8.61779 4.74323 8.47456 3.94478 8.24852 3.25267L8.24853 3.25258ZM5.60009 3.51456C4.95373 3.48799 4.33242 3.39737 3.75164 3.25206C3.5256 3.94477 3.38238 4.74328 3.34852 5.59994H5.60008L5.60009 3.51456ZM2.98809 3.02237C2.65736 2.90466 2.34433 2.7682 2.05267 2.61508C1.35319 3.43018 0.901667 4.46397 0.815111 5.59997H2.54789C2.58278 4.66611 2.73903 3.78952 2.98799 3.02241L2.98809 3.02237ZM2.65163 2.02132C2.84954 2.11455 3.05788 2.19997 3.27454 2.27653C3.43757 1.91456 3.63236 1.56872 3.86152 1.25882C3.42246 1.45726 3.01569 1.71456 2.65163 2.02132ZM4.04852 2.50257C4.53654 2.61714 5.05738 2.69007 5.60008 2.71402V0.861911C4.95217 1.06348 4.41774 1.72337 4.04852 2.50258V2.50257ZM6.40008 2.71402C6.94279 2.69006 7.46362 2.61715 7.95163 2.50257C7.58237 1.7234 7.04747 1.06346 6.40008 0.8619V2.71402ZM8.72552 2.27652C8.94271 2.19996 9.15052 2.11454 9.34843 2.02131C8.98437 1.71454 8.5776 1.45724 8.13855 1.25881C8.36771 1.56923 8.5625 1.91454 8.72552 2.27652Z"
}));

// src/identity/utils/getSocialPlatformDetails.tsx
var PLATFORM_CONFIG = {
  twitter: {
    href: /* @__PURE__ */ __name((value) => `https://x.com/${value}`, "href"),
    icon: twitterSvg
  },
  github: {
    href: /* @__PURE__ */ __name((value) => `https://github.com/${value}`, "href"),
    icon: githubSvg
  },
  farcaster: {
    href: /* @__PURE__ */ __name((value) => `https://warpcast.com/${value}`, "href"),
    icon: warpcastSvg
  },
  website: {
    href: /* @__PURE__ */ __name((value) => value, "href"),
    icon: websiteSvg
  }
};
function GetSocialPlatformDetails({ platform, value }) {
  const config = PLATFORM_CONFIG[platform];
  return /* @__PURE__ */ React.createElement("a", {
    href: config.href(value),
    target: "_blank",
    rel: "noopener noreferrer",
    className: cn(pressable.default, border.radius, border.default, "flex items-center justify-center p-2"),
    "data-testid": `ockSocials_${platform.charAt(0).toUpperCase() + platform.slice(1)}`
  }, /* @__PURE__ */ React.createElement("span", {
    className: "sr-only"
  }, platform), /* @__PURE__ */ React.createElement("div", {
    className: cn("flex h-4 w-4 items-center justify-center")
  }, config.icon));
}
__name(GetSocialPlatformDetails, "GetSocialPlatformDetails");

// src/identity/components/Socials.tsx
function Socials({ address, chain, className }) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  if (!accountAddress) {
    console.error("Socials: an Ethereum address must be provided to the Socials component.");
    return null;
  }
  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain
  });
  const { data: socials, isLoading: isLoadingSocials } = useSocials({
    ensName: name ?? "",
    chain: accountChain
  }, {
    enabled: !!name
  });
  if (isLoadingName || isLoadingSocials) {
    return /* @__PURE__ */ React.createElement("span", {
      className
    });
  }
  if (!socials || Object.values(socials).every((value) => !value)) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(border.default, "mt-2 w-full pl-1", className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: "left-4 flex space-x-2"
  }, Object.entries(socials).map(([platform, value]) => value && /* @__PURE__ */ React.createElement(GetSocialPlatformDetails, {
    key: platform,
    platform,
    value
  }))));
}
__name(Socials, "Socials");

// src/identity/components/IdentityLayout.tsx
var noop = /* @__PURE__ */ __name(() => {
}, "noop");
function IdentityLayout({ children, className, onClick }) {
  const componentTheme = useTheme();
  const { avatar, name, address, ethBalance, socials } = useMemo6(() => {
    const childrenArray = Children3.toArray(children);
    return {
      avatar: childrenArray.find(findComponent(Avatar)),
      name: childrenArray.find(findComponent(Name)),
      address: childrenArray.find(findComponent(Address)),
      ethBalance: childrenArray.find(findComponent(EthBalance)),
      socials: childrenArray.find(findComponent(Socials))
    };
  }, [
    children
  ]);
  const { handleClick, handleMouseEnter, handleMouseLeave, showPopover, popoverText } = usePopover(onClick);
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(componentTheme, background.default, "flex flex-col px-4 py-1", onClick && `${pressable.default} relative`, className),
    "data-testid": "ockIdentityLayout_container",
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onKeyUp: noop,
    onKeyDown: noop
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-shrink-0"
  }, avatar), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, name, address && !ethBalance && address, !address && ethBalance && ethBalance, address && ethBalance && /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-1"
  }, address, /* @__PURE__ */ React.createElement("span", {
    className: color.foregroundMuted
  }, "\xB7"), ethBalance))), socials, showPopover && /* @__PURE__ */ React.createElement("div", {
    className: cn(background.inverse, color.foreground, "absolute top-[calc(100%_-_5px)] left-[46px] z-10 rounded px-2 py-1 shadow-[0px_4px_8px_rgba(0,0,0,0.1)]"),
    "data-testid": "ockIdentityLayout_copy"
  }, popoverText, /* @__PURE__ */ React.createElement("div", {
    className: cn("absolute top-[-5px] left-6 h-0 w-0", "border-x-[5px] border-x-transparent border-b-[5px] border-b-[color:var(--ock-bg-inverse)] border-solid"),
    "data-testid": "ockIdentityLayout_copyArrow"
  })));
}
__name(IdentityLayout, "IdentityLayout");

// src/identity/components/Identity.tsx
function Identity({ address, chain, children, className, hasCopyAddressOnClick = false, schemaId }) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = chain ?? contextChain;
  const handleCopy = useCallback2(async () => {
    if (!address) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(address);
      return true;
    } catch (e) {
      console.error("Failed to copy: ", e);
      return false;
    }
  }, [
    address
  ]);
  const onClick = hasCopyAddressOnClick ? handleCopy : void 0;
  return /* @__PURE__ */ React.createElement(IdentityProvider, {
    address,
    schemaId,
    chain: accountChain
  }, /* @__PURE__ */ React.createElement(IdentityLayout, {
    className,
    onClick
  }, children));
}
__name(Identity, "Identity");

// src/identity/utils/getAddress.ts
import { mainnet as mainnet9 } from "viem/chains";

// src/identity/hooks/useAddress.ts
import { useQuery as useQuery4 } from "@tanstack/react-query";
import { mainnet as mainnet10 } from "viem/chains";

// src/nft/components/NFTProvider.tsx
import { createContext as createContext3, useCallback as useCallback3, useContext as useContext3, useState as useState5 } from "react";
var emptyContext2 = {};
var NFTContext = /* @__PURE__ */ createContext3(emptyContext2);
function useNFTContext() {
  const context = useContext3(NFTContext);
  if (context === emptyContext2) {
    throw new Error("useNFTContext must be used within an NFTView or NFTMint component");
  }
  return context;
}
__name(useNFTContext, "useNFTContext");

// src/nft/components/mint/NFTCreator.tsx
function NFTCreator({ className }) {
  const { schemaId } = useOnchainKit();
  const { creatorAddress } = useNFTContext();
  if (!creatorAddress) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex justify-between pb-2", className)
  }, /* @__PURE__ */ React.createElement(Identity, {
    className: "space-x-2 px-0",
    address: creatorAddress,
    schemaId
  }, /* @__PURE__ */ React.createElement(Avatar, {
    className: "h-4 w-4"
  }), /* @__PURE__ */ React.createElement(Name, null, /* @__PURE__ */ React.createElement(Badge, null))));
}
__name(NFTCreator, "NFTCreator");

// src/nft/components/mint/NFTMintButton.tsx
import { useCallback as useCallback13, useEffect as useEffect10, useMemo as useMemo23, useState as useState11 } from "react";
import { useAccount as useAccount10, useChainId as useChainId4 } from "wagmi";

// src/internal/components/Spinner.tsx
function Spinner({ className }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full items-center justify-center",
    "data-testid": "ockSpinner"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn("animate-spin border-2 border-gray-200 border-t-3", "rounded-full border-t-gray-400 px-2.5 py-2.5", className)
  }));
}
__name(Spinner, "Spinner");

// src/useIsMounted.ts
import { useEffect as useEffect4, useState as useState6 } from "react";
function useIsMounted() {
  const [isMounted, setIsMounted] = useState6(false);
  useEffect4(() => {
    setIsMounted(true);
  });
  return isMounted;
}
__name(useIsMounted, "useIsMounted");

// src/transaction/components/TransactionProvider.tsx
import { createContext as createContext4, useCallback as useCallback5, useContext as useContext4, useEffect as useEffect5, useMemo as useMemo8, useState as useState7 } from "react";
import { useAccount as useAccount2, useConfig, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

// src/constants.ts
var Capabilities = /* @__PURE__ */ function(Capabilities2) {
  Capabilities2["AtomicBatch"] = "atomicBatch";
  Capabilities2["AuxiliaryFunds"] = "auxiliaryFunds";
  Capabilities2["PaymasterService"] = "paymasterService";
  return Capabilities2;
}({});

// src/internal/hooks/useCapabilitiesSafe.ts
import { useMemo as useMemo7 } from "react";
import { useAccount } from "wagmi";
import { useCapabilities } from "wagmi/experimental";
function useCapabilitiesSafe({ chainId }) {
  const { isConnected } = useAccount();
  const { data: capabilities, error } = useCapabilities({
    query: {
      enabled: isConnected
    }
  });
  return useMemo7(() => {
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

// src/transaction/constants.ts
var GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
var METHOD_NOT_SUPPORTED_ERROR_SUBSTRING = "this request method is not supported";
var TRANSACTION_TYPE_CALLS = "TRANSACTION_TYPE_CALLS";
var TRANSACTION_TYPE_CONTRACTS = "TRANSACTION_TYPE_CONTRACTS";

// src/transaction/hooks/useCallsStatus.ts
import { useCallsStatus as useCallsStatusWagmi } from "wagmi/experimental";
function useCallsStatus({ setLifecycleStatus, transactionId }) {
  try {
    const { data } = useCallsStatusWagmi({
      id: transactionId,
      query: {
        refetchInterval: /* @__PURE__ */ __name((query) => {
          return query.state.data?.status === "CONFIRMED" ? false : 1e3;
        }, "refetchInterval"),
        enabled: !!transactionId
      }
    });
    const transactionHash = data?.receipts?.[0]?.transactionHash;
    return {
      status: data?.status,
      transactionHash
    };
  } catch (err) {
    setLifecycleStatus({
      statusName: "error",
      statusData: {
        code: "TmUCSh01",
        error: JSON.stringify(err),
        message: ""
      }
    });
    return {
      status: "error",
      transactionHash: void 0
    };
  }
}
__name(useCallsStatus, "useCallsStatus");

// src/transaction/hooks/useSendCall.ts
import { useSendTransaction as useSendCallWagmi } from "wagmi";

// src/transaction/utils/isUserRejectedRequestError.ts
function isUserRejectedRequestError(err) {
  if (err?.cause?.name === "UserRejectedRequestError") {
    return true;
  }
  if (err?.shortMessage?.includes("User rejected the request.")) {
    return true;
  }
  return false;
}
__name(isUserRejectedRequestError, "isUserRejectedRequestError");

// src/transaction/hooks/useSendCall.ts
function useSendCall({ setLifecycleStatus, transactionHashList }) {
  const { status, sendTransactionAsync: sendCallAsync, data } = useSendCallWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUSCh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((hash) => {
        setLifecycleStatus({
          statusName: "transactionLegacyExecuted",
          statusData: {
            transactionHashList: [
              ...transactionHashList,
              hash
            ]
          }
        });
      }, "onSuccess")
    }
  });
  return {
    status,
    sendCallAsync,
    data
  };
}
__name(useSendCall, "useSendCall");

// src/transaction/hooks/useSendCalls.ts
import { useSendCalls as useSendCallsWagmi } from "wagmi/experimental";
function useSendCalls({ setLifecycleStatus, setTransactionId }) {
  const { status, sendCallsAsync, data } = useSendCallsWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUSCSh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((id) => {
        setTransactionId(id);
      }, "onSuccess")
    }
  });
  return {
    status,
    sendCallsAsync,
    data
  };
}
__name(useSendCalls, "useSendCalls");

// src/transaction/hooks/useSendWalletTransactions.tsx
import { useCallback as useCallback4 } from "react";

// src/transaction/utils/sendBatchedTransactions.ts
var sendBatchedTransactions = /* @__PURE__ */ __name(async ({ capabilities, sendCallsAsync, transactions, transactionType, writeContractsAsync }) => {
  if (!transactions) {
    return;
  }
  if (transactionType === TRANSACTION_TYPE_CONTRACTS) {
    await writeContractsAsync({
      contracts: transactions,
      capabilities
    });
  }
  if (transactionType === TRANSACTION_TYPE_CALLS) {
    await sendCallsAsync({
      calls: transactions,
      capabilities
    });
  }
}, "sendBatchedTransactions");

// src/transaction/utils/sendSingleTransactions.ts
var sendSingleTransactions = /* @__PURE__ */ __name(async ({ sendCallAsync, transactions, transactionType, writeContractAsync }) => {
  for (const transaction of transactions) {
    if (transactionType === TRANSACTION_TYPE_CALLS) {
      await sendCallAsync(transaction);
    } else {
      await writeContractAsync(transaction);
    }
  }
}, "sendSingleTransactions");

// src/transaction/hooks/useSendWalletTransactions.tsx
var useSendWalletTransactions = /* @__PURE__ */ __name(({ capabilities, sendCallAsync, sendCallsAsync, transactionType, walletCapabilities, writeContractAsync, writeContractsAsync }) => {
  return useCallback4(async (transactions) => {
    if (!transactions) {
      return;
    }
    const resolvedTransactions = await Promise.resolve(transactions);
    if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
      await sendBatchedTransactions({
        capabilities,
        sendCallsAsync,
        transactions: resolvedTransactions,
        transactionType,
        writeContractsAsync
      });
    } else {
      await sendSingleTransactions({
        sendCallAsync,
        transactions: resolvedTransactions,
        transactionType,
        writeContractAsync
      });
    }
  }, [
    writeContractsAsync,
    writeContractAsync,
    sendCallsAsync,
    sendCallAsync,
    capabilities,
    transactionType,
    walletCapabilities
  ]);
}, "useSendWalletTransactions");

// src/transaction/hooks/useWriteContract.ts
import { useWriteContract as useWriteContractWagmi } from "wagmi";
function useWriteContract({ setLifecycleStatus, transactionHashList }) {
  const { status, writeContractAsync, data } = useWriteContractWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUWCh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((hash) => {
        setLifecycleStatus({
          statusName: "transactionLegacyExecuted",
          statusData: {
            transactionHashList: [
              ...transactionHashList,
              hash
            ]
          }
        });
      }, "onSuccess")
    }
  });
  return {
    status,
    writeContractAsync,
    data
  };
}
__name(useWriteContract, "useWriteContract");

// src/transaction/hooks/useWriteContracts.ts
import { useWriteContracts as useWriteContractsWagmi } from "wagmi/experimental";
function useWriteContracts({ setLifecycleStatus, setTransactionId }) {
  const { status, writeContractsAsync } = useWriteContractsWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        if (e.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
          return;
        }
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUWCSh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((id) => {
        setTransactionId(id);
      }, "onSuccess")
    }
  });
  return {
    status,
    writeContractsAsync
  };
}
__name(useWriteContracts, "useWriteContracts");

// src/transaction/utils/getPaymasterUrl.ts
var getPaymasterUrl = /* @__PURE__ */ __name((capabilities) => {
  return capabilities?.paymasterService?.url || null;
}, "getPaymasterUrl");

// src/transaction/components/TransactionProvider.tsx
var emptyContext3 = {};
var TransactionContext = /* @__PURE__ */ createContext4(emptyContext3);
function useTransactionContext() {
  const context = useContext4(TransactionContext);
  if (context === emptyContext3) {
    throw new Error("useTransactionContext must be used within a Transaction component");
  }
  return context;
}
__name(useTransactionContext, "useTransactionContext");
function TransactionProvider({ calls, capabilities: transactionCapabilities, chainId, children, contracts, isSponsored, onError, onStatus, onSuccess }) {
  const account = useAccount2();
  const config = useConfig();
  const { config: { paymaster } = {
    paymaster: void 0
  } } = useOnchainKit();
  const [errorMessage, setErrorMessage] = useState7("");
  const [errorCode, setErrorCode] = useState7("");
  const [isToastVisible, setIsToastVisible] = useState7(false);
  const [lifecycleStatus, setLifecycleStatus] = useState7({
    statusName: "init",
    statusData: null
  });
  const [transactionId, setTransactionId] = useState7("");
  const [transactionCount, setTransactionCount] = useState7();
  const [transactionHashList, setTransactionHashList] = useState7([]);
  const transactions = calls || contracts;
  const transactionType = calls ? TRANSACTION_TYPE_CALLS : TRANSACTION_TYPE_CONTRACTS;
  const walletCapabilities = useCapabilitiesSafe({
    chainId
  });
  const { switchChainAsync } = useSwitchChain();
  if (!contracts && !calls) {
    throw new Error("Transaction: One of contracts or calls must be provided as a prop to the Transaction component.");
  }
  if (calls && contracts) {
    throw new Error("Transaction: Only one of contracts or calls can be provided as a prop to the Transaction component.");
  }
  const { status: statusWriteContracts, writeContractsAsync } = useWriteContracts({
    setLifecycleStatus,
    setTransactionId
  });
  const { status: statusWriteContract, writeContractAsync, data: writeContractTransactionHash } = useWriteContract({
    setLifecycleStatus,
    transactionHashList
  });
  const { status: statusSendCalls, sendCallsAsync } = useSendCalls({
    setLifecycleStatus,
    setTransactionId
  });
  const { status: statusSendCall, sendCallAsync, data: sendCallTransactionHash } = useSendCall({
    setLifecycleStatus,
    transactionHashList
  });
  const transactionStatus = useMemo8(() => {
    const transactionStatuses = walletCapabilities[Capabilities.AtomicBatch]?.supported ? {
      [TRANSACTION_TYPE_CALLS]: statusSendCalls,
      [TRANSACTION_TYPE_CONTRACTS]: statusWriteContracts
    } : {
      [TRANSACTION_TYPE_CALLS]: statusSendCall,
      [TRANSACTION_TYPE_CONTRACTS]: statusWriteContract
    };
    return transactionStatuses[transactionType];
  }, [
    statusSendCalls,
    statusWriteContracts,
    statusSendCall,
    statusWriteContract,
    transactionType,
    walletCapabilities[Capabilities.AtomicBatch]
  ]);
  const singleTransactionHash = writeContractTransactionHash || sendCallTransactionHash;
  const capabilities = useMemo8(() => {
    if (isSponsored && paymaster) {
      return {
        paymasterService: {
          url: paymaster
        },
        // this needs to be below so devs can override default paymaster
        // with their personal paymaster in production playgroundd
        ...transactionCapabilities
      };
    }
    return transactionCapabilities;
  }, [
    isSponsored,
    paymaster,
    transactionCapabilities
  ]);
  const sendWalletTransactions = useSendWalletTransactions({
    capabilities,
    sendCallAsync,
    sendCallsAsync,
    transactionType,
    walletCapabilities,
    writeContractAsync,
    writeContractsAsync
  });
  const { transactionHash: batchedTransactionHash, status: callStatus } = useCallsStatus({
    setLifecycleStatus,
    transactionId
  });
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: singleTransactionHash || batchedTransactionHash
  });
  useEffect5(() => {
    setErrorMessage("");
    if (lifecycleStatus.statusName === "error") {
      setErrorMessage(lifecycleStatus.statusData.message);
      setErrorCode(lifecycleStatus.statusData.code);
      onError?.(lifecycleStatus.statusData);
    }
    if (lifecycleStatus.statusName === "transactionLegacyExecuted") {
      setTransactionHashList(lifecycleStatus.statusData.transactionHashList);
    }
    if (lifecycleStatus.statusName === "success") {
      onSuccess?.({
        transactionReceipts: lifecycleStatus.statusData.transactionReceipts
      });
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
  useEffect5(() => {
    if (transactionStatus === "pending") {
      setLifecycleStatus({
        statusName: "transactionPending",
        statusData: null
      });
    }
  }, [
    transactionStatus
  ]);
  useEffect5(() => {
    if (!receipt) {
      return;
    }
    setLifecycleStatus({
      statusName: "success",
      statusData: {
        transactionReceipts: [
          receipt
        ]
      }
    });
  }, [
    receipt
  ]);
  useEffect5(() => {
    if (!transactions || transactionHashList.length !== transactionCount || transactionCount < 2) {
      return;
    }
    getTransactionLegacyReceipts();
  }, [
    transactions,
    transactionCount,
    transactionHashList
  ]);
  const getTransactionLegacyReceipts = useCallback5(async () => {
    const receipts = [];
    for (const hash of transactionHashList) {
      try {
        const txnReceipt = await waitForTransactionReceipt(config, {
          hash,
          chainId
        });
        receipts.push(txnReceipt);
      } catch (err) {
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmTPc01",
            error: JSON.stringify(err),
            message: GENERIC_ERROR_MESSAGE
          }
        });
      }
    }
    setLifecycleStatus({
      statusName: "success",
      statusData: {
        transactionReceipts: receipts
      }
    });
  }, [
    chainId,
    config,
    transactionHashList
  ]);
  const switchChain = useCallback5(async (targetChainId) => {
    if (targetChainId && account.chainId !== targetChainId) {
      await switchChainAsync({
        chainId: targetChainId
      });
    }
  }, [
    account.chainId,
    switchChainAsync
  ]);
  const buildTransaction = useCallback5(async () => {
    setLifecycleStatus({
      statusName: "buildingTransaction",
      statusData: null
    });
    try {
      const resolvedTransactions = await (typeof transactions === "function" ? transactions() : Promise.resolve(transactions));
      setTransactionCount(resolvedTransactions?.length);
      return resolvedTransactions;
    } catch (err) {
      setLifecycleStatus({
        statusName: "error",
        statusData: {
          code: "TmTPc04",
          error: JSON.stringify(err),
          message: "Error building transactions"
        }
      });
      return void 0;
    }
  }, [
    transactions
  ]);
  const handleSubmit = useCallback5(async () => {
    setErrorMessage("");
    setIsToastVisible(true);
    try {
      await switchChain(chainId);
      const resolvedTransactions = await buildTransaction();
      await sendWalletTransactions(resolvedTransactions);
    } catch (err) {
      const errorMessage2 = isUserRejectedRequestError(err) ? "Request denied." : GENERIC_ERROR_MESSAGE;
      setLifecycleStatus({
        statusName: "error",
        statusData: {
          code: "TmTPc03",
          error: JSON.stringify(err),
          message: errorMessage2
        }
      });
    }
  }, [
    buildTransaction,
    chainId,
    sendWalletTransactions,
    switchChain
  ]);
  const value = useValue({
    chainId,
    errorCode,
    errorMessage,
    isLoading: callStatus === "PENDING",
    isToastVisible,
    lifecycleStatus,
    onSubmit: handleSubmit,
    paymasterUrl: getPaymasterUrl(capabilities),
    receipt,
    setIsToastVisible,
    setLifecycleStatus,
    setTransactionId,
    transactions,
    transactionId,
    transactionHash: singleTransactionHash || batchedTransactionHash,
    transactionCount
  });
  return /* @__PURE__ */ React.createElement(TransactionContext.Provider, {
    value
  }, children);
}
__name(TransactionProvider, "TransactionProvider");

// src/transaction/components/Transaction.tsx
function Transaction({ calls, capabilities, chainId, className, children, contracts, isSponsored, onError, onStatus, onSuccess }) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  const { chain } = useOnchainKit();
  if (!isMounted) {
    return null;
  }
  const accountChainId = chainId ? chainId : chain.id;
  return /* @__PURE__ */ React.createElement(TransactionProvider, {
    calls,
    capabilities,
    chainId: accountChainId,
    contracts,
    isSponsored,
    onError,
    onStatus,
    onSuccess
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(componentTheme, "flex w-full flex-col gap-2", className)
  }, children));
}
__name(Transaction, "Transaction");

// src/transaction/components/TransactionButton.tsx
import { useCallback as useCallback6, useMemo as useMemo9 } from "react";
import { useAccount as useAccount3, useChainId } from "wagmi";
import { useShowCallsStatus } from "wagmi/experimental";

// src/network/getChainExplorer.ts
import { baseSepolia as baseSepolia5 } from "viem/chains";
function getChainExplorer(chainId) {
  if (chainId === baseSepolia5.id) {
    return "https://sepolia.basescan.org";
  }
  return "https://basescan.org";
}
__name(getChainExplorer, "getChainExplorer");

// src/transaction/utils/isSpinnerDisplayed.ts
function isSpinnerDisplayed({ errorMessage, hasReceipt, isInProgress, transactionHash, transactionId }) {
  const isWaitingForReceipt = transactionId || transactionHash;
  if (hasReceipt || errorMessage) {
    return false;
  }
  if (isInProgress || isWaitingForReceipt) {
    return true;
  }
  return false;
}
__name(isSpinnerDisplayed, "isSpinnerDisplayed");

// src/transaction/components/TransactionButton.tsx
function TransactionButton({ className, disabled = false, text: idleText = "Transact", errorOverride, successOverride, pendingOverride }) {
  const { chainId, errorMessage, isLoading, lifecycleStatus, onSubmit, receipt, transactions, transactionCount, transactionHash, transactionId } = useTransactionContext();
  const { address } = useAccount3();
  const accountChainId = chainId ?? useChainId();
  const { showCallsStatus } = useShowCallsStatus();
  const isLegacyTransactionInProgress = lifecycleStatus.statusName === "transactionLegacyExecuted" && transactionCount !== lifecycleStatus?.statusData?.transactionHashList?.length;
  const isInProgress = lifecycleStatus.statusName === "buildingTransaction" || lifecycleStatus.statusName === "transactionPending" || isLegacyTransactionInProgress || isLoading;
  const isMissingProps = !transactions || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;
  const isDisabled = !receipt && (isInProgress || isMissingProps || isWaitingForReceipt || disabled);
  const displayPendingState = isSpinnerDisplayed({
    errorMessage,
    hasReceipt: !!receipt,
    isInProgress,
    transactionHash,
    transactionId
  });
  const { errorText, successText, pendingContent } = useMemo9(() => {
    const successText2 = successOverride?.text ?? "View transaction";
    const errorText2 = errorOverride?.text ?? "Try again";
    const pendingContent2 = pendingOverride?.text ?? /* @__PURE__ */ React.createElement(Spinner, null);
    return {
      successText: successText2,
      errorText: errorText2,
      pendingContent: pendingContent2
    };
  }, [
    errorOverride,
    pendingOverride,
    successOverride
  ]);
  const successHandler = useCallback6(() => {
    if (successOverride?.onClick && receipt) {
      return successOverride?.onClick?.(receipt);
    }
    if (receipt && transactionId) {
      return showCallsStatus({
        id: transactionId
      });
    }
    const chainExplorer = getChainExplorer(accountChainId);
    return window.open(`${chainExplorer}/tx/${transactionHash}`, "_blank", "noopener,noreferrer");
  }, [
    accountChainId,
    successOverride,
    showCallsStatus,
    transactionId,
    transactionHash,
    receipt
  ]);
  const errorHandler = useCallback6(() => {
    if (errorOverride?.onClick) {
      return errorOverride?.onClick?.();
    }
    return onSubmit();
  }, [
    errorOverride,
    onSubmit
  ]);
  const buttonContent = useMemo9(() => {
    if (receipt) {
      return successText;
    }
    if (errorMessage) {
      return errorText;
    }
    if (displayPendingState) {
      return pendingContent;
    }
    return idleText;
  }, [
    displayPendingState,
    errorMessage,
    errorText,
    idleText,
    pendingContent,
    receipt,
    successText
  ]);
  const handleSubmit = useCallback6(() => {
    if (receipt) {
      successHandler();
    } else if (errorMessage) {
      errorHandler();
    } else {
      onSubmit();
    }
  }, [
    errorMessage,
    errorHandler,
    onSubmit,
    receipt,
    successHandler
  ]);
  return /* @__PURE__ */ React.createElement("button", {
    className: cn(pressable.primary, border.radius, "w-full rounded-xl", "px-4 py-3 font-medium text-base text-white leading-6", isDisabled && pressable.disabled, text.headline, className),
    onClick: handleSubmit,
    type: "button",
    disabled: isDisabled,
    "data-testid": "ockTransactionButton_Button"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(text.headline, color.inverse, "flex justify-center")
  }, buttonContent));
}
__name(TransactionButton, "TransactionButton");

// src/transaction/components/TransactionToast.tsx
import { useCallback as useCallback7, useEffect as useEffect6, useMemo as useMemo10 } from "react";

// src/internal/svg/closeSvg.tsx
var closeSvg = /* @__PURE__ */ React.createElement("svg", {
  "aria-label": "ock-closeSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("title", null, "Close SVG"), /* @__PURE__ */ React.createElement("path", {
  d: "M2.14921 1L1 2.1492L6.8508 8L1 13.8508L2.1492 15L8 9.1492L13.8508 15L15 13.8508L9.14921 8L15 2.1492L13.8508 1L8 6.8508L2.14921 1Z",
  className: icon.foreground
}));

// src/transaction/hooks/useGetTransactionToastAction.tsx
import { useMemo as useMemo11 } from "react";
import { useChainId as useChainId2 } from "wagmi";
import { useShowCallsStatus as useShowCallsStatus2 } from "wagmi/experimental";

// src/transaction/components/TransactionToastIcon.tsx
import { useMemo as useMemo12 } from "react";

// src/transaction/hooks/useGetTransactionToastLabel.tsx
import { useMemo as useMemo13 } from "react";

// src/transaction/components/TransactionSponsor.tsx
function TransactionSponsor({ className }) {
  const { errorMessage, lifecycleStatus, paymasterUrl, receipt, transactionHash, transactionId } = useTransactionContext();
  const transactionInProgress = transactionId || transactionHash;
  if (lifecycleStatus.statusName !== "init" || !paymasterUrl || errorMessage || transactionInProgress || receipt) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, "flex", className)
  }, /* @__PURE__ */ React.createElement("p", {
    className: color.foregroundMuted
  }, "Zero transaction fee"));
}
__name(TransactionSponsor, "TransactionSponsor");

// src/transaction/components/TransactionStatus.tsx
function TransactionStatus({ children, className }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex justify-between", className)
  }, children);
}
__name(TransactionStatus, "TransactionStatus");

// src/transaction/hooks/useGetTransactionStatusAction.tsx
import { useMemo as useMemo14 } from "react";
import { useChainId as useChainId3 } from "wagmi";
import { useShowCallsStatus as useShowCallsStatus3 } from "wagmi/experimental";
function useGetTransactionStatusAction() {
  const { chainId, receipt, transactionHash, transactionId } = useTransactionContext();
  const accountChainId = chainId ?? useChainId3();
  const { showCallsStatus } = useShowCallsStatus3();
  return useMemo14(() => {
    const chainExplorer = getChainExplorer(accountChainId);
    let actionElement = null;
    if (transactionHash) {
      actionElement = /* @__PURE__ */ React.createElement("a", {
        href: `${chainExplorer}/tx/${transactionHash}`,
        target: "_blank",
        rel: "noreferrer"
      }, /* @__PURE__ */ React.createElement("span", {
        className: cn(text.label1, color.primary)
      }, "View transaction"));
    }
    if (transactionId) {
      actionElement = /* @__PURE__ */ React.createElement("button", {
        onClick: /* @__PURE__ */ __name(() => showCallsStatus({
          id: transactionId
        }), "onClick"),
        type: "button"
      }, /* @__PURE__ */ React.createElement("span", {
        className: cn(text.label1, color.primary)
      }, "View transaction"));
    }
    if (receipt) {
      actionElement = null;
    }
    return {
      actionElement
    };
  }, [
    accountChainId,
    receipt,
    showCallsStatus,
    transactionHash,
    transactionId
  ]);
}
__name(useGetTransactionStatusAction, "useGetTransactionStatusAction");

// src/transaction/components/TransactionStatusAction.tsx
function TransactionStatusAction({ className }) {
  const { actionElement } = useGetTransactionStatusAction();
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, "min-w-[70px]", className)
  }, actionElement);
}
__name(TransactionStatusAction, "TransactionStatusAction");

// src/transaction/hooks/useGetTransactionStatusLabel.tsx
import { useMemo as useMemo15 } from "react";
function useGetTransactionStatusLabel() {
  const { errorMessage, isLoading, receipt, lifecycleStatus, transactionHash, transactionId } = useTransactionContext();
  const isInProgress = isLoading || !!transactionId || !!transactionHash;
  const isPending = lifecycleStatus.statusName === "transactionPending";
  const isBuildingTransaction = lifecycleStatus.statusName === "buildingTransaction";
  return useMemo15(() => {
    let label = "";
    let labelClassName = color.foregroundMuted;
    if (isBuildingTransaction) {
      label = "Building transaction...";
    }
    if (isPending) {
      label = "Confirm in wallet.";
    }
    if (isInProgress) {
      label = "Transaction in progress...";
    }
    if (receipt) {
      label = "Successful";
    }
    if (errorMessage) {
      label = errorMessage;
      labelClassName = color.error;
    }
    return {
      label,
      labelClassName
    };
  }, [
    errorMessage,
    isBuildingTransaction,
    isInProgress,
    isPending,
    receipt
  ]);
}
__name(useGetTransactionStatusLabel, "useGetTransactionStatusLabel");

// src/transaction/components/TransactionStatusLabel.tsx
function TransactionStatusLabel({ className }) {
  const { label, labelClassName } = useGetTransactionStatusLabel();
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, className)
  }, /* @__PURE__ */ React.createElement("p", {
    className: labelClassName
  }, label));
}
__name(TransactionStatusLabel, "TransactionStatusLabel");

// src/wallet/components/ConnectWallet.tsx
import { ConnectButton as ConnectButtonRainbowKit } from "@rainbow-me/rainbowkit";
import { Children as Children4, isValidElement as isValidElement2, useCallback as useCallback8, useMemo as useMemo16 } from "react";
import { useAccount as useAccount4, useConnect } from "wagmi";

// src/wallet/components/ConnectButton.tsx
function ConnectButton({
  className,
  connectWalletText,
  onClick,
  // Text will be deprecated in the future
  text: text2
}) {
  return /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockConnectButton",
    className: cn(pressable.primary, border.radius, text.headline, color.inverse, "inline-flex min-w-[153px] items-center justify-center px-4 py-3", className),
    onClick
  }, connectWalletText ? connectWalletText : /* @__PURE__ */ React.createElement("span", {
    className: cn(color.inverse)
  }, text2));
}
__name(ConnectButton, "ConnectButton");

// src/wallet/components/ConnectWalletText.tsx
function ConnectWalletText({ children, className }) {
  return /* @__PURE__ */ React.createElement("span", {
    className: cn(text.headline, color.inverse, className)
  }, children);
}
__name(ConnectWalletText, "ConnectWalletText");

// src/wallet/components/WalletProvider.tsx
import { createContext as createContext5, useContext as useContext5, useState as useState8 } from "react";
var emptyContext4 = {};
var WalletContext = /* @__PURE__ */ createContext5(emptyContext4);
function useWalletContext() {
  return useContext5(WalletContext);
}
__name(useWalletContext, "useWalletContext");

// src/wallet/components/ConnectWallet.tsx
function ConnectWallet({
  children,
  className,
  // In a few version we will officially deprecate this prop,
  // but for now we will keep it for backward compatibility.
  text: text2 = "Connect Wallet",
  withWalletAggregator = false
}) {
  const { isOpen, setIsOpen } = useWalletContext();
  const { address: accountAddress, status } = useAccount4();
  const { connectors, connect, status: connectStatus } = useConnect();
  const { connectWalletText } = useMemo16(() => {
    const childrenArray = Children4.toArray(children);
    return {
      connectWalletText: childrenArray.find(findComponent(ConnectWalletText))
    };
  }, [
    children
  ]);
  const childrenWithoutConnectWalletText = useMemo16(() => {
    return Children4.map(children, (child) => {
      if (/* @__PURE__ */ isValidElement2(child) && child.type === ConnectWalletText) {
        return null;
      }
      return child;
    });
  }, [
    children
  ]);
  const connector = connectors[0];
  const isLoading = connectStatus === "pending" || status === "connecting";
  const handleToggle = useCallback8(() => {
    setIsOpen(!isOpen);
  }, [
    isOpen,
    setIsOpen
  ]);
  console.log("demo Noegf");
  if (status === "disconnected") {
    if (withWalletAggregator) {
      return /* @__PURE__ */ React.createElement(ConnectButtonRainbowKit.Custom, null, ({ openConnectModal }) => /* @__PURE__ */ React.createElement("div", {
        className: "flex",
        "data-testid": "ockConnectWallet_Container"
      }, /* @__PURE__ */ React.createElement(ConnectButton, {
        className,
        connectWalletText,
        onClick: /* @__PURE__ */ __name(() => openConnectModal(), "onClick"),
        text: text2
      })));
    }
    return /* @__PURE__ */ React.createElement("div", {
      className: "flex",
      "data-testid": "ockConnectWallet_Container"
    }, /* @__PURE__ */ React.createElement(ConnectButton, {
      className,
      connectWalletText,
      onClick: /* @__PURE__ */ __name(() => connect({
        connector
      }), "onClick"),
      text: text2
    }));
  }
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "flex",
      "data-testid": "ockConnectWallet_Container"
    }, /* @__PURE__ */ React.createElement("button", {
      type: "button",
      "data-testid": "ockConnectAccountButtonInner",
      className: cn(pressable.primary, text.headline, color.inverse, "inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3", pressable.disabled, className),
      disabled: true
    }, /* @__PURE__ */ React.createElement(Spinner, null)));
  }
  return /* @__PURE__ */ React.createElement(IdentityProvider, {
    address: accountAddress
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex gap-4",
    "data-testid": "ockConnectWallet_Container"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockConnectWallet_Connected",
    className: cn(pressable.secondary, border.radius, color.foreground, "px-4 py-3", isOpen && "ock-bg-secondary-active hover:ock-bg-secondary-active", className),
    onClick: handleToggle
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex gap-2"
  }, childrenWithoutConnectWalletText))));
}
__name(ConnectWallet, "ConnectWallet");

// src/wallet/components/Wallet.tsx
import { Children as Children7, useEffect as useEffect8, useMemo as useMemo19, useRef } from "react";

// src/wallet/components/WalletDropdown.tsx
import { Children as Children6, cloneElement as cloneElement2, isValidElement as isValidElement4, useMemo as useMemo18 } from "react";
import { useAccount as useAccount6 } from "wagmi";

// src/useBreakpoints.ts
import { useEffect as useEffect7, useState as useState9 } from "react";

// src/wallet/components/WalletBottomSheet.tsx
import { Children as Children5, cloneElement, isValidElement as isValidElement3, useCallback as useCallback9, useMemo as useMemo17 } from "react";
import { useAccount as useAccount5 } from "wagmi";

// src/wallet/components/WalletDropdownDisconnect.tsx
import { useCallback as useCallback10 } from "react";
import { useDisconnect } from "wagmi";

// src/internal/svg/disconnectSvg.tsx
var disconnectSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-disconnect-svg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 16 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M11.0668 0.91803L11.0668 2.93852L2.02049 2.93852L2.02049 15.0615L11.0668 15.0615L11.0668 17.082L-7.06549e-07 17.082L0 0.918029L11.0668 0.91803Z",
  className: icon.foreground
}), /* @__PURE__ */ React.createElement("path", {
  d: "M12.3273 12.8963L16.0002 9.02606L12.346 4.95902L10.843 6.30941L12.3623 8.00032L5.53321 8.00032L5.53321 10.0208L12.2706 10.0208L10.8617 11.5054L12.3273 12.8963Z",
  className: icon.foreground
}));

// src/internal/hooks/useIcon.tsx
import { isValidElement as isValidElement5, useMemo as useMemo20 } from "react";

// src/internal/svg/fundWallet.tsx
var fundWalletSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-fundWalletSvg",
  width: "18",
  height: "18",
  viewBox: "0 0 18 18",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M13.5 4.5C13.5 6.15685 14.8431 7.5 16.5 7.5V10.5C14.8431 10.5 13.5 11.8431 13.5 13.5H4.5C4.5 11.8431 3.15685 10.5 1.5 10.5L1.5 13.5V7.5C3.15685 7.5 4.5 6.15685 4.5 4.5H13.5ZM0 3V15H18V3H0ZM11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25C10.2426 11.25 11.25 10.2426 11.25 9Z",
  fill: "#0A0B0D",
  className: icon.foreground
}));

// src/internal/svg/swapSettings.tsx
var swapSettingsSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-swapSettingsSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 19 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M8.92071 5.89742e-08C8.00371 5.89742e-08 7.22171 0.663 7.07071 1.567L6.89271 2.639C6.87271 2.759 6.77771 2.899 6.59571 2.987C6.25306 3.15171 5.92344 3.34226 5.60971 3.557C5.44371 3.672 5.27571 3.683 5.15971 3.64L4.14271 3.258C3.72695 3.10224 3.26941 3.09906 2.85152 3.24904C2.43364 3.39901 2.08254 3.69241 1.86071 4.077L0.938708 5.674C0.716797 6.05836 0.638423 6.50897 0.717525 6.94569C0.796628 7.3824 1.02808 7.7769 1.37071 8.059L2.21071 8.751C2.30571 8.829 2.38071 8.98 2.36471 9.181C2.33621 9.56013 2.33621 9.94087 2.36471 10.32C2.37971 10.52 2.30571 10.672 2.21171 10.75L1.37071 11.442C1.02808 11.7241 0.796628 12.1186 0.717525 12.5553C0.638423 12.992 0.716797 13.4426 0.938708 13.827L1.86071 15.424C2.08269 15.8084 2.43387 16.1016 2.85173 16.2514C3.2696 16.4012 3.72706 16.3978 4.14271 16.242L5.16171 15.86C5.27671 15.817 5.44471 15.829 5.61171 15.942C5.92371 16.156 6.25271 16.347 6.59671 16.512C6.77871 16.6 6.87371 16.74 6.89371 16.862L7.07171 17.933C7.22271 18.837 8.00471 19.5 8.92171 19.5H10.7657C11.6817 19.5 12.4647 18.837 12.6157 17.933L12.7937 16.861C12.8137 16.741 12.9077 16.601 13.0907 16.512C13.4347 16.347 13.7637 16.156 14.0757 15.942C14.2427 15.828 14.4107 15.817 14.5257 15.86L15.5457 16.242C15.9612 16.3972 16.4183 16.4001 16.8357 16.2502C17.2532 16.1002 17.6039 15.8071 17.8257 15.423L18.7487 13.826C18.9706 13.4416 19.049 12.991 18.9699 12.5543C18.8908 12.1176 18.6593 11.7231 18.3167 11.441L17.4767 10.749C17.3817 10.671 17.3067 10.52 17.3227 10.319C17.3511 9.93987 17.3511 9.55913 17.3227 9.18C17.3067 8.98 17.3817 8.828 17.4757 8.75L18.3157 8.058C19.0237 7.476 19.2067 6.468 18.7487 5.673L17.8267 4.076C17.6047 3.69159 17.2535 3.3984 16.8357 3.24861C16.4178 3.09883 15.9604 3.10215 15.5447 3.258L14.5247 3.64C14.4107 3.683 14.2427 3.671 14.0757 3.557C13.7623 3.3423 13.433 3.15175 13.0907 2.987C12.9077 2.9 12.8137 2.76 12.7937 2.639L12.6147 1.567C12.5418 1.12906 12.3158 0.731216 11.977 0.444267C11.6383 0.157318 11.2087 -0.00011124 10.7647 5.89742e-08H8.92171H8.92071ZM9.84271 13.5C10.8373 13.5 11.7911 13.1049 12.4944 12.4017C13.1976 11.6984 13.5927 10.7446 13.5927 9.75C13.5927 8.75544 13.1976 7.80161 12.4944 7.09835C11.7911 6.39509 10.8373 6 9.84271 6C8.84815 6 7.89432 6.39509 7.19106 7.09835C6.4878 7.80161 6.09271 8.75544 6.09271 9.75C6.09271 10.7446 6.4878 11.6984 7.19106 12.4017C7.89432 13.1049 8.84815 13.5 9.84271 13.5Z",
  fill: "#6B7280",
  className: icon.foreground
}));

// src/internal/svg/walletSvg.tsx
var walletSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-walletSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M0 10C0 15.5222 4.47778 20 10 20C15.5222 20 20 15.5222 20 10C20 4.47778 15.5222 0 10 0C4.47778 0 0 4.47778 0 10ZM7.44444 6.77778C7.075 6.77778 6.77778 7.075 6.77778 7.44444V12.5556C6.77778 12.925 7.075 13.2222 7.44444 13.2222H12.5556C12.925 13.2222 13.2222 12.925 13.2222 12.5556V7.44444C13.2222 7.075 12.925 6.77778 12.5556 6.77778H7.44444Z",
  className: icon.foreground
}));

// src/wallet/components/WalletDropdownBasename.tsx
import { base as base5 } from "viem/chains";
import { useAccount as useAccount7 } from "wagmi";

// src/internal/svg/basenameSvg.tsx
var basenameSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-basenameSvg",
  role: "img",
  "aria-label": "ock-basenameSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("g", {
  id: "Icons/User"
}, /* @__PURE__ */ React.createElement("path", {
  id: "Vector",
  d: "M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM12.832 6.9987C12.832 5.43461 11.5641 4.16666 10 4.16666C8.43594 4.16666 7.168 5.43461 7.168 6.9987C7.168 8.56279 8.43594 9.83073 10 9.83073C11.5641 9.83073 12.832 8.56279 12.832 6.9987ZM5.67266 11.6810L4.76738 14.0938C6.10704 15.4238 7.95093 16.2465 9.98699 16.2500L10.0130 16.2500C12.0491 16.2465 13.8930 15.4238 15.2326 14.0938L14.3273 11.6810C14.0026 10.8125 13.1794 10.2385 12.2581 10.2159C12.2279 10.2385 11.2310 10.9635 10.0000 10.9635C8.76903 10.9635 7.77215 10.2385 7.74194 10.2159C6.82059 10.2310 5.9974 10.8125 5.67266 11.6810Z",
  className: icon.foreground
})));

// src/wallet/components/WalletDropdownFundLink.tsx
import { useCallback as useCallback11, useMemo as useMemo22 } from "react";

// src/fund/hooks/useGetFundingUrl.ts
import { useMemo as useMemo21 } from "react";
import { useAccount as useAccount9 } from "wagmi";

// src/wallet/hooks/useIsWalletACoinbaseSmartWallet.ts
import { useAccount as useAccount8 } from "wagmi";

// src/wallet/utils/isValidAAEntrypoint.ts
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless";

// src/wallet/utils/isWalletACoinbaseSmartWallet.ts
import { checksumAddress, decodeAbiParameters } from "viem";

// src/nft/components/NFTLifecycleProvider.tsx
import { createContext as createContext6, useContext as useContext6, useEffect as useEffect9 } from "react";

// src/nft/hooks/useLifecycleStatus.ts
import { useCallback as useCallback12, useState as useState10 } from "react";

// src/nft/components/NFTLifecycleProvider.tsx
var emptyContext5 = {};
var NFTLifecycleContext = /* @__PURE__ */ createContext6(emptyContext5);
function useNFTLifecycleContext() {
  const context = useContext6(NFTLifecycleContext);
  if (context === emptyContext5) {
    throw new Error("useNFTLifecycleContext must be used within an NFTView or NFTMint component");
  }
  return context;
}
__name(useNFTLifecycleContext, "useNFTLifecycleContext");

// src/nft/components/mint/NFTMintButton.tsx
function NFTMintButton({ className, label = "Mint", disabled, pendingOverride, successOverride, errorOverride }) {
  const chainId = useChainId4();
  const { address } = useAccount10();
  const { contractAddress, tokenId, isEligibleToMint, buildMintTransaction, quantity, isSponsored } = useNFTContext();
  const { updateLifecycleStatus } = useNFTLifecycleContext();
  const [callData, setCallData] = useState11([]);
  const [mintError, setMintError] = useState11(null);
  const handleTransactionError = useCallback13((error) => {
    updateLifecycleStatus({
      statusName: "error",
      statusData: {
        error: "Error building mint transaction",
        code: "NmNBc01",
        message: error
      }
    });
    setMintError(error);
  }, [
    updateLifecycleStatus
  ]);
  const fetchTransactions = useCallback13(async () => {
    if (address && buildMintTransaction) {
      try {
        setCallData([]);
        setMintError(null);
        const mintTransaction = await buildMintTransaction({
          contractAddress,
          tokenId,
          takerAddress: address,
          quantity
        });
        setCallData(mintTransaction);
      } catch (error) {
        handleTransactionError(error);
      }
    } else {
      setCallData([]);
    }
  }, [
    address,
    contractAddress,
    tokenId,
    quantity,
    buildMintTransaction,
    handleTransactionError
  ]);
  useEffect10(() => {
    fetchTransactions();
  }, [
    fetchTransactions
  ]);
  const handleOnStatus = useCallback13((transactionStatus) => {
    if (transactionStatus.statusName === "transactionPending") {
      updateLifecycleStatus({
        statusName: "transactionPending"
      });
    }
    if (transactionStatus.statusName === "transactionLegacyExecuted" || transactionStatus.statusName === "success" || transactionStatus.statusName === "error") {
      updateLifecycleStatus(transactionStatus);
    }
  }, [
    updateLifecycleStatus
  ]);
  const transactionButtonLabel = useMemo23(() => {
    if (isEligibleToMint === false || mintError) {
      return "Minting not available";
    }
    if (callData.length === 0) {
      return /* @__PURE__ */ React.createElement(Spinner, null);
    }
    return label;
  }, [
    callData,
    isEligibleToMint,
    label,
    mintError
  ]);
  if (!buildMintTransaction) {
    return null;
  }
  if (!address) {
    return /* @__PURE__ */ React.createElement("div", {
      className: cn("pt-2", className)
    }, /* @__PURE__ */ React.createElement(ConnectWallet, {
      className: "w-full"
    }));
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("pt-2", className)
  }, /* @__PURE__ */ React.createElement(Transaction, {
    isSponsored,
    chainId,
    calls: callData,
    onStatus: handleOnStatus
  }, /* @__PURE__ */ React.createElement(TransactionButton, {
    text: transactionButtonLabel,
    pendingOverride,
    successOverride,
    errorOverride,
    disabled: disabled || transactionButtonLabel !== label
  }), !mintError && /* @__PURE__ */ React.createElement(TransactionSponsor, null), /* @__PURE__ */ React.createElement(TransactionStatus, null, /* @__PURE__ */ React.createElement(TransactionStatusLabel, null), /* @__PURE__ */ React.createElement(TransactionStatusAction, null))), mintError && /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, color.foregroundMuted, "pb-2")
  }, mintError));
}
__name(NFTMintButton, "NFTMintButton");

// src/nft/components/mint/NFTMinters.tsx
function NFTMinters({ className }) {
  const { schemaId } = useOnchainKit();
  const { totalOwners, recentOwners } = useNFTContext();
  if (!recentOwners || recentOwners.length === 0) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex py-0.5", text.body, color.foregroundMuted, className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex space-x-[-.4rem]"
  }, recentOwners.map((address) => /* @__PURE__ */ React.createElement(Identity, {
    key: address,
    className: "space-x-0 px-0 py-0",
    address,
    schemaId
  }, /* @__PURE__ */ React.createElement(Avatar, {
    className: "h-4 w-4"
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "flex px-2"
  }, /* @__PURE__ */ React.createElement("div", null, "Minted by"), /* @__PURE__ */ React.createElement(Identity, {
    className: "px-1 py-0",
    address: recentOwners[0],
    schemaId
  }, /* @__PURE__ */ React.createElement(Name, {
    className: "max-w-[180px] overflow-hidden text-ellipsis"
  })), totalOwners && /* @__PURE__ */ React.createElement("div", null, "and ", totalOwners, " others")));
}
__name(NFTMinters, "NFTMinters");

// src/internal/components/QuantitySelector.tsx
import { useCallback as useCallback15, useState as useState12 } from "react";

// src/internal/components/TextInput.tsx
import { useCallback as useCallback14 } from "react";

// src/internal/hooks/useDebounce.ts
import { useLayoutEffect, useMemo as useMemo24, useRef as useRef2 } from "react";
var useDebounce = /* @__PURE__ */ __name((callback, delay) => {
  const callbackRef = useRef2(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  let timer;
  const debounce = /* @__PURE__ */ __name((func, delayMs, ...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delayMs);
  }, "debounce");
  return useMemo24(() => {
    return (...args) => {
      return debounce(callbackRef.current, delay, ...args);
    };
  }, [
    delay
  ]);
}, "useDebounce");

// src/internal/components/TextInput.tsx
function TextInput({ "aria-label": ariaLabel, className, delayMs, disabled = false, onBlur, onChange, placeholder, setValue, value, inputValidator = /* @__PURE__ */ __name(() => true, "inputValidator") }) {
  const handleDebounce = useDebounce((value2) => {
    onChange(value2);
  }, delayMs);
  const handleChange = useCallback14((evt) => {
    const value2 = evt.target.value;
    if (inputValidator(value2)) {
      setValue(value2);
      if (delayMs > 0) {
        handleDebounce(value2);
      } else {
        onChange(value2);
      }
    }
  }, [
    onChange,
    handleDebounce,
    delayMs,
    setValue,
    inputValidator
  ]);
  return /* @__PURE__ */ React.createElement("input", {
    "aria-label": ariaLabel,
    "data-testid": "ockTextInput_Input",
    type: "text",
    className,
    placeholder,
    value,
    onBlur,
    onChange: handleChange,
    disabled
  });
}
__name(TextInput, "TextInput");

// src/internal/components/QuantitySelector.tsx
var DELAY_MS = 200;
function QuantitySelector({ className, disabled, minQuantity = 1, maxQuantity = Number.MAX_SAFE_INTEGER, onChange, placeholder }) {
  const [value, setValue] = useState12(`${minQuantity}`);
  const isValidQuantity = useCallback15((v) => {
    if (Number.parseInt(v, 10) < minQuantity) {
      return false;
    }
    if (Number.parseInt(v, 10) > maxQuantity) {
      return false;
    }
    const regex = /^[0-9]*$/;
    return regex.test(v);
  }, [
    maxQuantity,
    minQuantity
  ]);
  const handleIncrement = useCallback15(() => {
    const next = `${Math.min(maxQuantity, Number.parseInt(value, 10) + 1)}`;
    setValue(next);
    onChange(next);
  }, [
    onChange,
    maxQuantity,
    value
  ]);
  const handleDecrement = useCallback15(() => {
    const next = `${Math.max(minQuantity, Number.parseInt(value, 10) - 1)}`;
    setValue(next);
    onChange(next);
  }, [
    onChange,
    minQuantity,
    value
  ]);
  const handleOnChange = useCallback15((v) => {
    if (v === "") {
      return;
    }
    onChange(v);
  }, [
    onChange
  ]);
  const handleBlur = useCallback15(() => {
    if (value === "") {
      setValue(minQuantity.toString());
      onChange(minQuantity.toString());
    }
  }, [
    onChange,
    minQuantity,
    value
  ]);
  const classNames = cn("h-11 w-11 rounded-lg border", border.defaultActive, color.foreground, background.default, disabled && pressable.disabled);
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("relative flex items-center gap-1", className),
    "data-testid": "ockQuantitySelector"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    "aria-label": "decrement",
    className: cn(classNames, pressable.default),
    "data-testid": "ockQuantitySelector_decrement",
    disabled,
    onClick: handleDecrement,
    type: "button"
  }, "-")), /* @__PURE__ */ React.createElement(TextInput, {
    "aria-label": "quantity",
    className: cn(classNames, "w-full text-center hover:bg-[var(--ock-bg-default-hover)] focus:bg-transparent"),
    delayMs: DELAY_MS,
    disabled,
    inputValidator: isValidQuantity,
    onBlur: handleBlur,
    onChange: handleOnChange,
    placeholder,
    setValue,
    value
  }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    "aria-label": "increment",
    className: cn(classNames, pressable.default),
    "data-testid": "ockQuantitySelector_increment",
    disabled,
    onClick: handleIncrement,
    type: "button"
  }, "+")));
}
__name(QuantitySelector, "QuantitySelector");

// src/nft/components/mint/NFTQuantitySelector.tsx
function NFTQuantitySelector({ className }) {
  const { maxMintsPerWallet, setQuantity } = useNFTContext();
  if (maxMintsPerWallet === 1) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("py-3", className)
  }, /* @__PURE__ */ React.createElement(QuantitySelector, {
    className,
    onChange: setQuantity,
    minQuantity: 1,
    maxQuantity: maxMintsPerWallet,
    placeholder: ""
  }));
}
__name(NFTQuantitySelector, "NFTQuantitySelector");

// src/internal/utils/multiplyFloats.ts
function multiplyFloats(...numbers) {
  if (numbers.length === 1) {
    return numbers[0];
  }
  const { result, decimalPlaces } = numbers.reduce((acc, num) => {
    const str = num.toString();
    const currentDecimalPlaces = (str.split(".")[1] || "").length;
    const integer = Number(str.replace(".", ""));
    return {
      result: acc.result * integer,
      decimalPlaces: acc.decimalPlaces + currentDecimalPlaces
    };
  }, {
    result: 1,
    decimalPlaces: 0
  });
  return result / 10 ** decimalPlaces;
}
__name(multiplyFloats, "multiplyFloats");

// src/token/utils/formatAmount.ts
function formatAmount(amount, options = {}) {
  if (amount === void 0) {
    return "";
  }
  const { locale, minimumFractionDigits, maximumFractionDigits } = options;
  return Number(amount).toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  });
}
__name(formatAmount, "formatAmount");

// src/nft/components/mint/NFTAssetCost.tsx
function NFTAssetCost({ className }) {
  const { price, quantity } = useNFTContext();
  if (price?.amount === void 0 || !price.currency || price.amountUSD === void 0) {
    return null;
  }
  if (price?.amount === 0) {
    return /* @__PURE__ */ React.createElement("div", {
      className: cn("flex py-2", text.body, className)
    }, "Free");
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex py-2", text.body, className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: text.headline
  }, multiplyFloats(price.amount, quantity), " ", price.currency), /* @__PURE__ */ React.createElement("div", {
    className: "px-2"
  }, "~"), /* @__PURE__ */ React.createElement("div", null, "$", formatAmount(`${multiplyFloats(price.amountUSD, quantity)}`, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })));
}
__name(NFTAssetCost, "NFTAssetCost");

// src/nft/components/mint/NFTTotalCost.tsx
import { useCallback as useCallback16, useMemo as useMemo25, useState as useState13 } from "react";

// src/internal/svg/infoSvg.tsx
var infoSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-infoSvg",
  role: "img",
  "aria-label": "ock-infoSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 10 10",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M5 10C7.7625 10 10 7.7625 10 5C10 2.2375 7.7625 0 5 0C2.2375 0 0 2.2375 0 5C0 7.7625 2.2375 10 5 10ZM4.58333 2.08333H5.41667V2.91667H4.58333V2.08333ZM4.58333 3.75H5.41667V7.91667H4.58333V3.75Z",
  className: icon.foreground
}));

// src/nft/components/mint/NFTTotalCost.tsx
function NFTTotalCost({ className, label = "Total cost" }) {
  const [isOverlayVisible, setIsOverlayVisible] = useState13(false);
  const { price, mintFee, quantity } = useNFTContext();
  const toggleOverlay = useCallback16(() => {
    setIsOverlayVisible((prev) => !prev);
  }, []);
  const showOverlay = useCallback16(() => {
    setIsOverlayVisible(true);
  }, []);
  const hideOverlay = useCallback16(() => {
    setIsOverlayVisible(false);
  }, []);
  const overlay = useMemo25(() => {
    if (price?.amount === void 0 || price?.amountUSD === void 0 || mintFee?.amount === void 0 || mintFee.amountUSD === void 0) {
      return null;
    }
    return /* @__PURE__ */ React.createElement("div", {
      className: cn(background.default, border.radius, border.defaultActive, "absolute z-10 w-full border")
    }, /* @__PURE__ */ React.createElement("div", {
      className: cn("flex items-center justify-between px-4 py-2", text.label2)
    }, /* @__PURE__ */ React.createElement("div", null, "NFT cost"), /* @__PURE__ */ React.createElement("div", null, "$", formatAmount(`${multiplyFloats(price.amountUSD, quantity)}`, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }))), /* @__PURE__ */ React.createElement("div", {
      className: cn("flex items-center justify-between px-4 py-2", text.label2)
    }, /* @__PURE__ */ React.createElement("div", null, "Mint fee"), /* @__PURE__ */ React.createElement("div", null, "$", formatAmount(`${multiplyFloats(mintFee?.amountUSD, quantity)}`, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }))));
  }, [
    mintFee,
    price,
    quantity
  ]);
  if (!price?.amount || !price?.currency || !price?.amountUSD || !mintFee?.amount || !mintFee.amountUSD) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "relative"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn("flex items-center justify-between pt-2 pb-1", text.label2, className)
  }, /* @__PURE__ */ React.createElement("div", null, label), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-2"
  }, /* @__PURE__ */ React.createElement("div", null, "$", formatAmount(`${multiplyFloats(price.amountUSD, quantity)}`, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })), overlay && /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockNFTTotalCostInfo",
    className: "h-2.5 w-2.5 cursor-pointer object-cover",
    onClick: toggleOverlay,
    onMouseEnter: showOverlay,
    onMouseLeave: hideOverlay
  }, infoSvg))), isOverlayVisible && overlay);
}
__name(NFTTotalCost, "NFTTotalCost");

// src/nft/components/mint/NFTCollectionTitle.tsx
function NFTCollectionTitle({ className }) {
  const { name } = useNFTContext();
  if (!name) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("pt-4 pb-1", text.title1, className)
  }, name);
}
__name(NFTCollectionTitle, "NFTCollectionTitle");
export {
  NFTAssetCost,
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
  NFTMinters,
  NFTQuantitySelector,
  NFTTotalCost
};
//# sourceMappingURL=index.js.map