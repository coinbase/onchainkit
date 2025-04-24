import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { NFTMintDate } from './NFTMintDate';

vi.mock('@/nft/components/NFTProvider');

describe('NFTMintDate', () => {
  const mockUseNFTContext = useNFTContext as Mock;

  beforeEach(() => {
    mockUseNFTContext.mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
      mintDate: new Date('2024-01-01T00:00:00Z'),
    });
  });

  it('should render null if formattedDate is null', () => {
    mockUseNFTContext.mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
    });

    const { container } = render(<NFTMintDate />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the mint date correctly', () => {
    const { getByText } = render(<NFTMintDate />);

    expect(getByText('Mint date')).toBeInTheDocument();
    expect(getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('should render a custom label', () => {
    const { getByText } = render(<NFTMintDate label="Custom Label" />);

    expect(getByText('Custom Label')).toBeInTheDocument();
    expect(getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('should apply a custom className', () => {
    const { container } = render(<NFTMintDate className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
