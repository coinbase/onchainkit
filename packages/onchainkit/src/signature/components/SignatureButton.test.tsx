import { fireEvent, render, screen } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { SignatureButton } from './SignatureButton';
import { useSignatureContext } from './SignatureProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConnectors: vi.fn(() => ({ connectors: [{ id: 'mockConnector' }] })),
}));

vi.mock('./SignatureProvider', () => ({
  useSignatureContext: vi.fn(),
}));

describe('SignatureButton', () => {
  const mockHandleSign = vi.fn();

  beforeEach(() => {
    (useConnect as Mock).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'idle',
    });
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'init',
      },
      handleSign: mockHandleSign,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render ConnectWallet when no address is connected', () => {
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      status: 'disconnected',
    });

    render(<SignatureButton />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('should render connect label when passed in', () => {
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      status: 'disconnected',
    });

    render(<SignatureButton connectLabel="Sign in please" />);
    expect(screen.getByText('Sign in please')).toBeInTheDocument();
  });

  it('should render sign button when address is connected', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });

    render(<SignatureButton label="Sign Message" />);
    expect(screen.getByText('Sign Message')).toBeInTheDocument();
  });

  it('should render pending message when pending', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'pending',
      },
    });

    render(<SignatureButton label="Sign Message" />);
    expect(screen.getByText('Signing...')).toBeInTheDocument();
  });

  it('should render pending label when pending', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'pending',
      },
    });

    render(<SignatureButton label="Sign Message" pendingLabel="Pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should render error message when error', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'error',
      },
    });

    render(<SignatureButton label="Sign Message" />);
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('should render error label when error', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'error',
      },
    });

    render(
      <SignatureButton label="Sign Message" errorLabel="Try more things" />,
    );
    expect(screen.getByText('Try more things')).toBeInTheDocument();
  });

  it('should render success message when success', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'success',
      },
    });

    render(<SignatureButton label="Sign Message" />);
    expect(screen.getByText('Signed')).toBeInTheDocument();
  });

  it('should render success label when success', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'success',
      },
    });

    render(<SignatureButton label="Sign Message" successLabel="done" />);
    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('should call handleSign when clicked', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });

    render(<SignatureButton label="Sign Message" />);
    fireEvent.click(screen.getByText('Sign Message'));
    expect(mockHandleSign).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });

    render(<SignatureButton label="Sign Message" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should disable button when disabled prop is true', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });

    render(<SignatureButton label="Sign Message" disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should use default label when none provided', () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });

    render(<SignatureButton />);
    expect(screen.getByText('Sign')).toBeInTheDocument();
  });
});
