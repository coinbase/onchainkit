import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { useOnchainKit } from '@/useOnchainKit';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { NFTCreator } from './NFTCreator';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));
vi.mock('@/nft/components/NFTProvider', () => ({
  useNFTContext: vi.fn(),
}));

vi.mock('@/identity', async () => ({
  ...(await vi.importActual('@/identity')),
  Identity: ({ className }: { className: string }) => (
    <div className={className}>Identity</div>
  ),
}));

describe('NFTCreator', () => {
  beforeEach(() => {
    (useOnchainKit as Mock).mockReturnValue({ schemaId: 'test-schema-id' });
    (useNFTContext as Mock).mockReturnValue({ creatorAddress: '0x123' });
  });

  it('should render null when creatorAddress is not provided', () => {
    (useNFTContext as Mock).mockReturnValue({ creatorAddress: null });

    const { container } = render(<NFTCreator />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the Identity component when creatorAddress is provided', () => {
    const { getByText } = render(<NFTCreator />);
    expect(getByText('Identity')).toBeInTheDocument();
  });

  it('should apply the provided className', () => {
    const { container } = render(<NFTCreator className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
