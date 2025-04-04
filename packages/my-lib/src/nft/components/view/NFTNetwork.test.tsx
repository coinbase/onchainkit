import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useChainId } from 'wagmi';
import { NFTNetwork } from './NFTNetwork';

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
}));

describe('NFTNetwork', () => {
  it('should render null if chain is not available', () => {
    (useChainId as Mock).mockReturnValue(undefined);
    const { container } = render(<NFTNetwork />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if chain Id is not in networkMap', () => {
    (useChainId as Mock).mockReturnValue(1);
    const { container } = render(<NFTNetwork />);
    expect(container.firstChild).toBeNull();
  });

  it('should render correctly with valid chain name', () => {
    (useChainId as Mock).mockReturnValue(8453);
    const { getByText, getByRole } = render(<NFTNetwork />);
    expect(getByText('Network')).toBeInTheDocument();
    expect(getByText('Base')).toBeInTheDocument();
    expect(getByRole('img')).toBeInTheDocument(); // assuming baseSvg includes role image
  });

  it('should apply custom className', () => {
    (useChainId as Mock).mockReturnValue(8453);
    const { container } = render(<NFTNetwork className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render with custom label', () => {
    (useChainId as Mock).mockReturnValue(8453);
    const { getByText } = render(<NFTNetwork label="Custom Label" />);
    expect(getByText('Custom Label')).toBeInTheDocument();
  });
});
