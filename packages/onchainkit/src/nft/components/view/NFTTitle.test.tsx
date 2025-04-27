import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { render } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { NFTTitle } from './NFTTitle';

vi.mock('@/nft/components/NFTProvider', () => ({
  useNFTContext: vi.fn(),
}));

describe('NFTTitle', () => {
  it('should render the NFT title when name is provided', () => {
    (useNFTContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { getByText } = render(<NFTTitle />);
    expect(getByText('Test NFT')).toBeInTheDocument();
  });

  it('should not render anything when name is not provided', () => {
    (useNFTContext as Mock).mockReturnValue({ name: '' });

    const { container } = render(<NFTTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply additional class names when provided', () => {
    (useNFTContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { container } = render(<NFTTitle className="extra-class" />);
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
