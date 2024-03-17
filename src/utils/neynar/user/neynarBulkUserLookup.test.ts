import { FetchError } from '../exceptions/FetchError';
import { neynarBulkUserLookup } from './neynarBulkUserLookup';

describe('neynar user functions', () => {
  let fetchMock = jest.fn();
  let status = 200;

  beforeEach(() => {
    status = 200;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status,
        json: fetchMock,
      }),
    ) as jest.Mock;
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
