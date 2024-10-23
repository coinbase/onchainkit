import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnchainKit } from '../../../useOnchainKit';
import { useNftContext } from '../NftProvider';
import { NftCreator } from './NftCreator';

vi.mock('../../../useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));
vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));

vi.mock('../../../identity', async () => ({
  ...(await vi.importActual('../../../identity')),
  Identity: ({ className }) => <div className={className}>Identity</div>,
}));

describe('NftCreator', () => {
  beforeEach(() => {
    (useOnchainKit as Mock).mockReturnValue({ schemaId: 'test-schema-id' });
    (useNftContext as Mock).mockReturnValue({ creatorAddress: '0x123' });
  });

  it('should render null when creatorAddress is not provided', () => {
    (useNftContext as Mock).mockReturnValue({ creatorAddress: null });

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
