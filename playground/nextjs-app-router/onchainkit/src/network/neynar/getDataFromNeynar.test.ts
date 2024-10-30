import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { version } from '../../version';
import { getDataFromNeynar } from './getDataFromNeynar';
import { NEYNAR_DEFAULT_API_KEY } from './neynarFrameValidation';

describe('getDataFromNeynar', () => {
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

  it('should call fetch correctly', async () => {
    const apiUrlMock = 'https://api.neynar.com/v2/amazing-api';
    await getDataFromNeynar(apiUrlMock);
    expect(global.fetch).toHaveBeenCalledWith(apiUrlMock, {
      method: 'GET',
      url: apiUrlMock,
      headers: {
        accept: 'application/json',
        api_key: NEYNAR_DEFAULT_API_KEY,
        'content-type': 'application/json',
        onchainkit_version: version,
      },
    });
  });
});
