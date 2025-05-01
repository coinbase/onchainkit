import {
  AuthKitProvider,
  SignInButton,
  useProfile,
} from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

const config = {
  relay: 'https://relay.farcaster.xyz',
  rpcUrl: 'https://mainnet.optimism.io',
  domain: typeof window !== 'undefined' ? window.location.host : '',
  siweUri: typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
};

export function FarcasterLogin() {
  return (
    <AuthKitProvider config={config}>
      <div>
        <SignInButton />
      </div>
      <Profile />
    </AuthKitProvider>
  );
}

function Profile() {
  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, bio, pfpUrl },
  } = profile;

  return (
    <div style={{ textAlign: 'center' }}>
      {isAuthenticated ? (
        <div>
          <img
            src={pfpUrl}
            alt={displayName}
            style={{ width: '48px', height: '48px', borderRadius: '50%' }}
          />
          <p>
            Hello, {displayName}! Your FID is {fid}.
          </p>
          <p>{bio}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
} 