import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

const BACKEND_ORIGIN = 'http://localhost:3000';

export function App() {
  const [user, setUser] = useState<{ fid: number }>();

  useEffect(() => {
    (async () => {
      const res = await sdk.quickAuth.fetch(`${BACKEND_ORIGIN}/me`);
      if (res.ok) {
        setUser(await res.json());
        sdk.actions.ready();
      }
    })();
  }, []);

  // The splash screen will be shown, don't worry about rendering yet.
  if (!user) {
    return null;
  }

  return <div>hello, {user.fid}</div>;
}
