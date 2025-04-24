import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { NFTMinters } from './NFTMinters';

vi.mock('@/nft/components/NFTProvider');

vi.mock('@/identity', async () => ({
  ...(await vi.importActual('@/identity')),
  Identity: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => <div className={className}>{children}</div>,
  Avatar: () => <div>Avatar</div>,
  Name: () => <div>Name</div>,
}));

describe('NFTMinters', () => {
  const mockUseNFTContext = useNFTContext as Mock;

  beforeEach(() => {
    mockUseNFTContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
      recentOwners: ['0x123', '0x456'],
    });
  });

  it('should render null if recentOwners is undefined', () => {
    mockUseNFTContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
    });

    const { container } = render(<NFTMinters />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if recentOwners has no owners', () => {
    mockUseNFTContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
      recentOwners: [],
    });

    const { container } = render(<NFTMinters />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render total owners if it is not available', () => {
    mockUseNFTContext.mockReturnValue({
      contractAddress: 'test-address',
      recentOwners: ['0x123', '0x456'],
    });

    const { queryByText } = render(<NFTMinters />);
    expect(queryByText('and')).toBeNull();
  });

  it('should render the recent minters', () => {
    const { getByText } = render(<NFTMinters />);

    expect(getByText('Minted by')).toBeInTheDocument();
    expect(getByText('and 5 others')).toBeInTheDocument();
  });

  it('should render the correct number of avatars', () => {
    const { getAllByText } = render(<NFTMinters className="test-class" />);
    expect(getAllByText('Avatar')).toHaveLength(2);
  });
});
