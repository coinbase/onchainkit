import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useNftViewContext } from './NftViewProvider';
import { type Mock, vi, describe, it, expect } from 'vitest';
import { NftTitle } from './NftTitle';

vi.mock('./NftViewProvider', () => ({
  useNftViewContext: vi.fn(),
}));

describe('NftTitle', () => {
  it('should render the NFT title when name is provided', () => {
    (useNftViewContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { getByText } = render(<NftTitle />);
    expect(getByText('Test NFT')).toBeInTheDocument();
  });

  it('should not render anything when name is not provided', () => {
    (useNftViewContext as Mock).mockReturnValue({ name: '' });

    const { container } = render(<NftTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply additional class names when provided', () => {
    (useNftViewContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { container } = render(<NftTitle className="extra-class" />);
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
