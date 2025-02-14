#!/usr/bin/env node
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { mnemonicToAccount } from 'viem/accounts';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import fs from 'node:fs';

async function generateAccountAssociation(params) {
  const { mnemonic, domain, fid, custodyAddress } = params;
  
  // Create account from mnemonic
  const account = mnemonicToAccount(mnemonic);

  if (account.address.toLowerCase() !== custodyAddress.toLowerCase()) {
    console.error('Derived address does not match custody address!  Please check your mnemonic and custody address and try again.');
    console.error('Derived address:', account.address);
    console.error('Custody address:', custodyAddress);
    process.exit(1);
  }

  // Create the header object
  const header = {
    fid,
    type: "custody",
    key: custodyAddress,
  };

  // Create the payload object
  const payload = {
    domain: domain.replace(/^(http|https):\/\//, ''),
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

  const jsonJfs = {
    header: encodedHeader,
    payload: encodedPayload,
    signature: encodedSignature
  };

  const envContent = `NEXT_PUBLIC_FARCASTER_HEADER=${encodedHeader}
NEXT_PUBLIC_FARCASTER_PAYLOAD=${encodedPayload}
NEXT_PUBLIC_FARCASTER_SIGNATURE=${encodedSignature}
NEXT_PUBLIC_URL=${domain}`;

  const existingEnv = await fs.promises.readFile('.env', 'utf-8').catch(() => '');
  const updatedEnv = existingEnv
    .split('\n')
    .filter(line => !line.startsWith('NEXT_PUBLIC_FARCASTER_') && !line.startsWith('NEXT_PUBLIC_URL'))
    .concat(envContent)
    .join('\n');
  await fs.promises.writeFile('.env', updatedEnv);

  console.log('\n✅ Farcaster account association generated successfully!');
  console.log('.env has been updated or you can copy this to your farcaster.json file.\n');

  console.log(JSON.stringify(jsonJfs, null, 2));

  console.log('\n you can validate the account association by running the following command:');
  console.log(' - npm run validate-account-association');
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
        },
        {
          type: 'text',
          name: 'custodyAddress',
          message: pc.reset('Enter your custody address:'),
          validate: value => /^0x[a-fA-F0-9]{40}$/.test(value) || 'Invalid Ethereum address'
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