var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/isBase.ts
import { base, baseSepolia } from "viem/chains";
function isBase({ chainId, isMainnetOnly = false }) {
  if (isMainnetOnly && chainId === base.id) {
    return true;
  }
  if (!isMainnetOnly && (chainId === baseSepolia.id || chainId === base.id)) {
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

// src/OnchainKitConfig.ts
import { baseSepolia as baseSepolia2 } from "viem/chains";
var ONCHAIN_KIT_CONFIG = {
  address: null,
  apiKey: null,
  chain: baseSepolia2,
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
var getOnchainKitConfig = /* @__PURE__ */ __name((configName) => {
  return ONCHAIN_KIT_CONFIG[configName];
}, "getOnchainKitConfig");
var setOnchainKitConfig = /* @__PURE__ */ __name((properties) => {
  Object.assign(ONCHAIN_KIT_CONFIG, properties);
  return getOnchainKitConfig;
}, "setOnchainKitConfig");

// src/OnchainKitProvider.tsx
import { createContext, useMemo } from "react";

// src/internal/utils/checkHashLength.ts
function checkHashLength(hash, length) {
  return new RegExp(`^0x[a-fA-F0-9]{${length}}$`).test(hash);
}
__name(checkHashLength, "checkHashLength");

// src/OnchainKitProvider.tsx
var OnchainKitContext = /* @__PURE__ */ createContext(ONCHAIN_KIT_CONFIG);
function OnchainKitProvider({ address, apiKey, chain, children, config, projectId, rpcUrl, schemaId }) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  const value = useMemo(() => {
    const defaultPaymasterUrl = apiKey ? `https://api.developer.coinbase.com/rpc/v1/${chain.name.replace(" ", "-").toLowerCase()}/${apiKey}` : null;
    const onchainKitConfig = {
      address: address ?? null,
      apiKey: apiKey ?? null,
      chain,
      config: {
        appearance: {
          name: config?.appearance?.name,
          logo: config?.appearance?.logo,
          mode: config?.appearance?.mode ?? "auto",
          theme: config?.appearance?.theme ?? "default"
        },
        paymaster: config?.paymaster || defaultPaymasterUrl
      },
      projectId: projectId ?? null,
      rpcUrl: rpcUrl ?? null,
      schemaId: schemaId ?? null
    };
    setOnchainKitConfig(onchainKitConfig);
    return onchainKitConfig;
  }, [
    address,
    apiKey,
    chain,
    config,
    projectId,
    rpcUrl,
    schemaId
  ]);
  return /* @__PURE__ */ React.createElement(OnchainKitContext.Provider, {
    value
  }, children);
}
__name(OnchainKitProvider, "OnchainKitProvider");

// src/useOnchainKit.tsx
import { useContext } from "react";
function useOnchainKit() {
  return useContext(OnchainKitContext);
}
__name(useOnchainKit, "useOnchainKit");

// src/version.ts
var version = "0.35.2";
export {
  OnchainKitProvider,
  getOnchainKitConfig,
  isBase,
  isEthereum,
  setOnchainKitConfig,
  useOnchainKit,
  version
};
//# sourceMappingURL=index.js.map