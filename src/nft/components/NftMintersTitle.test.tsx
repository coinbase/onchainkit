import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useRecentMints } from '../hooks/useRecentMints';
import { useOnchainKit } from '../../useOnchainKit';
import { useNftMintContext } from './NftMintProvider';
import { useNftViewContext } from './NftViewProvider';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';
import { NftMintersTitle } from './NftMintersTitle';

vi.mock('../hooks/useRecentMints');
vi.mock('../../useOnchainKit');
vi.mock('./NftMintProvider');
vi.mock('./NftViewProvider');

vi.mock('../../identity', async () => ({
  ...(await vi.importActual('../../identity')),
  Identity: ({ className, children }) => (
    <div className={className}>{children}</div>
  ),
  Avatar: () => <div>Avatar</div>,
  Name: () => <div>Name</div>,
}));

describe('NftMintersTitle', () => {
  const mockUseRecentMints = useRecentMints as Mock;
  const mockUseOnchainKit = useOnchainKit as Mock;
  const mockUseNftMintContext = useNftMintContext as Mock;
  const mockUseNftViewContext = useNftViewContext as Mock;

  beforeEach(() => {
    mockUseOnchainKit.mockReturnValue({
      schemaId: 'test-schema',
      chain: 'test-chain',
    });
    mockUseNftMintContext.mockReturnValue({
      contractAddress: 'test-address',
      totalOwners: 5,
    });
    mockUseNftViewContext.mockReturnValue({ contractType: 'test-type' });
  });

  it('should render null if recent mints are not successful', () => {
    mockUseRecentMints.mockReturnValue({ isSuccess: false, data: [] });

    const { container } = render(<NftMintersTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if recent mints data is empty', () => {
    mockUseRecentMints.mockReturnValue({ isSuccess: true, data: [] });

    const { container } = render(<NftMintersTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the recent minters', () => {
    mockUseRecentMints.mockReturnValue({
      isSuccess: true,
      data: [{ to: 'address-1' }, { to: 'address-2' }],
    });

    const { getByText } = render(<NftMintersTitle className="test-class" />);

    expect(getByText('Minted by')).toBeInTheDocument();
    expect(getByText('and 5 others')).toBeInTheDocument();
  });

  it('should render the correct number of avatars', () => {
    mockUseRecentMints.mockReturnValue({
      isSuccess: true,
      data: [{ to: 'address-1' }, { to: 'address-2' }],
    });

    const { getAllByText } = render(<NftMintersTitle className="test-class" />);
    expect(getAllByText('Avatar')).toHaveLength(2);
  });
});
