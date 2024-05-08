import { useAccount, useConnect } from 'wagmi';

/**
 * AccountConnect
 *  - Connects to the wallet
 *  - Disconnects from the wallet
 *  - Displays the wallet network
 */
function AccountConnect() {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  return (
    <div className="flex flex-grow">
      {(() => {
        if (account.status === 'disconnected') {
          return (
            <button
              onClick={() => connect({ connector })}
              type="button"
              style={{
                display: 'inline-flex',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                flexGrow: '1',
                gap: '0.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '1.5rem',
                height: '2.5rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  fontWeight: '500',
                  color: '#000000',
                }}
              >
                Connect wallet
              </div>
            </button>
          );
        }

        return (
          <>
            <div>Connected</div>
          </>
        );
      })()}
    </div>
  );
}

export default AccountConnect;
