import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDisconnect } from 'wagmi';
import type { Connector } from 'wagmi';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';

vi.mock('wagmi', () => ({
  useDisconnect: vi.fn(),
}));

describe('WalletDropdownDisconnect', () => {
  // @ts-expect-error - will mock rest of connector later
  const fakeConnectors: Connector[] = [{ id: 'mockConnector' }];
  const mockUseDisconnect = useDisconnect as Mock;
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
      connectors: fakeConnectors,
    });
  });

  it('renders correctly with default props', () => {
    render(<WalletDropdownDisconnect />);
    expect(
      screen.getByText('Disconnect', { selector: 'span' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders correctly with custom text', () => {
    render(<WalletDropdownDisconnect text="Log Out" />);
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('calls disconnect on button click', () => {
    render(<WalletDropdownDisconnect />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    mockUseDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
      connectors: fakeConnectors,
    });
    expect(mockDisconnect).toHaveBeenCalledWith({
      connector: fakeConnectors[0],
    });
  });
});
