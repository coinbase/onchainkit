import type { Context, FrameNotificationDetails } from '@farcaster/frame-sdk';
import { PropsWithChildren } from 'react';

export type UpdateClientContextParams = {
  details?: FrameNotificationDetails | null;
  frameAdded?: boolean;
};

export type MiniKitOptions = {
  /*
   * The URL of the notification proxy.
   * Notifications are sent by posting a cross origin request to a url returned by
   * the frames context.  This prop allows you to set a custom proxy route for MiniKits
   * notification related hooks to use.
   * @default `/api/notify`
   */
  notificationProxyUrl?: string;
  enabled?: boolean;
};

export type MiniKitProviderReact = PropsWithChildren<MiniKitOptions>;

export type MiniKitContextType = {
  enabled: boolean;
  context: Context.FrameContext | null;
  updateClientContext: (params: UpdateClientContextParams) => void;
  notificationProxyUrl: string;
};
