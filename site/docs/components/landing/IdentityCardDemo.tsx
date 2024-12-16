import { IdentityCard } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import App from '../App.tsx';

export const identityCardDemoCode = `
  import { IdentityCard } from '@coinbase/onchainkit/identity';
  import { base } from 'viem/chains';

  function IdentityCardDemo() {
    return (
      <IdentityCard
        address="0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1"
        chain={base}
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
      />
    )
  }
`;

function IdentityCardDemo() {
  return (
    <App>
      <IdentityCard
        address="0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1"
        chain={base}
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
      />
    </App>
  );
}

export default IdentityCardDemo;
