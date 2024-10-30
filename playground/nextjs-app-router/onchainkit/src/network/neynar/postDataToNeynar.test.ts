import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { version } from '../../version';
import { NEYNAR_DEFAULT_API_KEY } from './neynarFrameValidation';
import { postDataToNeynar } from './postDataToNeynar';

describe('postDataToNeynar', () => {
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
    const mockUrl = 'https://api.neynar.com/v2/amazing-api';
    const mockData = {};
    await postDataToNeynar(mockUrl, NEYNAR_DEFAULT_API_KEY, mockData);
    expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
      method: 'POST',
      url: mockUrl,
      headers: {
        accept: 'application/json',
        api_key: NEYNAR_DEFAULT_API_KEY,
        'content-type': 'application/json',
        onchainkit_version: version,
      },
      body: JSON.stringify(mockData),
    });
  });
});
