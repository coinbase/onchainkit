import { CB_SW_PROXY_BYTECODE, CB_SW_V1_IMPLEMENTATION_ADDRESS } from './constants';
import { isWalletASmartWallet } from './isWalletASmartWallet';
import type { UserOperation } from 'permissionless';
import type { PublicClient } from 'viem';

describe('isWalletASmartWallet', () => {
  const client = {
    getBytecode: jest.fn(),
    request: jest.fn(),
  } as unknown as PublicClient;

  it('should return false for an invalid sender proxy address', async () => {
    const userOp = {
      sender: 'invalid-proxy-address',
    } as unknown as UserOperation<'v0.6'>;

    (client.getBytecode as jest.Mock).mockReturnValue('invalid bytecode');
    (client.request as jest.Mock).mockResolvedValue(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );

    const result = await isWalletASmartWallet({ client, userOp });
    expect(result).toEqual(false);
  });

  it('should return false when the implementation address does not match COINBASE_SMART_WALLET_V1_IMPLEMENTATION', async () => {
    const userOp = {
      sender: 'valid-proxy-address',
    } as unknown as UserOperation<'v0.6'>;

    (client.getBytecode as jest.Mock).mockResolvedValue(CB_SW_PROXY_BYTECODE);
    const differentImplementationAddress =
      '0x0000000000000000000000000000000000000000000000000000000000000001';

    (client.request as jest.Mock).mockResolvedValue(differentImplementationAddress);

    const result = await isWalletASmartWallet({ client, userOp });
    expect(result).toEqual(false);
  });

  it('should return true for a valid sender proxy address with correct implementation address', async () => {
    const client = {
      getBytecode: jest.fn(),
      request: jest.fn(),
    } as unknown as PublicClient;

    const userOp = {
      sender: 'valid-proxy-address',
    } as unknown as UserOperation<'v0.6'>;

    (client.getBytecode as jest.Mock).mockResolvedValue(CB_SW_PROXY_BYTECODE);
    (client.request as jest.Mock).mockResolvedValue(
      '0x' + CB_SW_V1_IMPLEMENTATION_ADDRESS.slice(2).padStart(64, '0'),
    );

    const result = await isWalletASmartWallet({ client, userOp });
    expect(result).toEqual(true);
  });
});
