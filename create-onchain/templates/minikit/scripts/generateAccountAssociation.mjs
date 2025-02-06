#!/usr/bin/env node
import { createWalletClient, http, createPublicClient } from 'viem';
import { optimism } from 'viem/chains';
import { mnemonicToAccount } from 'viem/accounts';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import fs from 'node:fs';
import path from 'node:path';

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

async function getCustodyAddress(fid) {
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

  return resolvedCustodyAddress;
}

async function generateAccountAssociation(params) {
  const { mnemonic, domain, fid } = params;
 
  const account = mnemonicToAccount(mnemonic);

  const custodyAddress = await getCustodyAddress(fid);

  if (account.address.toLowerCase() !== custodyAddress.toLowerCase()) {
    console.error('Derived address does not match custody address!  Please check your mnemonic and fid and try again.');
    console.error('Derived address:', account.address);
    console.error('Registered Custody address:', custodyAddress);
    process.exit(1);
  }

  const header = {
    fid,
    type: "custody",
    key: account.address,
  };

  const payload = {
    domain: domain.replace(/^(http|https):\/\//, ''),
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const messageToSign = `${encodedHeader}.${encodedPayload}`;
  
  const client = createWalletClient({
    account,
    chain: optimism,
    transport: http()
  });

  const signature = await client.signMessage({
    message: messageToSign,
  });

  const encodedSignature = Buffer.from(signature).toString('base64url');

  const jsonJfs = {
    header: encodedHeader,
    payload: encodedPayload,
    signature: encodedSignature
  };

  const envContent = `FARCASTER_HEADER=${encodedHeader}
FARCASTER_PAYLOAD=${encodedPayload}
FARCASTER_SIGNATURE=${encodedSignature}
NEXT_PUBLIC_URL=${domain}`;

  const targetDir = process.argv[2] || process.cwd();
  const envPath = path.join(targetDir, '.env');
  const existingEnv = await fs.promises.readFile(envPath, 'utf-8').catch(() => '');
  const updatedEnv = existingEnv
    .split('\n')
    .filter(line => !line.startsWith('FARCASTER_') && !line.startsWith('NEXT_PUBLIC_URL'))
    .concat(envContent)
    .join('\n');
  await fs.promises.writeFile(envPath, updatedEnv);

  console.log('\nFarcaster account association generated successfully and added to your .env file!\n');
  console.log(JSON.stringify(jsonJfs, null, 2));
}

async function init() {
  let result;

  try {
    result = await prompts(
      [
        {
          type: 'password',
          name: 'mnemonic',
          message: pc.reset('Enter your seed phrase (12 or 24 words separated by spaces):'),
          validate: value => 
            value.split(' ').length === 12 || value.split(' ').length === 24 || 
            'Mnemonic must be 12 or 24 words'
        },
        {
          type: 'text',
          name: 'domain',
          message: pc.reset('Enter your domain with protocol (e.g. https://example.com):'),
          validate: value => value.length > 0 || 'Domain is required'
        },
        {
          type: 'number',
          name: 'fid',
          message: pc.reset('Enter your FID:'),
          validate: value => !isNaN(value) || 'FID must be a number'
        }
      ],
      {
        onCancel: () => {
          console.log('\nScript cancelled.');
          process.exit(0);
        },
      }
    );
  } catch (cancelled) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const spinner = ora('Generating account association...').start();
  try {
    await generateAccountAssociation(result);
    spinner.succeed('Farcaster account association generated successfully!');
  } catch (error) {
    spinner.fail('Failed to generate Farcaster account association');
    console.error(error);
  }
}

init().catch((e) => {
  console.error(e);
});