import { render, screen, fireEvent } from '@testing-library/react';
import { Preview } from './Preview';
import { describe, expect, it } from 'vitest';
import { FrameMetadata } from '../types';

const mockFrameMetadata = {
  version: 'next',
  imageUrl: 'https://onchainkit.xyz/playground/snake.png',
  button: {
    title: 'Launch MiniKit',
    action: {
      type: 'launch_frame' as const,
      name: 'MiniKit',
      url: 'https://onchainkit.xyz/playground/minikit',
      splashImageUrl: 'https://onchainkit.xyz/playground/snake.png',
      splashBackgroundColor: '#FFFFFF',
    },
  },
} as FrameMetadata;

describe('Preview', () => {
  it('should render', () => {
    render(<Preview frameMetadata={mockFrameMetadata} />);

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      mockFrameMetadata.imageUrl,
    );
    expect(screen.getByRole('button')).toHaveTextContent(
      mockFrameMetadata.button.title,
    );
  });

  it('should not render when button action type is not launch_frame', () => {
    const mockFrameMetadataWithViewToken = {
      ...mockFrameMetadata,
      button: {
        ...mockFrameMetadata.button,
        action: {
          ...mockFrameMetadata.button.action,
          type: 'view_token' as const,
        },
      },
    } as FrameMetadata;

    render(<Preview frameMetadata={mockFrameMetadataWithViewToken} />);

    expect(screen.queryByTitle('Mini App Preview')).not.toBeInTheDocument();
  });

  it('should open preview modal on button click', () => {
    render(<Preview frameMetadata={mockFrameMetadata} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();
    if (mockFrameMetadata.button.action.type === 'launch_frame') {
      expect(
        screen.getByText(mockFrameMetadata.button.action.name),
      ).toBeInTheDocument();
      expect(screen.getByTitle('Mini App Preview')).toHaveAttribute(
        'src',
        mockFrameMetadata.button.action.url,
      );
    }
  });

  it('should close modal when clicking close button', () => {
    render(<Preview frameMetadata={mockFrameMetadata} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(screen.queryByTitle('Mini App Preview')).not.toBeInTheDocument();
  });

  it('should close modal when clicking overlay', () => {
    render(<Preview frameMetadata={mockFrameMetadata} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('previewModalOverlay'));
    expect(screen.queryByTitle('Mini App Preview')).not.toBeInTheDocument();
  });

  it('should not close modal when clicking modal content', () => {
    render(<Preview frameMetadata={mockFrameMetadata} />);

    fireEvent.click(screen.getByRole('button'));
    const modal = screen.getByTestId('previewModalContent');

    fireEvent.click(modal);
    expect(screen.getByTitle('Mini App Preview')).toBeInTheDocument();
  });
});
