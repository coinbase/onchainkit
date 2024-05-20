import { baseSepolia } from "viem/chains";
import { OnchainKitConfig, SetOnchainKitConfig } from "./types";

// The config should be never exported as a constant, 
// but only acccessed through the get and set functions.
const ONCHAIN_KIT_CONFIG: OnchainKitConfig = {
  address: null,
  chain: baseSepolia,
  schemaId: null
};

export const getOnchainKitConfig = (configName: keyof typeof ONCHAIN_KIT_CONFIG): any => {  
  return ONCHAIN_KIT_CONFIG[configName];
};

export const setOnchainKitConfig = (properties: SetOnchainKitConfig) => {
  Object.assign(ONCHAIN_KIT_CONFIG, properties);
  return getOnchainKitConfig;
};