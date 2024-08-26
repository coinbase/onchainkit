import { useName } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';

const demoAddress = '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1';

export default function IdentityDemo() {
  const { data: name, isLoading } = useName({ address: demoAddress });
  const { data: basename, isLoadingBasename } = useName({
    address: demoAddress,
    chain: base,
  });

  return (
    <div className="mx-auto">
      <div className="relative h-full w-full">
        <ul>
          <li>
            <b>useName default:</b> {isLoading ? 'Loading...' : name}
          </li>
          <li>
            <b>useName base:</b> {isLoadingBasename ? 'Loading...' : basename}
          </li>
        </ul>
      </div>
    </div>
  );
}
