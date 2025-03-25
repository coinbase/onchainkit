import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';
import { AppchainBridgeSuccess } from './AppchainBridgeSuccess';

vi.mock('./AppchainBridgeProvider', () => ({
  useAppchainBridgeContext: vi.fn(),
}));

describe('AppchainBridgeSuccess', () => {
  const mockHandleOpenExplorer = vi.fn();
  const mockHandleResetState = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    (useAppchainBridgeContext as Mock).mockReturnValue({
      handleOpenExplorer: mockHandleOpenExplorer,
      handleResetState: mockHandleResetState,
    });
  });

  it('renders with default props', () => {
    render(<AppchainBridgeSuccess />);

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('View Transaction')).toBeInTheDocument();
    expect(screen.getByText('Back to bridge')).toBeInTheDocument();
  });

  it('renders with custom title and button labels', () => {
    render(
      <AppchainBridgeSuccess
        title="Custom Success"
        primaryButtonLabel="View Details"
        secondaryButtonLabel="Return"
      />,
    );

    expect(screen.getByText('Custom Success')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Return')).toBeInTheDocument();
  });

  it('calls handleOpenExplorer when primary button is clicked', () => {
    render(<AppchainBridgeSuccess />);

    const primaryButton = screen.getByText('View Transaction');
    fireEvent.click(primaryButton);

    expect(mockHandleOpenExplorer).toHaveBeenCalledTimes(1);
  });

  it('calls handleResetState when secondary button is clicked', () => {
    render(<AppchainBridgeSuccess />);

    const secondaryButton = screen.getByText('Back to bridge');
    fireEvent.click(secondaryButton);

    expect(mockHandleResetState).toHaveBeenCalledTimes(1);
  });

  it('applies correct button styles', () => {
    render(<AppchainBridgeSuccess />);

    const primaryButton = screen
      .getByText('View Transaction')
      .closest('button');
    const secondaryButton = screen
      .getByText('Back to bridge')
      .closest('button');

    expect(primaryButton).toHaveClass('w-full', 'rounded-xl');
    expect(secondaryButton).toHaveClass('w-full', 'rounded-xl');
  });
});
