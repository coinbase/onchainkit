import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useOnchainKit } from '../../../useOnchainKit';
import { NftNetwork } from './NftNetwork';

vi.mock('../../../useOnchainKit');

describe('NftNetwork', () => {
  it('should render null if chain is not available', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: null });
    const { container } = render(<NftNetwork />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if chain name is not in networkMap', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: { name: 'Unknown' } });
    const { container } = render(<NftNetwork />);
    expect(container.firstChild).toBeNull();
  });

  it('should render correctly with valid chain name', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: { name: 'Base' } });
    const { getByText, getByRole } = render(<NftNetwork />);
    expect(getByText('Network')).toBeInTheDocument();
    expect(getByText('Base')).toBeInTheDocument();
    expect(getByRole('img')).toBeInTheDocument(); // assuming baseSvg includes role image
  });

  it('should apply custom className', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: { name: 'Base' } });
    const { container } = render(<NftNetwork className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render with custom label', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: { name: 'Base' } });
    const { getByText } = render(<NftNetwork label="Custom Label" />);
    expect(getByText('Custom Label')).toBeInTheDocument();
  });
});
