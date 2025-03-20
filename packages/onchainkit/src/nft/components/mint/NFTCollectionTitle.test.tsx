import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { render } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { NFTCollectionTitle } from './NFTCollectionTitle';

vi.mock('@/nft/components/NFTProvider', () => ({
  useNFTContext: vi.fn(),
}));

describe('NFTCollectionTitle', () => {
  it('should render the collection title when name is provided', () => {
    (useNFTContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { getByText } = render(<NFTCollectionTitle />);
    expect(getByText('Test NFT')).toBeInTheDocument();
  });

  it('should not render when name is not provided', () => {
    (useNFTContext as Mock).mockReturnValue({ name: '' });

    const { container } = render(<NFTCollectionTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply additional class names when provided', () => {
    (useNFTContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { container } = render(
      <NFTCollectionTitle className="extra-class" />,
    );
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
