import {
  Address,
  Avatar,
  Badge,
  Identity,
  Name,
  Socials,
  useAddress,
  useAvatar,
  useName,
} from '@coinbase/onchainkit/identity';
import { useEffect } from 'react';
import { base, mainnet } from 'viem/chains';
import { useAccount } from 'wagmi';

export default function IdentityDemo() {
  const { address } = useAccount();

  const { data: ensAddress } = useAddress({ address });
  const { data: addressBasename } = useAddress({ address, chain: base });
  const { data: avatar } = useAvatar({ address });
  const { data: avatarBasename } = useAvatar({ address, chain: base });
  const { data: name } = useName({ address });
  const { data: basename } = useName({ address, chain: base });

  useEffect(() => {
    console.log('Connected address:', address);
    console.log('useAddress default', ensAddress);
    console.log('useAddress base', addressBasename);
    console.log('useAvatar default', avatar);
    console.log('useAvatar base', avatarBasename);
    console.log('useName default', name);
    console.log('useName base', basename);
  }, [
    address,
    ensAddress,
    addressBasename,
    avatar,
    avatarBasename,
    name,
    basename,
  ]);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="relative">
        {address && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="font-medium text-gray-500 text-sm">
                Default Chain
              </h2>
              <div className="flex items-center space-x-4">
                <Identity address={address} chain={mainnet}>
                  <Avatar />
                  <Name>
                    <Badge />
                  </Name>
                  <Address />
                  <Socials />
                </Identity>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-medium text-gray-500 text-sm">Base Chain</h2>
              <div className="flex items-center space-x-4">
                <Identity address={address} chain={base}>
                  <Avatar />
                  <Name>
                    <Badge />
                  </Name>
                  <Address />
                  <Socials />
                </Identity>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
