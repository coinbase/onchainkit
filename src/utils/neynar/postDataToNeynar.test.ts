import { version } from '../../version';
import { NEYNAR_DEFAULT_API_KEY } from './frame/neynarFrameValidation';
import { postDataToNeynar } from './postDataToNeynar';

describe('postDataToNeynar', () => {
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
    const mockURL = 'https://api.neynar.com/v2/amazing-api';
    const mockData = {};
    await postDataToNeynar(mockURL, NEYNAR_DEFAULT_API_KEY, mockData);
    expect(global.fetch).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      url: mockURL,
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
