#!/usr/bin/env node
import { createPublicClient, http, verifyMessage } from 'viem';
import { optimism } from 'viem/chains';
import fs from 'node:fs';

// parse .env file
function parseEnv(content) {
  return content
    .split('\n')
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        acc[key.trim()] = valueParts.join('=').trim();
      }
      return acc;
    }, {});
}

// ID Registry Contract
const ID_REGISTRY_ADDRESS = '0x00000000Fc6c5F01Fc30151999387Bb99A9f489b';
const ID_REGISTRY_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "custodyOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function main() {
  // read and parse .env file
  const envContent = await fs.promises.readFile('.env', 'utf-8');
  const env = parseEnv(envContent);

  const {
    NEXT_PUBLIC_FARCASTER_HEADER: encodedHeader,
    NEXT_PUBLIC_FARCASTER_PAYLOAD: encodedPayload,
    NEXT_PUBLIC_FARCASTER_SIGNATURE: encodedSignature,
  } = env;

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error('Missing required environment variables. Run generate-app-association first.');
  }

  console.log('Step 1: Decoding and validating header...');

  const headerData = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf-8'));
  console.log('Header data:', headerData);

  const { fid, type, key } = headerData;

  if (type !== 'custody') {
    throw new Error("Invalid type - must be 'custody'");
  }

  console.log('Step 2: Decoding and validating payload...');

  const payloadData = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
  console.log('Payload data:', payloadData);

  console.log('\nStep 3: Verifying signature...');
  console.log({
    type,
    key,
    message: `${encodedHeader}.${encodedPayload}`,
    signature: encodedSignature,
  })
  // decode signature from base64url
  const signature = Buffer.from(encodedSignature, 'base64url').toString();
  
  // verify the signature
  const valid = await verifyMessage({
    address: key,
    message: `${encodedHeader}.${encodedPayload}`,
    signature: signature,
  });

  if (!valid) {
    throw new Error("Invalid signature");
  }
  console.log('✅ Signature is valid');

  console.log('\nStep 4: Verifying custody address from ID Registry...');

  const client = createPublicClient({
    chain: optimism,
    transport: http(),
  });

  // query the ID Registry contract for the fids custody address
  const resolvedCustodyAddress = await client.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: ID_REGISTRY_ABI,
    functionName: 'custodyOf',
    args: [BigInt(fid)],
  });

  console.log('Resolved custody address:', resolvedCustodyAddress);
  console.log('Signer from header:', key);

  if (resolvedCustodyAddress.toLowerCase() !== key.toLowerCase()) {
    throw new Error("Wrong custody address");
  }
  console.log('✅ Custody address matches');

  console.log('\n✅ All validations passed successfully!');
}

main().catch((error) => {
  console.error('\n❌ Validation failed:', error.message);
  process.exit(1);
}); 