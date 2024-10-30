import { renderHook } from '@testing-library/react';
import { useMintData } from './useMintData';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider';
import { useMintDetails } from './useMintDetails';
import { useAccount } from 'wagmi';
import { isNFTError } from '../utils/isNFTError';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

vi.mock('../components/NFTLifecycleProvider');
vi.mock('./useMintDetails');
vi.mock('wagmi');
vi.mock('../utils/isNFTError');

describe('useMintData', () => {
  const mockUpdateLifecycleStatus = vi.fn();
  const mockUseNFTLifecycleContext = useNFTLifecycleContext as Mock;
  const mockUseMintDetails = useMintDetails as Mock;
  const mockUseAccount = useAccount as Mock;
  const mockIsNFTError = isNFTError as unknown as Mock;

  beforeEach(() => {
    mockUseNFTLifecycleContext.mockReturnValue({
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
    mockUseAccount.mockReturnValue({ address: '0x123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return NFT data when mintData is not an error', () => {
    const mintData = {
      name: 'NFT Name',
      description: 'NFT Description',
      imageUrl: 'http://example.com/image.png',
      animationUrl: 'http://example.com/animation.mp4',
      mimeType: 'image/png',
      maxMintsPerWallet: 5,
      price: '1 ETH',
      mintFee: '0.01 ETH',
      isEligibleToMint: true,
      creatorAddress: '0xcreator',
      totalOwners: 10,
      network: 'Ethereum',
    };
    mockUseMintDetails.mockReturnValue({ data: mintData });
    mockIsNFTError.mockReturnValue(false);

    const { result } = renderHook(() => useMintData('0xcontract', '1'));

    expect(result.current).toEqual({
      contractAddress: '0xcontract',
      tokenId: '1',
      ...mintData,
    });
  });

  it('should return NFTError and update lifecycle status when mintData is an error', () => {
    const mintError = {
      code: 400,
      error: 'Bad Request',
      message: 'Invalid token ID',
    };
    mockUseMintDetails.mockReturnValue({ data: mintError });
    mockIsNFTError.mockReturnValue(true);

    const { result } = renderHook(() => useMintData('0xcontract', '1'));

    expect(result.current).toEqual(mintError);
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: mintError.code,
        error: mintError.error,
        message: mintError.message,
      },
    });
  });
});
