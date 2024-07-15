import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useConnect, useDisconnect } from 'wagmi';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';

vi.mock('wagmi', () => ({
  useConnect: vi.fn(),
  useDisconnect: vi.fn(),
}));

describe('WalletDropdownDisconnect', () => {
  const mockDisconnect = vi.fn();
  const mockConnect = {
    connectors: [{ id: 'mockConnector' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useConnect as vi.Mock).mockReturnValue(mockConnect);
    (useDisconnect as vi.Mock).mockReturnValue({ disconnect: mockDisconnect });
  });

  it('renders correctly with default props', () => {
    render(<WalletDropdownDisconnect />);
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
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
    expect(mockDisconnect).toHaveBeenCalledWith({
      connector: mockConnect.connectors[0],
    });
  });
});
