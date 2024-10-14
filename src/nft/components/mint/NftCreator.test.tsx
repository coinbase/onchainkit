import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { NftCreator } from './NftCreator';
import { useOnchainKit } from '../../../useOnchainKit';
import { useNftMintContext } from '../NftMintProvider';
import { type Mock, beforeEach, vi, describe, it, expect } from 'vitest';

vi.mock('../../../useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));
vi.mock('../NftMintProvider', () => ({
  useNftMintContext: vi.fn(),
}));

vi.mock('../../../identity', async () => ({
  ...(await vi.importActual('../../../identity')),
  Identity: ({ className }) => <div className={className}>Identity</div>,
}));

describe('NftCreator', () => {
  beforeEach(() => {
    (useOnchainKit as Mock).mockReturnValue({ schemaId: 'test-schema-id' });
    (useNftMintContext as Mock).mockReturnValue({ creatorAddress: '0x123' });
  });

  it('should render null when creatorAddress is not provided', () => {
    (useNftMintContext as Mock).mockReturnValue({ creatorAddress: null });

    const { container } = render(<NftCreator />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the Identity component when creatorAddress is provided', () => {
    const { getByText } = render(<NftCreator />);
    expect(getByText('Identity')).toBeInTheDocument();
  });

  it('should pass the correct props to Identity component', () => {
    const { getByText } = render(<NftCreator />);
    const identityElement = getByText('Identity').closest('.space-x-2');
    expect(identityElement).toHaveClass('space-x-2 px-0');
  });

  it('should apply the provided className', () => {
    const { container } = render(<NftCreator className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
