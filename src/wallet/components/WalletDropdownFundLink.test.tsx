import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { useGetFundingUrl } from '../../fund/hooks/useGetFundingUrl';
import { WalletDropdownFundLink } from './WalletDropdownFundLink';

vi.mock('../../fund/hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

const mockWalletDropdownFundLinkButton = vi.fn();
vi.mock('./WalletDropdownFundLinkButton', () => ({
  WalletDropdownFundLinkButton: (props) => {
    mockWalletDropdownFundLinkButton(props);
    return <div />;
  },
}));

describe('WalletDropdownFund', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the fund link button with the fundingUrl prop when it is defined', () => {
    render(<WalletDropdownFundLink fundingUrl="https://props.funding.url" />);

    expect(mockWalletDropdownFundLinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        fundingUrl: 'https://props.funding.url',
      }),
    );
  });

  it('renders the fund link button with the default fundingUrl when the fundingUrl prop is undefined', () => {
    (useGetFundingUrl as Mock).mockReturnValue({
      url: 'https://default.funding.url',
      popupHeight: 100,
      popupWidth: 100,
    });

    render(<WalletDropdownFundLink />);

    expect(mockWalletDropdownFundLinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        fundingUrl: 'https://default.funding.url',
        popupHeightOverride: 100,
        popupWidthOverride: 100,
      }),
    );
  });

  it('does not render the fund link when the fundingUrl prop is undefined and useGetFundingUrl returns undefined', () => {
    (useGetFundingUrl as Mock).mockReturnValue(undefined);

    render(<WalletDropdownFundLink />);

    expect(mockWalletDropdownFundLinkButton).not.toHaveBeenCalled();
  });
});
