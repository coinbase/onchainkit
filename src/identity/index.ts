// 🌲☀️🌲
export { Avatar } from './components/Avatar';
export { Name } from './components/Name';
export { getAvatar } from './core/getAvatar';
export { getName } from './core/getName';
export { useAvatar } from './hooks/useAvatar';
export { useName } from './hooks/useName';
export { IdentityProvider } from './hooks/useIdentity';
export { getEASAttestations } from './getEASAttestations';
export type {
  EASSchemaUid,
  EASAttestation,
  EASChainDefinition,
  GetEASAttestationsOptions,
  GetAvatarReturnType,
  GetNameReturnType,
} from './types';
