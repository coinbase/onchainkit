import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useOnchainKit } from '../../useOnchainKit';
import { useMintDate } from '../hooks/useMintDate';
import { useNftViewContext } from './NftViewProvider';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';
import { NftMintDate } from './NftMintDate';

vi.mock('../../useOnchainKit');
vi.mock('../hooks/useMintDate');
vi.mock('./NftViewProvider');

describe('NftMintDate', () => {
  const mockUseOnchainKit = useOnchainKit as Mock;
  const mockUseMintDate = useMintDate as Mock;
  const mockUseNftViewContext = useNftViewContext as Mock;

  beforeEach(() => {
    mockUseOnchainKit.mockReturnValue({ chain: 'test-chain' });
    mockUseNftViewContext.mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
    });
  });

  it('should render null if mintDate is not successful', () => {
    mockUseMintDate.mockReturnValue({ isSuccess: false, data: null });

    const { container } = render(<NftMintDate />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if formattedDate is null', () => {
    mockUseMintDate.mockReturnValue({ isSuccess: true, data: null });

    const { container } = render(<NftMintDate />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the mint date correctly', () => {
    const mockDate = new Date('2023-01-01T00:00:00Z');
    mockUseMintDate.mockReturnValue({ isSuccess: true, data: mockDate });

    const { getByText } = render(<NftMintDate />);

    expect(getByText('Mint date')).toBeInTheDocument();
    expect(getByText('Jan 1, 2023')).toBeInTheDocument();
  });

  it('should render a custom label', () => {
    const mockDate = new Date('2023-01-01T00:00:00Z');
    mockUseMintDate.mockReturnValue({ isSuccess: true, data: mockDate });

    const { getByText } = render(<NftMintDate label="Custom Label" />);

    expect(getByText('Custom Label')).toBeInTheDocument();
    expect(getByText('Jan 1, 2023')).toBeInTheDocument();
  });

  it('should apply a custom className', () => {
    const mockDate = new Date('2023-01-01T00:00:00Z');
    mockUseMintDate.mockReturnValue({ isSuccess: true, data: mockDate });

    const { container } = render(<NftMintDate className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
