import { baseSepolia } from 'viem/chains';

// The ONCHAIN_KIT_CONFIG is not exported at index.ts,
// but only acccessed through the get and set functions.
const ONCHAIN_KIT_CONFIG = {
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

/**
 * Access the ONCHAIN_KIT_CONFIG object directly by providing the key.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
const getOnchainKitConfig = configName => {
  return ONCHAIN_KIT_CONFIG[configName];
};

/**
 * Update the ONCHAIN_KIT_CONFIG object directly by providing the properties to update.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
const setOnchainKitConfig = properties => {
  Object.assign(ONCHAIN_KIT_CONFIG, properties);
  return getOnchainKitConfig;
};
export { ONCHAIN_KIT_CONFIG, getOnchainKitConfig, setOnchainKitConfig };
//# sourceMappingURL=OnchainKitConfig.js.map
