import type { Context, MiniAppNotificationDetails } from '@farcaster/frame-sdk';
import { PropsWithChildren } from 'react';

export type UpdateClientContextParams = {
  details?: MiniAppNotificationDetails | null;
  miniAppAdded?: boolean;
};

export type MiniKitOptions = {
  /**
   * Whether to enable MiniKit features.
   * @defaultValue `false`
   */
  enabled?: boolean;
  /**
   * The URL of the notification proxy.
   * Notifications are sent by posting a cross origin request to a url returned by
   * the frames context.  This prop allows you to set a custom proxy route for MiniKits
   * notification related hooks to use.
   * @defaultValue `/api/notify`
   */
  notificationProxyUrl?: string;
  /**
   * Whether to automatically connect to the Farcaster connector if the user is in a Mini App.
   *
   * @defaultValue `true`
   */
  autoConnect?: boolean;
};

export type MiniKitProviderProps = PropsWithChildren<MiniKitOptions>;

export type MiniKitContextType = {
  enabled: boolean;
  context: Context.MiniAppContext | null;
  updateClientContext: (params: UpdateClientContextParams) => void;
  notificationProxyUrl: string;
  __isMiniKit: boolean;
};
