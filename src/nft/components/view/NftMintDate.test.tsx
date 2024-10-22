import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNftContext } from '../NftProvider';
import { NftMintDate } from './NftMintDate';

vi.mock('../NftProvider');

describe('NftMintDate', () => {
  const mockUseNftContext = useNftContext as Mock;

  beforeEach(() => {
    mockUseNftContext.mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
      mintDate: new Date('2024-01-01T00:00:00Z'),
    });
  });

  it('should render null if formattedDate is null', () => {
    mockUseNftContext.mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
    });

    const { container } = render(<NftMintDate />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the mint date correctly', () => {
    const { getByText } = render(<NftMintDate />);

    expect(getByText('Mint date')).toBeInTheDocument();
    expect(getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('should render a custom label', () => {
    const { getByText } = render(<NftMintDate label="Custom Label" />);

    expect(getByText('Custom Label')).toBeInTheDocument();
    expect(getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('should apply a custom className', () => {
    const { container } = render(<NftMintDate className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
