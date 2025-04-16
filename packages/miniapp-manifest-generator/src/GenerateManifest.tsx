import { useCallback, useState } from 'react';
import { Success } from './components/Success';
import { Connect } from './components/steps/Connect';
import { Domain } from './components/steps/Domain';
import { Sign } from './components/steps/Sign';
import { useWebsocket } from './hooks/useWebsocket';
import { AccountAssociation } from './types';

function GenerateManifest() {
  const wsRef = useWebsocket();
  const [domain, setDomain] = useState<string>('');
  const [accountAssocation, setAccountAssocation] =
    useState<AccountAssociation | null>(null);

  const handleSigned = useCallback(
    (accountAssociation: AccountAssociation) => {
      wsRef?.send(JSON.stringify(accountAssociation));
      setAccountAssocation(accountAssociation);
    },
    [wsRef],
  );

  return (
    <main className="flex min-h-screen w-full max-w-[600px] flex-col items-center justify-center gap-6 font-sans">
      <div className="border border-grey-500 p-4">
        <Connect />

        <Domain
          handleSetDomain={setDomain}
          description="This will be used to generate your Mini-App manifest and also added to your .env file as the `NEXT_PUBLIC_URL` variable."
        />

        <Sign domain={domain} handleSigned={handleSigned} />

        <Success
          accountAssocation={accountAssocation}
          handleClose={window.close}
        />
      </div>
    </main>
  );
}

export default GenerateManifest;
