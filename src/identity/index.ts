// 🌲☀️🌲
export { Avatar } from './components/Avatar';
export { Badge } from './components/Badge';
export { Name } from './components/Name';
export { getAvatar, getEnsAvatar } from './core/getAvatar';
export { getName } from './core/getName';
export { useAvatar } from './hooks/useAvatar';
export { useName } from './hooks/useName';
export { useAttestations } from './hooks/useAttestations';
export { getAttestations } from './getAttestations';
export type {
  Attestation,
  AvatarReact,
  BadgeReact,
  EASSchemaUid,
  EASChainDefinition,
  GetAttestationsOptions,
  GetAvatarReturnType,
  GetNameReturnType,
} from './types';
