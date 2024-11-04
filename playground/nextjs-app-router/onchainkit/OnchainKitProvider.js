import { createContext, useMemo } from 'react';
import { ONCHAIN_KIT_CONFIG, setOnchainKitConfig } from './OnchainKitConfig.js';
import { checkHashLength } from './internal/utils/checkHashLength.js';
import { jsx } from 'react/jsx-runtime';
const OnchainKitContext = /*#__PURE__*/createContext(ONCHAIN_KIT_CONFIG);

/**
 * Provides the OnchainKit React Context to the app.
 */
function OnchainKitProvider({
  address,
  apiKey,
  chain,
  children,
  config,
  projectId,
  rpcUrl,
  schemaId
}) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  const value = useMemo(() => {
    const defaultPaymasterUrl = apiKey ? `https://api.developer.coinbase.com/rpc/v1/${chain.name.replace(' ', '-').toLowerCase()}/${apiKey}` : null;
    const onchainKitConfig = {
      address: address ?? null,
      apiKey: apiKey ?? null,
      chain: chain,
      config: {
        appearance: {
          name: config?.appearance?.name,
          logo: config?.appearance?.logo,
          mode: config?.appearance?.mode ?? 'auto',
          theme: config?.appearance?.theme ?? 'default'
        },
        paymaster: config?.paymaster || defaultPaymasterUrl
      },
      projectId: projectId ?? null,
      rpcUrl: rpcUrl ?? null,
      schemaId: schemaId ?? null
    };
    setOnchainKitConfig(onchainKitConfig);
    return onchainKitConfig;
  }, [address, apiKey, chain, config, projectId, rpcUrl, schemaId]);
  return /*#__PURE__*/jsx(OnchainKitContext.Provider, {
    value: value,
    children: children
  });
}
export { OnchainKitContext, OnchainKitProvider };
//# sourceMappingURL=OnchainKitProvider.js.map
