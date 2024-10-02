import { getTokenDetails } from './getTokenDetails';
import { GET_TOKEN_DETAILS_URI } from '../constants';
import {
  type Mock,
  describe,
  beforeEach,
  afterEach,
  expect,
  it,
  vi,
} from 'vitest';

global.fetch = vi.fn();

describe('getTokenDetails', () => {
  const contractAddress = '0x123';
  const tokenId = '1';
  const chainId = 4;
  const userAddress = '0x456';
  const mockResponse = {
    id: '1',
    name: 'Mock Collectible',
    description: 'A mock collectible for testing',
  };

  beforeEach(() => {
    (fetch as Mock).mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch token details with required parameters', async () => {
    const result = await getTokenDetails({ contractAddress, tokenId, chainId });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(GET_TOKEN_DETAILS_URI),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should include optional parameters if provided', async () => {
    const result = await getTokenDetails({
      contractAddress,
      tokenId,
      includeFloorPrice: true,
      chainId,
      userAddress,
    });

    const expectedParams = new URLSearchParams({
      contractAddress,
      tokenId,
      chainId: chainId.toString(),
      includeFloorPrice: 'true',
      userAddress,
    }).toString();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(expectedParams),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle missing optional parameters', async () => {
    const result = await getTokenDetails({ contractAddress, chainId });

    const expectedParams = new URLSearchParams({
      contractAddress,
      tokenId: '1',
      chainId: chainId.toString(),
      includeFloorPrice: 'false',
    }).toString();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(expectedParams),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(result).toEqual(mockResponse);
  });
});
