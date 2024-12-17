import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FundCard } from './FundCard';
import { FundCardProvider } from './FundCardProvider';
import type { FundCardPropsReact } from '../types';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: () => 'mocked-theme-class',
}));

vi.mock('../hooks/useExchangeRate', () => ({
  useExchangeRate: () => {},
}));

vi.mock('../utils/setupOnrampEventListeners', () => ({
  setupOnrampEventListeners: vi.fn(),
}));

describe('FundCard', () => {
  const defaultProps: FundCardPropsReact = {
    assetSymbol: 'BTC',
    buttonText: 'Buy BTC',
    headerText: 'Fund Your Account',
  };

  const renderComponent = (props = defaultProps) =>
    render(
      <FundCardProvider asset={props.assetSymbol}>
        <FundCard {...props} />
      </FundCardProvider>
    );

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Fund Your Account')).toBeInTheDocument();
    expect(screen.getByText('Buy BTC')).toBeInTheDocument();
  });

  it('displays the correct header text', () => {
    renderComponent();
    expect(screen.getByText('Fund Your Account')).toBeInTheDocument();
  });

  it('displays the correct button text', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Buy BTC' })).toBeInTheDocument();
  });

  it('handles input changes for fiat amount', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('$') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '100' } });
    expect(input.value).toBe('100');
  });

  it('switches input type from fiat to crypto', () => {
    renderComponent();
    const switchButton = screen.getByRole('button', { name: /switch to crypto/i });
    fireEvent.click(switchButton);
    expect(screen.getByPlaceholderText('BTC')).toBeInTheDocument();
  });

  it('selects a payment method', () => {
    renderComponent();
    const dropdown = screen.getByRole('button', { name: /select payment method/i });
    fireEvent.click(dropdown);
    const option = screen.getByText('Coinbase');
    fireEvent.click(option);
    expect(screen.getByText('Coinbase')).toBeInTheDocument();
  });

  it('disables the submit button when fund amount is zero', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: 'Buy BTC' });
    expect(button).toBeDisabled();
  });

  it('enables the submit button when fund amount is greater than zero', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('$') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '100' } });
    const button = screen.getByRole('button', { name: 'Buy BTC' });
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when submitting', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('$') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '100' } });
    const button = screen.getByRole('button', { name: 'Buy BTC' });
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('state', 'loading');
    
    await waitFor(() => {
      expect(button).toHaveAttribute('state', 'default');
    });
  });

  it('handles funding URL correctly for fiat input', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('$') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '100' } });
    const button = screen.getByRole('button', { name: 'Buy BTC' });
    
    expect(button).toHaveAttribute('href');
  });

  it('handles funding URL correctly for crypto input', () => {
    renderComponent();
    const switchButton = screen.getByRole('button', { name: /switch to crypto/i });
    fireEvent.click(switchButton);
    const input = screen.getByPlaceholderText('BTC') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0.005' } });
    const button = screen.getByRole('button', { name: 'Buy BTC' });
    
    expect(button).toHaveAttribute('href');
  });

  it('calls onEvent, onExit, and onSuccess from setupOnrampEventListeners', () => {
    const { setupOnrampEventListeners } = require('../utils/setupOnrampEventListeners');
    renderComponent();
    expect(setupOnrampEventListeners).toHaveBeenCalled();
  });
});
