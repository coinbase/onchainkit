import { useCallback } from "react";
import { useMiniKit } from "./useMiniKit";


export function useNotification() {
  const { context, notificationProxyUrl } = useMiniKit();

  return useCallback(async ({ title, body }: { title: string, body: string }) => {
    if (!context) {
      return false;
    }
  
    try {
      const response = await fetch(notificationProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fid: context.user.fid,
          notification: {
            notificationId: crypto.randomUUID(),
            title,
            body,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }, [context, notificationProxyUrl]);
}