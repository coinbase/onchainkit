import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchError } from './FetchError';
import { neynarBulkUserLookup } from './neynarBulkUserLookup';

describe('neynar user functions', () => {
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
    fetchMock.mockResolvedValue({
      users: [{ fid: 1 }],
    });

    const resp = await neynarBulkUserLookup([1]);
    expect(resp?.users[0]?.fid).toEqual(1);
  });

  it('fails on a non-200', async () => {
    status = 401;
    const resp = neynarBulkUserLookup([1]);
    await expect(resp).rejects.toThrow(FetchError);
  });
});
