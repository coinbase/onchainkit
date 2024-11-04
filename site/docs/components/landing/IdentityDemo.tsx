import { Address, Avatar, Identity, Name } from '@coinbase/onchainkit/identity';
import App from '../App.tsx';

export const identityDemoCode = `
  import {
    Avatar,
    Identity,
    Name,
    Address
  } from '@coinbase/onchainkit/identity';

  <Identity
    address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9"
  >
    <Avatar />
    <Name />
    <Address />
  </Identity>
`;

function IdentityDemo() {
  return (
    <App>
      <Identity
        address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9"
        className="rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-900"
      >
        <Avatar />
        <Name />
        <Address />
      </Identity>
    </App>
  );
}

export default IdentityDemo;
