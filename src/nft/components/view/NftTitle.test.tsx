import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useNftContext } from '../NftProvider';
import { NftTitle } from './NftTitle';

vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));

describe('NftTitle', () => {
  it('should render the NFT title when name is provided', () => {
    (useNftContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { getByText } = render(<NftTitle />);
    expect(getByText('Test NFT')).toBeInTheDocument();
  });

  it('should not render anything when name is not provided', () => {
    (useNftContext as Mock).mockReturnValue({ name: '' });

    const { container } = render(<NftTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply additional class names when provided', () => {
    (useNftContext as Mock).mockReturnValue({ name: 'Test NFT' });

    const { container } = render(<NftTitle className="extra-class" />);
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
