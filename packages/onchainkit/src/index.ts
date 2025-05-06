export { OnchainKitProvider } from './OnchainKitProvider';
export { useOnchainKit } from './useOnchainKit';
export { version } from './version';
export type { OnchainKitProviderReact } from './types';

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
import './styles/index.css';

export { Connected } from './connected';
