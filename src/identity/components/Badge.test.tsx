import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './Badge';

describe('Badge Component', () => {
  const badgeStyle = 'height: 12px; width: 12px';
  it('should render the svg', async () => {
    render(<Badge />);

    await waitFor(() => {
      const inner = screen.queryByTestId('ockBadge');
      expect(inner).toBeInTheDocument();
    });
  });

  it('should render the default svg with a blue background and no border', async () => {
    render(<Badge />);

    await waitFor(() => {
      const badge = screen.queryByTestId('ockBadge');
      expect(badge).toHaveStyle(badgeStyle);
      expect(badge).toHaveClass('bg-ock-primary');
      const ticker = screen.queryByTestId('ock-badgeSvg');
      expect(ticker).toHaveClass('fill-ock-inverse');
    });
  });
});
