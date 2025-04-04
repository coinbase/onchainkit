import type { PublicClient, RpcUserOperation } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';
import {
  CB_SW_PROXY_BYTECODE,
  CB_SW_V1_IMPLEMENTATION_ADDRESS,
} from '../constants';
import { isWalletACoinbaseSmartWallet } from './isWalletACoinbaseSmartWallet';

describe('isWalletACoinbaseSmartWallet', () => {
  const client = {
    getBytecode: vi.fn(),
    request: vi.fn(),
  } as unknown as PublicClient;

  it('should return false for an undeployed account that does not use the Smart Wallet factory', async () => {
    const userOp = {
      initCode: 'other-factory',
    } as unknown as RpcUserOperation<'0.6'>;

    (client.getBytecode as Mock).mockReturnValue(undefined);

    const result = await isWalletACoinbaseSmartWallet({ client, userOp });
    expect(result).toEqual({
      isCoinbaseSmartWallet: false,
      error: 'Invalid factory address',
      code: 'W_ERR_1',
    });
  });

  it('should return true for an undeployed account that does use the Smart Wallet factory', async () => {
    const userOp = {
      initCode: '0x0BA5ED0c6AA8c49038F819E587E2633c4A9F428a1234',
    } as unknown as RpcUserOperation<'0.6'>;

    (client.getBytecode as Mock).mockReturnValue(undefined);

    const result = await isWalletACoinbaseSmartWallet({ client, userOp });
    expect(result).toEqual({
      isCoinbaseSmartWallet: true,
    });
  });

  it('should return false for an invalid sender proxy address', async () => {
    const userOp = {
      sender: 'invalid-proxy-address',
    } as unknown as RpcUserOperation<'0.6'>;

    (client.getBytecode as Mock).mockReturnValue('invalid bytecode');
    (client.request as Mock).mockResolvedValue(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );

    const result = await isWalletACoinbaseSmartWallet({ client, userOp });
    expect(result).toEqual({
      isCoinbaseSmartWallet: false,
      error: 'Invalid bytecode',
      code: 'W_ERR_2',
    });
  });

  it('should return false when the implementation address does not match COINBASE_SMART_WALLET_V1_IMPLEMENTATION', async () => {
    const userOp = {
      sender: 'valid-proxy-address',
    } as unknown as RpcUserOperation<'0.6'>;

    (client.getBytecode as Mock).mockResolvedValue(CB_SW_PROXY_BYTECODE);
    const differentImplementationAddress =
      '0x0000000000000000000000000000000000000000000000000000000000000001';

    (client.request as Mock).mockResolvedValue(differentImplementationAddress);

    const result = await isWalletACoinbaseSmartWallet({ client, userOp });
    expect(result).toEqual({
      isCoinbaseSmartWallet: false,
      error: 'Invalid implementation address',
      code: 'W_ERR_5',
    });
  });

  it('should return true for a valid sender proxy address with correct implementation address', async () => {
    const client = {
      getBytecode: vi.fn(),
      request: vi.fn(),
    } as unknown as PublicClient;

    const userOp = {
      sender: 'valid-proxy-address',
    } as unknown as RpcUserOperation<'0.6'>;

    (client.getBytecode as Mock).mockResolvedValue(CB_SW_PROXY_BYTECODE);
    (client.request as Mock).mockResolvedValue(
      `0x${CB_SW_V1_IMPLEMENTATION_ADDRESS.slice(2).padStart(64, '0')}`,
    );

    const result = await isWalletACoinbaseSmartWallet({ client, userOp });
    expect(result).toEqual({ isCoinbaseSmartWallet: true });
  });

  it('should return false when there is an error retrieving bytecode', async () => {
    const userOp = {
      sender: 'error-address',
    } as unknown as RpcUserOperation<'0.6'>;

    (client.getBytecode as Mock).mockRejectedValue(
      new Error('Failed to fetch bytecode'),
    );
    (client.request as Mock).mockResolvedValue(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );

    const result = await isWalletACoinbaseSmartWallet({ client, userOp });
    expect(result).toEqual({
      isCoinbaseSmartWallet: false,
      error: 'Error retrieving bytecode',
      code: 'W_ERR_3',
    });
  });

  it('should return false when there is an error retrieving implementation address', async () => {
    const userOp = {
      sender: 'valid-proxy-address',
    } as unknown as RpcUserOperation<'0.6'>;

    (client.getBytecode as Mock).mockResolvedValue(CB_SW_PROXY_BYTECODE);
    (client.request as Mock).mockRejectedValue(
      new Error('Failed to fetch implementation address'),
    );

    const result = await isWalletACoinbaseSmartWallet({ client, userOp });
    expect(result).toEqual({
      isCoinbaseSmartWallet: false,
      error: 'Error retrieving implementation address',
      code: 'W_ERR_4',
    });
  });
});
