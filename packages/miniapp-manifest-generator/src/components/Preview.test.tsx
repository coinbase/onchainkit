import { render, screen, fireEvent } from '@testing-library/react';
import { Preview } from './Preview';
import { describe, expect, it } from 'vitest';

const mockFrame = {
  version: 'next',
  name: 'Test Frame',
  homeUrl: 'https://example.com',
  iconUrl: 'https://example.com/icon.png',
  imageUrl: 'https://example.com/image.png',
  buttonTitle: 'Launch Test Frame',
};

describe('Preview', () => {
  it('should render', () => {
    render(<Preview frame={mockFrame} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', mockFrame.imageUrl);
    expect(screen.getByRole('button')).toHaveTextContent(
      `Launch ${mockFrame.name}`,
    );
  });

  it('should open preview modal on button click', () => {
    render(<Preview frame={mockFrame} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();
    expect(screen.getByText(mockFrame.name)).toBeInTheDocument();
    expect(screen.getByTitle('Mini App Preview')).toHaveAttribute(
      'src',
      mockFrame.homeUrl,
    );
  });

  it('should close modal when clicking close button', () => {
    render(<Preview frame={mockFrame} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(screen.queryByTitle('Mini App Preview')).not.toBeInTheDocument();
  });

  it('should close modal when clicking overlay', () => {
    render(<Preview frame={mockFrame} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('previewModalOverlay'));
    expect(screen.queryByTitle('Mini App Preview')).not.toBeInTheDocument();
  });

  it('should not close modal when clicking modal content', () => {
    render(<Preview frame={mockFrame} />);

    fireEvent.click(screen.getByRole('button'));
    const modal = screen.getByTestId('previewModalContent');

    fireEvent.click(modal);
    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();
  });
});
