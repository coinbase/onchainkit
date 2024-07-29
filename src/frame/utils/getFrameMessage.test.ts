import type { Address } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { neynarBulkUserLookup } from '../../network/neynar/neynarBulkUserLookup';
import { neynarFrameValidation } from '../../network/neynar/neynarFrameValidation';
import type { FrameRequest } from '../types';
import { getFrameMessage } from './getFrameMessage';
import { getMockFrameRequest } from './getMockFrameRequest';

vi.mock('../../network/neynar/neynarBulkUserLookup', () => {
  return {
    neynarBulkUserLookup: vi.fn(),
  };
});

vi.mock(
  '../../network/neynar/neynarFrameValidation',
  async (importOriginal) => {
    return {
      ...(await importOriginal<
        typeof import('../../../network/neynar/neynarFrameValidation')
      >()),
      neynarFrameValidation: vi.fn(),
    };
  },
);

function mockNeynarResponse(
  action: {
    address?: Address;
    transaction?: {
      hash: string;
    };
  },
  interactor: {
    fid: number;
    verifications?: string[] | undefined;
  },
  lookupMock: Mock,
  frameValidationMock: Mock = vi.fn(),
) {
  const neynarResponse = {
    users: [
      {
        verifications: interactor?.verifications,
      },
    ],
  };
  lookupMock.mockResolvedValue(neynarResponse);

  frameValidationMock.mockResolvedValue({
    address: action?.address || null,
    interactor: {
      fid: interactor.fid,
      verified_accounts: interactor?.verifications,
    },
    transaction: action?.transaction || null,
    valid: true,
  });
}

describe('getFrameValidatedMessage', () => {
  it('should return undefined if the message is invalid', async () => {
    const result = await getFrameMessage({
      trustedData: { messageBytes: 'invalid' },
    } as FrameRequest);
    expect(result?.isValid).toEqual(false);
  });

  it('should consider invalid non-mock requests as invalid, even if mock requests are allowed', async () => {
    const result = await getFrameMessage(
      {
        trustedData: { messageBytes: 'invalid' },
      } as FrameRequest,
      { allowFramegear: true },
    );
    expect(result?.isValid).toEqual(false);
    expect(result.message).toBeUndefined();
  });

  it('should consider mock messages valid, if allowed', async () => {
    const result = await getFrameMessage(
      getMockFrameRequest({
        untrustedData: {
          buttonIndex: 1,
          castId: {
            fid: 0,
            hash: '0xthisisnotreal',
          },
          inputText: '',
          fid: 0,
          network: 0,
          messageHash: '0xthisisnotreal',
          state: '',
          timestamp: 0,
          url: 'https://localhost:3000',
        },
        trustedData: {
          messageBytes: '0xthisisnotreal',
        },
      }),
      { allowFramegear: true },
    );
    expect(result?.isValid).toEqual(true);
    expect(result.message?.button).toEqual(1);
  });

  it('should consider mock messages invalid, if not allowed (default)', async () => {
    const result = await getFrameMessage(
      getMockFrameRequest({
        untrustedData: {
          buttonIndex: 1,
          castId: {
            fid: 0,
            hash: '0xthisisnotreal',
          },
          inputText: '',
          fid: 0,
          network: 0,
          messageHash: '0xthisisnotreal',
          state: '',
          timestamp: 0,
          transactionId: undefined,
          url: 'https://localhost:3000',
        },
        trustedData: {
          messageBytes: '0xthisisnotreal',
        },
      }),
    );
    expect(result?.isValid).toEqual(false);
    expect(result.message).toBeUndefined();
  });

  it('should return the message if the message is valid', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    mockNeynarResponse(
      {},
      {
        fid,
        verifications: addresses,
      },
      neynarBulkUserLookup as Mock,
      neynarFrameValidation as Mock,
    );
    const fakeFrameData = {
      trustedData: {},
    };
    const result = await getFrameMessage(fakeFrameData as FrameRequest);
    expect(result?.message?.interactor.fid).toEqual(fid);
  });

  it('should return the address and transaction if they exist', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    mockNeynarResponse(
      {
        address: 'address' as Address,
        transaction: {
          hash: 'transaction',
        },
      },
      {
        fid,
        verifications: addresses,
      },
      neynarBulkUserLookup as Mock,
      neynarFrameValidation as Mock,
    );
    const fakeFrameData = {
      trustedData: {},
    };
    const result = await getFrameMessage(fakeFrameData as FrameRequest);
    expect(result?.message?.address).toEqual('address');
    expect(result?.message?.transaction).toEqual({
      hash: 'transaction',
    });
  });
});
