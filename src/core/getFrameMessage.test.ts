import { mockNeynarResponse } from './mock';
import { getFrameMessage } from './getFrameMessage';
import { neynarBulkUserLookup } from '../utils/neynar/user/neynarUserFunctions';
import { FrameRequest } from './types';
import { neynarFrameValidation } from '../utils/neynar/frame/neynarFrameFunctions';
import { getDebugFrameRequest } from './getDebugFrameRequest';

jest.mock('../utils/neynar/user/neynarUserFunctions', () => {
  return {
    neynarBulkUserLookup: jest.fn(),
  };
});

jest.mock('../utils/neynar/frame/neynarFrameFunctions', () => {
  return {
    neynarFrameValidation: jest.fn(),
  };
});

describe('getFrameValidatedMessage', () => {
  it('should return undefined if the message is invalid', async () => {
    const result = await getFrameMessage({
      trustedData: { messageBytes: 'invalid' },
    } as FrameRequest);
    expect(result?.isValid).toEqual(false);
  });

  it('should consider debug messages valid, if allowed', async () => {
    const result = await getFrameMessage(
      getDebugFrameRequest({
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
          timestamp: 0,
          url: 'https://localhost:3000',
        },
        trustedData: {
          messageBytes: '0xthisisnotreal',
        },
      }),
      { allowDebug: true },
    );
    expect(result?.isValid).toEqual(true);
    expect(result.message?.button).toEqual(1);
  });

  it('should consider debug messages invalid, if not allowed (default)', async () => {
    const result = await getFrameMessage(
      getDebugFrameRequest({
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
          timestamp: 0,
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
      fid,
      addresses,
      neynarBulkUserLookup as jest.Mock,
      neynarFrameValidation as jest.Mock,
    );
    const fakeFrameData = {
      trustedData: {},
    };
    const result = await getFrameMessage(fakeFrameData as FrameRequest);
    expect(result?.message?.interactor.fid).toEqual(fid);
  });
});
