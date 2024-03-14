// 🌲☀️🌲
export { version } from './version';
/** @deprecated Prefer `import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';` */
export { getFrameHtmlResponse } from './frame/getFrameHtmlResponse';
/** @deprecated Prefer `import { getFrameMetadata } from '@coinbase/onchainkit/frame';` */
export { getFrameMetadata } from './frame/getFrameMetadata';
/** @deprecated Prefer `import { getFrameMessage } from '@coinbase/onchainkit/frame';` */
export { getFrameMessage } from './frame/getFrameMessage';
/** @deprecated Prefer `import { getMockFrameRequest } from '@coinbase/onchainkit/frame';` */
export { getMockFrameRequest } from './frame/getMockFrameRequest';
/** @deprecated Prefer `import { FrameMetadata } from '@coinbase/onchainkit/frame';` */
export { FrameMetadata } from './frame/components/FrameMetadata';
/** @deprecated Prefer `import { Avatar } from '@coinbase/onchainkit/identity';` */
export { Avatar } from './identity/components/Avatar';
/** @deprecated Prefer `import { Name } from '@coinbase/onchainkit/identity';` */
export { Name } from './identity/components/Name';
/** @deprecated Prefer `import { useAvatar } from '@coinbase/onchainkit/identity';` */
export { useAvatar } from './identity/hooks/useAvatar';
/** @deprecated Prefer `import { useName } from '@coinbase/onchainkit/identity';` */
export { useName } from './identity/hooks/useName';
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
