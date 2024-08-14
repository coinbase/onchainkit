import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useAccount } from 'wagmi';
import useBreakpoints from '../../useBreakpoints';
import { WalletMenu } from './WalletMenu';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../useBreakpoints', () => ({
  default: vi.fn(),
}));

const useAccountMock = useAccount as vi.Mock;
const useBreakpointsMock = useBreakpoints as vi.Mock;

describe('WalletMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render anything if address is not available', () => {
    useAccountMock.mockReturnValue({ address: null });
    useBreakpointsMock.mockReturnValue('sm');

    render(<WalletMenu>Content</WalletMenu>);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('does not render anything if breakpoint is not defined', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue(null);

    render(<WalletMenu>Content</WalletMenu>);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders WalletBottomSheet when breakpoint is "sm"', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue('sm');

    render(<WalletMenu className="bottom-sheet">Content</WalletMenu>);

    const bottomSheet = screen.getByTestId('ockWalletBottomSheet');
    expect(bottomSheet).toBeInTheDocument();
    expect(bottomSheet).toHaveClass('bottom-sheet');
  });

  it('renders WalletDropdown when breakpoint is not "sm"', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue('md');

    render(<WalletMenu className="dropdown">Content</WalletMenu>);

    const dropdown = screen.getByTestId('ockWalletDropdown');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass('dropdown');
  });
});
