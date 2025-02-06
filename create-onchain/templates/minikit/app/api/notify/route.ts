import { sendFrameNotification } from "@/lib/notification-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body); // Debug log

    const { fid, notification } = body;

    const result = await sendFrameNotification({
      fid,
      title: notification.title,
      body: notification.body,
    });

    if (result.state === "error") {
      console.error('API error:', result.error);
      return new Response(JSON.stringify({ error: result.error }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log('Notification sent successfully');
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 