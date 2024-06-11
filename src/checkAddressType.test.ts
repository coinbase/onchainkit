import { checkAddressType } from './checkAddressType';
import type { PublicClient } from 'viem';

const client = {
  getBytecode: jest.fn(),
  request: jest.fn(),
} as unknown as PublicClient;

describe('checkAddressType', () => {
  it('should return "EOA" for an externally owned account (EOA)', async () => {
    const address = '0x4bEf0221d6F7Dd0C969fe46a4e9b339a84F52FDF'; // My EOA address

    // Mock the getBytecode function to return an empty string indicating an EOA
    (client.getBytecode as jest.Mock).mockResolvedValue('0x');

    const result = await checkAddressType({ client, address });

    expect(result).toEqual({ type: 'EOA' });
  });

  it('should return "Coinbase Smart Wallet" for a known Coinbase Smart Wallet address', async () => {
    const address = '0x06C36AA794d96fD7816deA8De80d4B8Aa9DB283c'; // My Coinbase Smart Wallet address

    // Mock the getBytecode function to return the Coinbase Smart Wallet proxy bytecode
    (client.getBytecode as jest.Mock).mockResolvedValue(
      '0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3',
    );

    // Mock the request function to return the Coinbase Smart Wallet implementation address
    (client.request as jest.Mock).mockResolvedValue(
      '0x000000000000000000000000000100abaad02f1cfC8Bbe32bD5a564817339E72',
    );

    const result = await checkAddressType({ client, address });

    expect(result).toEqual({ type: 'Coinbase Smart Wallet' });
  });

  it('should return "Smart Contract" for a regular smart contract address', async () => {
    const address = '0xe6b59b3146eb9878FC2Fa07F2007505B2bFAF9dB'; // Our bundler address, can be any smart contract address

    // Mock the getBytecode function to return some non-empty bytecode
    (client.getBytecode as jest.Mock).mockResolvedValue('0x123456');

    const result = await checkAddressType({ client, address });

    expect(result).toEqual({ type: 'Smart Contract' });
  });
});
