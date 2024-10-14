import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useNftMintContext } from '../NftMintProvider';
import { useNftContext } from '../NftProvider';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';
import { NftMintersTitle } from './NftMintersTitle';

vi.mock('../NftMintProvider');
vi.mock('../NftProvider');

vi.mock('../../../identity', async () => ({
  ...(await vi.importActual('../../../identity')),
  Identity: ({ className, children }) => (
    <div className={className}>{children}</div>
  ),
  Avatar: () => <div>Avatar</div>,
  Name: () => <div>Name</div>,
}));

describe('NftMintersTitle', () => {
  const mockUseNftMintContext = useNftMintContext as Mock;
  const mockUseNftContext = useNftContext as Mock;

  beforeEach(() => {
    mockUseNftMintContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
      recentOwners: ['0x123', '0x456']
    });
    mockUseNftContext.mockReturnValue({ contractType: 'test-type' });
  });

  it('should render null if recentOwners is undefined', () => {
    mockUseNftMintContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
    });

    const { container } = render(<NftMintersTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if recentOwners has no owners', () => {
    mockUseNftMintContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
      recentOwners: []
    });

    const { container } = render(<NftMintersTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the recent minters', () => {
    const { getByText } = render(<NftMintersTitle className="test-class" />);

    expect(getByText('Minted by')).toBeInTheDocument();
    expect(getByText('and 5 others')).toBeInTheDocument();
  });

  it('should render the correct number of avatars', () => {
    const { getAllByText } = render(<NftMintersTitle className="test-class" />);
    expect(getAllByText('Avatar')).toHaveLength(2);
  });
});
