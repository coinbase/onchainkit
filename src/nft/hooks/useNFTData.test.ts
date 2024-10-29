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
import { useNFTData } from './useNFTData';
import { useTokenDetails } from './useTokenDetails';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider';
import { isNFTError } from '../utils/isNFTError';

vi.mock('./useTokenDetails');
vi.mock('../components/NFTLifecycleProvider');
vi.mock('../utils/isNFTError');

describe('useNFTData', () => {
  const mockUpdateLifecycleStatus = vi.fn();
  const mockUseTokenDetails = useTokenDetails as Mock;
  const mockUseNFTLifecycleContext = useNFTLifecycleContext as Mock;
  const mockIsNFTError = isNFTError as unknown as Mock;

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
    mockIsNFTError.mockReturnValue(false);

    const { result } = renderHook(() =>
      useNFTData('0x1234567890abcdef1234567890abcdef12345678', '1'),
    );

    expect(result.current).toEqual({
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      tokenId: '1',
      name: 'Test NFT',
      description: 'Test Description',
      imageUrl: 'http://example.com/image.png',
      animationUrl: 'http://example.com/animation.mp4',
      mimeType: 'image/png',
      ownerAddress: '0x1234567890abcdef1234567890abcdef12345678',
      lastSoldPrice: 1.5,
      contractType: 'ERC721',
    });
  });

  it('should return NFT error when token details are an error', () => {
    const tokenError = {
      code: '404',
      error: 'Not Found',
      message: 'Token not found',
    };

    mockUseTokenDetails.mockReturnValue({ data: tokenError });
    mockIsNFTError.mockReturnValue(true);

    const { result } = renderHook(() =>
      useNFTData('0x1234567890abcdef1234567890abcdef12345678', '1'),
    );

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: '404',
        error: 'Not Found',
        message: 'Token not found',
      },
    });

    expect(result.current).toEqual(tokenError);
  });

  it('should return undefined fields when token details are undefined', () => {
    mockUseTokenDetails.mockReturnValue({ data: undefined });
    mockIsNFTError.mockReturnValue(false);

    const { result } = renderHook(() =>
      useNFTData('0x1234567890abcdef1234567890abcdef12345678', '1'),
    );

    expect(result.current).toEqual({
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      tokenId: '1',
      name: undefined,
      description: undefined,
      imageUrl: undefined,
      animationUrl: undefined,
      mimeType: undefined,
      ownerAddress: undefined,
      lastSoldPrice: undefined,
      contractType: undefined,
    });
  });
});
