import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FundCardAmountInputTypeSwitch } from './FundCardAmountInputTypeSwitch';

describe('FundCardAmountInputTypeSwitch', () => {
  it('renders crypto amount when selectedInputType is fiat', () => {
    render(
      <FundCardAmountInputTypeSwitch
        isLoading={false}
        selectedInputType="fiat"
        setSelectedInputType={vi.fn()}
        selectedAsset="ETH"
        fundAmountFiat="100"
        fundAmountCrypto="200"
        exchangeRate={1}
      />,
    );
    expect(screen.getByText('200 ETH')).toBeInTheDocument();
  });

  it('renders fiat amount when selectedInputType is crypto', () => {
    render(
      <FundCardAmountInputTypeSwitch
        isLoading={false}
        selectedInputType="crypto"
        setSelectedInputType={vi.fn()}
        selectedAsset="ETH"
        fundAmountFiat="100"
        fundAmountCrypto="200"
        exchangeRate={2}
      />,
    );
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('toggles input type on button click', () => {
    const setSelectedInputType = vi.fn();
    render(
      <FundCardAmountInputTypeSwitch
        isLoading={false}
        selectedInputType="fiat"
        setSelectedInputType={setSelectedInputType}
        selectedAsset="USD"
        fundAmountFiat="100"
        fundAmountCrypto="0.01"
        exchangeRate={10000}
      />,
    );
    fireEvent.click(screen.getByLabelText(/amount type switch/i));
    expect(setSelectedInputType).toHaveBeenCalledWith('crypto');
  });

  it('toggles input type from crypto to fiat on button click', () => {
    const setSelectedInputType = vi.fn();
    render(
      <FundCardAmountInputTypeSwitch
        isLoading={false}
        selectedInputType="crypto"
        setSelectedInputType={setSelectedInputType}
        selectedAsset="USD"
        fundAmountFiat="100"
        fundAmountCrypto="0.01"
        exchangeRate={10000}
      />,
    );
    fireEvent.click(screen.getByLabelText(/amount type switch/i));
    expect(setSelectedInputType).toHaveBeenCalledWith('fiat');
  });

  it('does not render fiat amount when fundAmountFiat is "0"', () => {
    render(
      <FundCardAmountInputTypeSwitch
        isLoading={false}
        selectedInputType="fiat"
        setSelectedInputType={vi.fn()}
        selectedAsset="USD"
        fundAmountFiat="0"
        fundAmountCrypto="0"
        exchangeRate={2}
      />,
    );
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
  });

  it('renders Skeleton when exchangeRate does not exist', () => {
    render(
      <FundCardAmountInputTypeSwitch
        isLoading={false}
        selectedInputType="fiat"
        setSelectedInputType={vi.fn()}
        selectedAsset="USD"
        fundAmountFiat="100"
        fundAmountCrypto="0.01"
        exchangeRate={undefined}
      />,
    );
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });
});
