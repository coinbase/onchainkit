import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { mnemonicToAccount } from 'viem/accounts';

// Replace with your seed phrase
const MNEMONIC = ''; // 12 or 24 words separated by spaces
const DOMAIN = '';
const FID = 0;
const CUSTODY_ADDRESS = '0x';

async function main() {
  // Create account from mnemonic
  const account = mnemonicToAccount(MNEMONIC);
  
  console.log('Derived address:', account.address);
  console.log('Make sure this matches your custody address!');

  // Create the header object
  const header = {
    fid: FID,
    type: "custody",
    key: CUSTODY_ADDRESS,
  };

  // Create the payload object
  const payload = {
    domain: DOMAIN,
  };

  // Convert to base64url (not base64)
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  // Create the message to sign
  const messageToSign = `${encodedHeader}.${encodedPayload}`;
  
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  });

  // Sign the message
  const signature = await client.signMessage({
    message: messageToSign,
  });

  // Encode signature to base64url
  const encodedSignature = Buffer.from(signature).toString('base64url');

  // Create both compact and JSON formats
  const compactJfs = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  const jsonJfs = {
    header: encodedHeader,
    payload: encodedPayload,
    signature: encodedSignature
  };

  console.log('\nJSON Format (use this for your farcaster.json.ts):');
  console.log(JSON.stringify(jsonJfs, null, 2));
  
  console.log('\nCompact Format:');
  console.log(compactJfs);
}

main().catch(console.error); 