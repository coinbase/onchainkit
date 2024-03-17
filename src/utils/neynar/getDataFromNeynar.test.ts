import { version } from '../../version';
import { NEYNAR_DEFAULT_API_KEY } from './frame/neynarFrameValidation';
import { getDataFromNeynar } from './getDataFromNeynar';

describe('getDataFromNeynar', () => {
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

  it('should call fetch correctly', async () => {
    const apiURLMock = 'https://api.neynar.com/v2/amazing-api';
    await getDataFromNeynar(apiURLMock);
    expect(global.fetch).toHaveBeenCalledWith(apiURLMock, {
      method: 'GET',
      url: apiURLMock,
      headers: {
        accept: 'application/json',
        api_key: NEYNAR_DEFAULT_API_KEY,
        'content-type': 'application/json',
        onchainkit_version: version,
      },
    });
  });
});
