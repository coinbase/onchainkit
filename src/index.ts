// 🌲☀️🌲
export { OnchainKitProvider } from './OnchainKitProvider';
export { useOnchainKit } from './useOnchainKit';
export type { OnchainKitContextType } from './types';
export { version } from './version';

/** @deprecated Prefer `import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';` */
export { getFrameHtmlResponse } from './frame/getFrameHtmlResponse';
/** @deprecated Prefer `import { getFrameMessage } from '@coinbase/onchainkit/frame';` */
export { getFrameMessage } from './frame/getFrameMessage';
/** @deprecated Prefer `import { getMockFrameRequest } from '@coinbase/onchainkit/frame';` */
export { getMockFrameRequest } from './frame/getMockFrameRequest';
/** @deprecated Prefer `import type { ... } from '@coinbase/onchainkit/frame';` */
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
} from './frame/types';
