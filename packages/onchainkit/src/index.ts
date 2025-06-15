export {
  OnchainKitProvider,
  useOnchainKit,
  type OnchainKitProviderReact,
} from './onchainkit';

export { version } from './version';

export { isBase } from './core/utils/isBase';
export { isEthereum } from './core/utils/isEthereum';
export {
  getOnchainKitConfig,
  setOnchainKitConfig,
} from './core/OnchainKitConfig';
export type {
  AppConfig,
  IsBaseOptions,
  IsEthereumOptions,
  OnchainKitConfig,
  OnchainKitContextType,
} from './core/types';

export { Connected } from './connected';
