import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TokenBalance } from './TokenBalance';

const mockToken = {
  symbol: 'ETH',
  address: '' as const,
  chainId: 8453,
  decimals: 18,
  image: null,
  name: 'Ethereum',
  cryptoBalance: 1,
  fiatBalance: 3300,
};

describe('TokenBalance', () => {
  describe('Main TokenBalance component', () => {
    it('renders as div when no onClick provided', () => {
      render(<TokenBalance token={mockToken} />);
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('renders as button with onClick handler', () => {
      const onClick = vi.fn();
      render(<TokenBalance token={mockToken} onClick={onClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledWith(mockToken);
    });

    it('applies custom classNames to the div container', () => {
      const customClassNames = { container: 'custom-class' };
      render(<TokenBalance token={mockToken} classNames={customClassNames} />);
      expect(screen.getByTestId('ockTokenBalance')).toHaveClass(
        customClassNames.container,
      );
    });

    it('applies custom classNames to the button container', () => {
      const customClassNames = { container: 'custom-class' };
      const handleClick = vi.fn();
      render(
        <TokenBalance
          token={mockToken}
          onClick={handleClick}
          classNames={customClassNames}
        />,
      );
      expect(screen.getByTestId('ockTokenBalanceButton')).toHaveClass(
        customClassNames.container,
      );
    });
  });

  describe('TokenBalanceContent', () => {
    it('renders token details correctly', () => {
      render(<TokenBalance token={mockToken} subtitle="Test subtitle" />);

      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.getByText('0.000 ETH Test subtitle')).toBeInTheDocument();
      expect(screen.getByText('$3,300.00')).toBeInTheDocument();
    });

    it('shows/hides token image based on showImage prop', () => {
      const { rerender } = render(
        <TokenBalance
          token={mockToken}
          showImage={true}
          subtitle="Test subtitle"
        />,
      );
      expect(screen.getByTestId('ockTokenImage_NoImage')).toBeInTheDocument();

      rerender(
        <TokenBalance
          token={mockToken}
          showImage={false}
          subtitle="Test subtitle"
        />,
      );
      expect(screen.queryByTestId('ockTokenImage_NoImage')).toBeNull();
    });

    it('renders subtitle when provided', () => {
      const subtitle = '(50% of balance)';
      render(<TokenBalance token={mockToken} subtitle={subtitle} />);
      expect(screen.getByText(`0.000 ETH ${subtitle}`)).toBeInTheDocument();
    });

    it('does not render action button when onActionPress is not provided', () => {
      render(<TokenBalance token={mockToken} />);
      expect(screen.queryByTestId('ockTokenBalanceAction')).toBeNull();
    });

    it('renders action button when onActionPress is provided', () => {
      const onActionPress = vi.fn();
      render(
        <TokenBalance
          token={mockToken}
          actionText="Custom Action"
          onActionPress={onActionPress}
        />,
      );

      const actionButton = screen.getByRole('button', {
        name: 'Custom Action',
      });
      expect(actionButton).toBeInTheDocument();

      fireEvent.click(actionButton);
      expect(onActionPress).toHaveBeenCalled();
    });

    it('applies custom class names to token elements when no action is provided', () => {
      const customClassNames = {
        tokenName: 'custom-name',
        tokenValue: 'custom-value',
        fiatValue: 'custom-fiat',
      };

      render(<TokenBalance token={mockToken} classNames={customClassNames} />);

      expect(screen.getByText('Ethereum')).toHaveClass('custom-name');
      expect(screen.getByText('0.000 ETH')).toHaveClass('custom-value');
      expect(screen.getByText('$3,300.00')).toHaveClass('custom-fiat');
    });

    it('applies custom class names to token elements when action is provided', () => {
      const customClassNames = {
        tokenName: 'custom-name',
        tokenValue: 'custom-value',
        action: 'custom-action',
      };

      render(
        <TokenBalance
          token={mockToken}
          classNames={customClassNames}
          onActionPress={() => {}}
        />,
      );

      expect(screen.getByText('Ethereum')).toHaveClass('custom-name');
      expect(screen.getByText('0.000 ETH')).toHaveClass('custom-value');
      expect(screen.getByTestId('ockTokenBalanceAction')).toHaveClass(
        'custom-action',
      );
    });

    it('handles token with empty/null name', () => {
      const tokenWithoutName = {
        ...mockToken,
        name: null as unknown as string,
      };
      render(
        <TokenBalance token={tokenWithoutName} subtitle="Test subtitle" />,
      );

      const nameElement = screen.getByText('', {
        selector: 'span.ock-font-family.font-semibold',
      });
      expect(nameElement).toBeInTheDocument();
    });

    it('handles token size prop correctly', () => {
      const customSize = 60;
      render(
        <TokenBalance
          token={mockToken}
          tokenSize={customSize}
          subtitle="Test subtitle"
        />,
      );
      const imageContainer = screen.getByTestId('ockTokenImage_NoImage');
      expect(imageContainer).toHaveStyle({
        width: `${customSize}px`,
        height: `${customSize}px`,
        minWidth: `${customSize}px`,
        minHeight: `${customSize}px`,
      });
    });
  });
});
