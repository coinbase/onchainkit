import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import { baseSepolia } from 'viem/chains';
import { CB_SW_PROXY_BYTECODE } from '../constants';
import { willPaymasterSponsor } from './willPaymasterSponsor';
import type { UserOperation } from 'permissionless';
import type { PublicClient } from 'viem';

describe('willPaymasterSponsor', () => {
  const client = {
    getBytecode: jest.fn(),
  } as unknown as PublicClient;

  it('should return false if the chainId is not baseSepolia.id', async () => {
    const chainId = 1;
    const entrypoint = 'entrypoint';
    const userOp = {
      type: 'user',
      version: 'v0.6',
      payload: {
        id: 'id',
        name: 'name',
        email: 'email',
        publicKey: 'publicKey',
        roles: ['role'],
      },
    } as unknown as UserOperation<'v0.6'>;
    const result = await willPaymasterSponsor({ chainId, client, entrypoint, userOp });
    expect(result).toEqual({ isValid: false, error: 'Invalid chain id', code: 1 });
  });

  it('should return false if the entrypoint is not ENTRYPOINT_ADDRESS_V06', async () => {
    const chainId = baseSepolia.id;
    const entrypoint = 'entrypoint';
    const userOp = {
      type: 'user',
      version: 'v0.6',
      payload: {
        id: 'id',
        name: 'name',
        email: 'email',
        publicKey: 'publicKey',
        roles: ['role'],
      },
    } as unknown as UserOperation<'v0.6'>;
    const result = await willPaymasterSponsor({ chainId, client, entrypoint, userOp });
    expect(result).toEqual({ isValid: false, error: 'Invalid entrypoint', code: 2 });
  });

  it('should return false if the userOp.sender is not a proxy with the expected bytecode', async () => {
    const chainId = baseSepolia.id;
    const entrypoint = ENTRYPOINT_ADDRESS_V06;
    const userOp = {
      type: 'user',
      version: 'v0.6',
      payload: {
        id: 'id',
        name: 'name',
        email: 'email',
        publicKey: 'publicKey',
        roles: ['role'],
      },
    } as unknown as UserOperation<'v0.6'>;
    (client.getBytecode as jest.Mock).mockReturnValue('invalid bytecode');
    const result = await willPaymasterSponsor({ chainId, client, entrypoint, userOp });
    expect(result).toEqual({ isValid: false, error: 'Invalid bytecode', code: 4 });
  });

  it('should return false if the client.getBytecode throws an error', async () => {
    const chainId = baseSepolia.id;
    const entrypoint = ENTRYPOINT_ADDRESS_V06;
    const userOp = {
      type: 'user',
      version: 'v0.6',
      payload: {
        id: 'id',
        name: 'name',
        email: 'email',
        publicKey: 'publicKey',
        roles: ['role'],
      },
    } as unknown as UserOperation<'v0.6'>;
    jest.spyOn(client, 'getBytecode').mockRejectedValue('error');
    const result = await willPaymasterSponsor({ chainId, client, entrypoint, userOp });
    expect(result).toEqual({ isValid: false, error: 'Check failled', code: 3 });
  });

  it('should return true if all checks pass', async () => {
    const chainId = baseSepolia.id;
    const entrypoint = ENTRYPOINT_ADDRESS_V06;
    const userOp = {
      type: 'user',
      version: 'v0.6',
      payload: {
        id: 'id',
        name: 'name',
        email: 'email',
        publicKey: 'publicKey',
        roles: ['role'],
      },
    } as unknown as UserOperation<'v0.6'>;
    (client.getBytecode as jest.Mock).mockReturnValue(CB_SW_PROXY_BYTECODE);
    const result = await willPaymasterSponsor({ chainId, client, entrypoint, userOp });
    expect(result).toEqual({ isValid: true });
  });
});
