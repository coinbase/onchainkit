import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useAccount } from 'wagmi';
import useBreakpoints from '../../useBreakpoints';
import { WalletDropdown } from './WalletDropdown';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../useBreakpoints', () => ({
  default: vi.fn(),
}));

const useAccountMock = useAccount as vi.Mock;
const useBreakpointsMock = useBreakpoints as vi.Mock;

describe('WalletDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render anything if address is not available', () => {
    useAccountMock.mockReturnValue({ address: null });
    useBreakpointsMock.mockReturnValue('sm');

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('does not render anything if breakpoint is not defined', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue(null);

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders WalletBottomSheet when breakpoint is "sm"', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue('sm');

    render(<WalletDropdown className="bottom-sheet">Content</WalletDropdown>);

    const bottomSheet = screen.getByTestId('ockWalletBottomSheet');

    expect(bottomSheet).toBeInTheDocument();
    expect(bottomSheet).toHaveClass('bottom-sheet');
  });

  it('renders WalletDropdown when breakpoint is not "sm"', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue('md');

    render(<WalletDropdown className="dropdown">Content</WalletDropdown>);

    const dropdown = screen.getByTestId('ockWalletDropdown');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass('dropdown');
  });
});
