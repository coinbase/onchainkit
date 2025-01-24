import { renderHook } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider';
import { useNFTData } from './useNFTData';
import { useTokenDetails } from './useTokenDetails';

vi.mock('./useTokenDetails');
vi.mock('../components/NFTLifecycleProvider');

describe('useNFTData', () => {
  const mockUpdateLifecycleStatus = vi.fn();
  const mockUseTokenDetails = useTokenDetails as Mock;
  const mockUseNFTLifecycleContext = useNFTLifecycleContext as Mock;

  beforeEach(() => {
    mockUseNFTLifecycleContext.mockReturnValue({
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return NFT data when token details are available', () => {
    const tokenDetails = {
      name: 'Test NFT',
      description: 'Test Description',
      imageUrl: 'http://example.com/image.png',
      animationUrl: 'http://example.com/animation.mp4',
      mimeType: 'image/png',
      ownerAddress: '0x1234567890abcdef1234567890abcdef12345678',
      lastSoldPrice: 1.5,
      contractType: 'ERC721',
    };

    mockUseTokenDetails.mockReturnValue({ data: tokenDetails });

    const { result } = renderHook(() =>
      useNFTData('0x1234567890abcdef1234567890abcdef12345678', '1'),
    );

    expect(result.current).toEqual(tokenDetails);
  });

  it('should return NFT error when token details are an error', () => {
    const tokenError = {
      code: 'code',
      error: 'error',
      message: 'message',
    };

    mockUseTokenDetails.mockReturnValue({ error: tokenError });

    const { result } = renderHook(() =>
      useNFTData('0x1234567890abcdef1234567890abcdef12345678', '1'),
    );

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: expect.objectContaining({
        message: tokenError.message,
      }),
    });

    expect(result.current).toEqual(
      expect.objectContaining({
        name: undefined,
        description: undefined,
      }),
    );
  });
});
