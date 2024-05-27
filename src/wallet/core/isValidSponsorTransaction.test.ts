import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import { baseSepolia } from 'viem/chains';
import { isValidSponsorTransaction } from './isValidSponsorTransaction';
import type { UserOperation } from 'permissionless';

describe('isValidSponsorTransaction', () => {
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
    const result = await isValidSponsorTransaction({ chainId, entrypoint, userOp });
    expect(result).toBe(false);
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
    const result = await isValidSponsorTransaction({ chainId, entrypoint, userOp });
    expect(result).toBe(false);
  });

  it('should return true if the chainId is baseSepolia.id and the entrypoint is ENTRYPOINT_ADDRESS_V06', async () => {
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
    const result = await isValidSponsorTransaction({ chainId, entrypoint, userOp });
    expect(result).toBe(true);
  });
});
