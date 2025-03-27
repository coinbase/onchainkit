import { useCallback } from 'react';
import { useMiniKit } from './useMiniKit';

/**
 * Sends notification data to the notification proxy URL set in the MiniKit context
 * @param title - The title of the notification.
 * @param body - The body of the notification.
 * @returns boolean - true if the notification was sent successfully, false otherwise
 */
export function useNotification() {
  const { context, notificationProxyUrl } = useMiniKit();

  return useCallback(
    async ({ title, body }: { title: string; body: string }) => {
      if (!context) {
        return false;
      }

      try {
        const response = await fetch(notificationProxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fid: context.user.fid,
            notification: {
              notificationId: crypto.randomUUID(),
              notificationDetails: context.client?.notificationDetails ?? null,
              title,
              body,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }

        return true;
      } catch (error) {
        console.error('Error sending notification:', error);
        return false;
      }
    },
    [context, notificationProxyUrl],
  );
}
