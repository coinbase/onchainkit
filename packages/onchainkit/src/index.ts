// 🌲☀️🌲
export { isBase } from './core/utils/isBase';
export { isEthereum } from './core/utils/isEthereum';
export {
  getOnchainKitConfig,
  setOnchainKitConfig,
} from './core/OnchainKitConfig';
export { OnchainKitProvider } from './OnchainKitProvider';
export { useOnchainKit } from './useOnchainKit';
export { version } from './version';
export type {
  AppConfig,
  IsBaseOptions,
  IsEthereumOptions,
  OnchainKitConfig,
  OnchainKitContextType,
  isBaseOptions,
  isEthereumOptions,
} from './core/types';
import './styles/index.css';

export type { OnchainKitProviderReact } from './types';
