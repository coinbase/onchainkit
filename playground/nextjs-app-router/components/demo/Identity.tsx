import {
  Avatar,
  Name,
  useAddress,
  useAvatar,
  useName,
} from '@coinbase/onchainkit/identity';
import { useEffect } from 'react';
import { base } from 'viem/chains';

const demoAddress = '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1';

export default function IdentityDemo() {
  const { data: address } = useAddress({
    name: 'zizzamia.eth',
  });
  const { data: addressBasename } = useAddress({
    name: 'zizzamia.base.eth',
  });
  const { data: avatar } = useAvatar({
    ensName: 'zizzamia.eth',
  });
  const { data: avatarBasename } = useAvatar({
    ensName: 'zizzamia.eth',
    chain: base,
  });
  const { data: name } = useName({ address: demoAddress });
  const { data: basename } = useName({
    address: demoAddress,
    chain: base,
  });

  useEffect(() => {
    console.log('useAddress default', address);
    console.log('useAddress base', addressBasename);
    console.log('useAvatar default', avatar);
    console.log('useAvatar base', avatarBasename);
    console.log('useName default', name);
    console.log('useName base', basename);
  }, [address, addressBasename, avatar, avatarBasename, name, basename]);

  return (
    <div className="mx-auto">
      <div className="relative h-full w-full">
        <ul>
          <li>
            <Avatar address={demoAddress} />
          </li>
          <li>
            <Avatar address={demoAddress} chain={base} />
          </li>
        </ul>
        <ul>
          <li>
            <Name address={demoAddress} />
          </li>
          <li>
            <Name address={demoAddress} chain={base} />
          </li>
        </ul>
      </div>
    </div>
  );
}
