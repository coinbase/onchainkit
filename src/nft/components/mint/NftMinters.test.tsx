import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNftContext } from '../NftProvider';
import { NftMinters } from './NftMinters';

vi.mock('../NftProvider');

vi.mock('../../../identity', async () => ({
  ...(await vi.importActual('../../../identity')),
  Identity: ({ className, children }) => (
    <div className={className}>{children}</div>
  ),
  Avatar: () => <div>Avatar</div>,
  Name: () => <div>Name</div>,
}));

describe('NftMinters', () => {
  const mockUseNftContext = useNftContext as Mock;

  beforeEach(() => {
    mockUseNftContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
      recentOwners: ['0x123', '0x456'],
    });
  });

  it('should render null if recentOwners is undefined', () => {
    mockUseNftContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
    });

    const { container } = render(<NftMinters />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if recentOwners has no owners', () => {
    mockUseNftContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
      recentOwners: [],
    });

    const { container } = render(<NftMinters />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render total owners if it is not available', () => {
    mockUseNftContext.mockReturnValue({
      contractAddress: 'test-address',
      recentOwners: ['0x123', '0x456'],
    });

    const { queryByText } = render(<NftMinters />);
    expect(queryByText('and')).toBeNull();
  });

  it('should render the recent minters', () => {
    const { getByText } = render(<NftMinters />);

    expect(getByText('Minted by')).toBeInTheDocument();
    expect(getByText('and 5 others')).toBeInTheDocument();
  });

  it('should render the correct number of avatars', () => {
    const { getAllByText } = render(<NftMinters className="test-class" />);
    expect(getAllByText('Avatar')).toHaveLength(2);
  });
});
