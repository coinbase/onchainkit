// 🌲☀️🌲
export { isBase } from './core/utils/isBase';
export { isEthereum } from './core/utils/isEthereum';
export {
  getOnchainKitConfig,
  setOnchainKitConfig,
} from './core/OnchainKitConfig';
export { OnchainKitProvider } from './core-react/OnchainKitProvider';
export { useOnchainKit } from './core-react/useOnchainKit';
export { version } from './version';
export type {
  AppConfig,
  isBaseOptions,
  isEthereumOptions,
  OnchainKitConfig,
  OnchainKitContextType,
} from './core/types';

export type { OnchainKitProviderReact } from './core-react/types';
