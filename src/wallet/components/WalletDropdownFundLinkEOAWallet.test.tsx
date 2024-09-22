import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { getOnrampBuyUrl } from '../../fund/utils/getOnrampBuyUrl';
import { useOnchainKit } from '../../useOnchainKit';
import { WalletDropdownFundLinkEOAWallet } from './WalletDropdownFundLinkEOAWallet';

vi.mock('../../useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../fund/utils/getOnrampBuyUrl', () => ({
  getOnrampBuyUrl: vi.fn(),
}));

const mockWalletDropdownFundLinkButton = vi.fn();
vi.mock('./WalletDropdownFundLinkButton', () => ({
  WalletDropdownFundLinkButton: (props) => {
    mockWalletDropdownFundLinkButton(props);
    return <div />;
  },
}));

describe('WalletDropdownFundLinkEOAWallet', () => {
  it('renders the Coinbase Pay funding link with the chain from useAccount', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'projectId',
      chain: { name: 'OnchainKitChain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'AccountChain' },
    });
    (getOnrampBuyUrl as Mock).mockReturnValue('https://pay.coinbase.com/buy');

    render(<WalletDropdownFundLinkEOAWallet />);

    expect(getOnrampBuyUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'projectId',
        addresses: { '0x123': ['accountchain'] },
      }),
    );
    expect(mockWalletDropdownFundLinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        fundingUrl: 'https://pay.coinbase.com/buy',
      }),
    );
  });

  it('renders the Coinbase Pay funding link with the chain from useOnchainKit when the useAccount chain is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'projectId',
      chain: { name: 'OnchainKitChain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: undefined,
    });
    (getOnrampBuyUrl as Mock).mockReturnValue('https://pay.coinbase.com/buy');

    render(<WalletDropdownFundLinkEOAWallet />);

    expect(getOnrampBuyUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'projectId',
        addresses: { '0x123': ['onchainkitchain'] },
      }),
    );
    expect(mockWalletDropdownFundLinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        fundingUrl: 'https://pay.coinbase.com/buy',
      }),
    );
  });

  it('returns null when projectId is null', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: null,
      chain: { name: 'OnchainKitChain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'AccountChain' },
    });

    const { container } = render(<WalletDropdownFundLinkEOAWallet />);

    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when address is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'projectId',
      chain: { name: 'OnchainKitChain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      chain: undefined,
    });

    const { container } = render(<WalletDropdownFundLinkEOAWallet />);

    expect(container).toBeEmptyDOMElement();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
