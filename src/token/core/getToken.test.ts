import { getTokens } from './getTokens';
import { sendRequest } from '../../network/request';
import { CDP_LIST_SWAP_ASSETS } from '../../network/definitions/swap';

jest.mock('../../network/request');

describe('getTokens', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of tokens', async () => {
    const mockResponse = {
      result: [
        {
          address: '0x123',
          chainId: 1,
          decimals: 18,
          image: 'https://example.com/token.png',
          name: 'Token 1',
          symbol: 'TKN1',
        },
        {
          address: '0x456',
          chainId: 1,
          decimals: 18,
          image: 'https://example.com/token.png',
          name: 'Token 2',
          symbol: 'TKN2',
        },
      ],
      error: null,
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const tokens = await getTokens();

    expect(tokens).toEqual([
      {
        address: '0x123',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 1',
        symbol: 'TKN1',
      },
      {
        address: '0x456',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 2',
        symbol: 'TKN2',
      },
    ]);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_LIST_SWAP_ASSETS, [
      { limit: '50', page: '1' },
    ]);
  });

  it('should accept options parameters', async () => {
    const mockResponse = {
      result: [
        {
          address: '0x123',
          chainId: 1,
          decimals: 18,
          image: 'https://example.com/token.png',
          name: 'Token 1',
          symbol: 'TKN1',
        },
      ],
      error: null,
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const tokens = await getTokens({ limit: '1', page: '1' });

    expect(tokens).toEqual([
      {
        address: '0x123',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 1',
        symbol: 'TKN1',
      },
    ]);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_LIST_SWAP_ASSETS, [
      { limit: '1', page: '1' },
    ]);
  });

  it('should return an error object if sendRequest returns an error', async () => {
    const mockError = new Error('Request failed');

    (sendRequest as jest.Mock).mockResolvedValue({
      result: null,
      error: {
        code: -1,
        message: 'Request failed',
        data: null,
      },
    });

    const error = await getTokens();

    expect(error).toEqual({
      code: -1,
      error: 'Request failed',
    });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_LIST_SWAP_ASSETS, [
      { limit: '50', page: '1' },
    ]);
  });

  it('should rethrow the error if an error occurs during token retrieval', async () => {
    const mockError = new Error(
      'getTokens: error retrieving tokens: Token retrieval failed',
    );

    (sendRequest as jest.Mock).mockRejectedValue(mockError);

    await expect(getTokens()).rejects.toThrow(
      'getTokens: error retrieving tokens: Token retrieval failed',
    );

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_LIST_SWAP_ASSETS, [
      { limit: '50', page: '1' },
    ]);
  });
});
