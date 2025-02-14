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
  isBaseOptions,
  isEthereumOptions,
  OnchainKitConfig,
  OnchainKitContextType,
} from './core/types';

export type { OnchainKitProviderReact } from './types';

export { MiniKitProvider } from './minikit/MiniKitProvider';
export type { MiniKitProviderReact } from './minikit/MiniKitProvider';
export { useMiniKit } from './minikit/hooks/useMiniKit';
export { useOpenUrl } from './minikit/hooks/useOpenUrl';
export { useAuthenticate } from './minikit/hooks/useAuthenticate';
export { useViewProfile } from './minikit/hooks/useViewProfile';
export { useAddFrame } from './minikit/hooks/useAddFrame';
export { usePrimaryButton } from './minikit/hooks/usePrimaryButton';
export { useNotification } from './minikit/hooks/useNotification';
export { useClose } from './minikit/hooks/useClose';
export type { AuthProvider } from './minikit/hooks/useAuthenticate';