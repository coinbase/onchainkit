// 🌲☀️🌲
export { version } from './version';
export { getEASAttestations } from './core/getEASAttestations';
export { getFrameHtmlResponse } from './core/getFrameHtmlResponse';
export { getFrameMetadata } from './core/getFrameMetadata';
export { getFrameMessage } from './core/getFrameMessage';
export { getMockFrameRequest } from './core/getMockFrameRequest';
export { createFrameApiKey } from './core/createFrameApiKey';
export { FrameMetadata } from './components/FrameMetadata';
export { Avatar } from './components/Avatar';
export { Name } from './components/Name';
export { useAvatar } from './hooks/useAvatar';
export { useName } from './hooks/useName';
export type {
  FrameButtonMetadata,
  FrameImageMetadata,
  FrameInputMetadata,
  FrameMetadataReact,
  FrameMetadataType,
  FrameRequest,
  FrameValidationData,
  MockFrameRequest,
  MockFrameRequestOptions,
  CreateFrameApiKey,
  CreateFrameApiKeyResponse,
} from './core/types';
