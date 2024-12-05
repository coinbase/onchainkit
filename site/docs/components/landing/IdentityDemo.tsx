import {
  Address,
  Avatar,
  Badge,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import App from '../App.tsx';

export const identityDemoCode = `
  import {
    Avatar,
    Identity,
    Name,
    Badge,
    Address
  } from '@coinbase/onchainkit/identity';

  function IdentityDemo() {
    return (
      <Identity
        address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9"
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
      >
        <Avatar />
        <Name>
          <Badge />
        </Name>
        <Address />
      </Identity>
    )
  }
  `;

function IdentityDemo() {
  return (
    <App>
      <Identity
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
        address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9"
        className="rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-900"
      >
        <Avatar>
          <Badge className="badge" />
        </Avatar>
        <Name />
        <Address />
      </Identity>
    </App>
  );
}

export default IdentityDemo;
