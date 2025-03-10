import type { Context, FrameNotificationDetails } from '@farcaster/frame-sdk';

export type UpdateClientContextParams = {
  details?: FrameNotificationDetails | null;
  frameAdded?: boolean;
};

/**
 * Note: exported as public Type
 */
export type MiniKitProviderReact = {
  children: React.ReactNode;
  /*
   * The URL of the notification proxy.
   * Notifications are sent by posting a cross origin request to a url returned by
   * the frames context.  This prop allows you to set a custom proxy route for MiniKits
   * notification related hooks to use.
   * @default `/api/notify`
   */
  notificationProxyUrl?: string;
};

export type MiniKitContextType = {
  context: Context.FrameContext | null;
  updateClientContext: (params: UpdateClientContextParams) => void;
  notificationProxyUrl: string;
};
