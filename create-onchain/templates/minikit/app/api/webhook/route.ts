import { deleteUserNotificationDetails } from '@/lib/redis';
import { sendFrameNotification } from '@/lib/notification';
import { setUserNotificationDetails } from '@/lib/redis';
import { getSSLHubRpcClient } from '@farcaster/hub-nodejs';

const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME;

async function verifyFidOwnership(fid: number, appKey: `0x${string}`) {
  const client = getSSLHubRpcClient('nemes.farcaster.xyz:2283');
  const response = await client.getOnChainSignersByFid({ fid });
  
  if (response.isOk()) {
    const events = response.value.events;
    return events.some(event => {
      const keyBuffer = event.signerEventBody?.key;
      if (!keyBuffer) {
        return false;
      }

      const keyHex = `0x${Buffer.from(keyBuffer).toString('hex')}`;
      return keyHex.toLowerCase() === appKey.toLowerCase();
    });
  }
  
  return false;
}

function decode(encoded: string) {
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
}

export async function POST(request: Request) {
  const requestJson = await request.json();

  const {
    header: encodedHeader,
    payload: encodedPayload,
  } = requestJson;

  const headerData = decode(encodedHeader);
  const event = decode(encodedPayload);

  const { fid, key } = headerData;

  // verify the app key is owned by the fid
  const valid = await verifyFidOwnership(fid, key);
  console.log('valid', valid);

  if (!valid) {
    return Response.json({ success: false, error: 'Invalid FID ownership' }, { status: 401 });
  }

  switch (event.event) {
    case "frame_added":
      if (event.notificationDetails) {
        console.log("frame_added", "event.notificationDetails", event.notificationDetails);
        await setUserNotificationDetails(fid, event.notificationDetails);
        await sendFrameNotification({
          fid,
          title: `Welcome to ${appName}`,
          body: `Thank you for adding ${appName}`,
        });
      } else {
        console.log("frame_added", "event.notificationDetails", event.notificationDetails);
          await deleteUserNotificationDetails(fid);
        }

      break;
    case "frame_removed": {
      console.log("frame_removed");
      await deleteUserNotificationDetails(fid);
      break;
    }
    case "notifications_enabled": {
      console.log("notifications_enabled", event.notificationDetails);
      await setUserNotificationDetails(fid, event.notificationDetails);
      await sendFrameNotification({
        fid,
        title: `Welcome to ${appName}`,
        body: `Thank you for enabling notifications for ${appName}`,
      });

      break;
    }
    case "notifications_disabled": {
      console.log("notifications_disabled");
      await deleteUserNotificationDetails(fid);

      break; 
    }
  }

  return Response.json({ success: true });
}


