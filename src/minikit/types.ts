import type { Context, FrameNotificationDetails } from '@farcaster/frame-sdk';

export type UpdateClientContextParams = {
  details?: FrameNotificationDetails | null;
  frameAdded?: boolean;
};

export type MiniKitProviderReact = {
  children: React.ReactNode;
  notificationProxyUrl?: string;
};

/**
 * Note: exported as public Type
 */
export type MiniKitContextType = {
  context: Context.FrameContext | null;
  updateClientContext: (params: UpdateClientContextParams) => void;
  notificationProxyUrl: string;
};
