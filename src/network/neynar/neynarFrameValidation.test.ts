import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchError } from './FetchError';
import { neynarFrameValidation } from './neynarFrameValidation';

describe('neynar frame functions', () => {
  const fetchMock = vi.fn();
  let status = 200;

  beforeEach(() => {
    status = 200;
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status,
        json: fetchMock,
      }),
    ) as Mock;
  });

  it('should return fetch response correctly', async () => {
    const mockedResponse = {
      valid: true,
      action: {
        tapped_button: {
          index: 1,
        },
        cast: {
          viewer_context: {
            recasted: true,
          },
        },
        input: {
          text: 'test',
        },
        interactor: {
          fid: 1234,
          verifications: ['0x00123'],
          viewer_context: {
            following: true,
            followed_by: true,
          },
        },
      },
    };
    fetchMock.mockResolvedValue(mockedResponse);
    const message = '0x00';
    const resp = await neynarFrameValidation(message);

    expect(resp?.valid).toEqual(true);
    expect(resp?.recasted).toEqual(
      mockedResponse.action.cast.viewer_context.recasted,
    );
    expect(resp?.button).toEqual(mockedResponse.action.tapped_button.index);
    expect(resp?.input).toEqual(mockedResponse.action.input.text);
    expect(resp?.interactor?.fid).toEqual(mockedResponse.action.interactor.fid);
    expect(resp?.interactor?.verified_accounts).toEqual(
      mockedResponse.action.interactor.verifications,
    );
    expect(resp?.following).toEqual(
      mockedResponse.action.interactor.viewer_context.following,
    );
  });

  it('fails on a non-200', async () => {
    status = 401;
    const resp = neynarFrameValidation('0x00');
    await expect(resp).rejects.toThrow(FetchError);
  });

  it('should return undefined on empty response', async () => {
    fetchMock.mockResolvedValue(undefined);
    const resp = await neynarFrameValidation('0x00');
    expect(resp).toBeUndefined();
  });
});
