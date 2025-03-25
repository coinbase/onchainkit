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
import { useAccount } from 'wagmi';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider';
import { useMintData } from './useMintData';
import { useMintDetails } from './useMintDetails';

vi.mock('../components/NFTLifecycleProvider');
vi.mock('./useMintDetails');
vi.mock('wagmi');

describe('useMintData', () => {
  const mockUpdateLifecycleStatus = vi.fn();
  const mockUseNFTLifecycleContext = useNFTLifecycleContext as Mock;
  const mockUseMintDetails = useMintDetails as Mock;
  const mockUseAccount = useAccount as Mock;

  beforeEach(() => {
    mockUseNFTLifecycleContext.mockReturnValue({
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
    mockUseAccount.mockReturnValue({ address: '0x123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return NFT data with contractAddress and tokenId', () => {
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

    const { result } = renderHook(() => useMintData('0xcontract', '1'));

    expect(result.current).toEqual(mintData);
  });

  it('should return NFT data with contractAddress and no tokenId', () => {
    const mintData = {
      name: 'NFT Name',
      description: 'NFT Description',
      imageUrl: 'http://example.com/image.png',
      animationUrl: 'http://example.com/animation.mp4',
      mimeType: 'image/png',
      maxMintsPerWallet: 0,
      price: '1 ETH',
      mintFee: '0.01 ETH',
      isEligibleToMint: true,
      creatorAddress: '0xcreator',
      totalOwners: 10,
      network: 'Ethereum',
    };
    mockUseMintDetails.mockReturnValue({ data: mintData });

    const { result } = renderHook(() => useMintData('0xcontract'));

    expect(result.current).toEqual({
      ...mintData,
      maxMintsPerWallet: undefined,
    });
  });

  it('should return empty mintData and update lifecycle status when mintData is an error', async () => {
    const mintError = {
      code: 'code',
      error: 'error',
      message: 'message',
    };
    mockUseMintDetails.mockReturnValue({ error: mintError });

    const { result } = renderHook(() => useMintData('0xcontract', '1'));

    expect(result.current).toEqual(
      expect.objectContaining({
        name: undefined,
        description: undefined,
      }),
    );

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: expect.objectContaining({
        message: mintError.message,
      }),
    });
  });
});
