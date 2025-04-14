import { render, screen, fireEvent } from '@testing-library/react';
import { FarcasterJsonRaw } from './FarcasterJsonRaw';
import { describe, expect, it } from 'vitest';

const mockJson = {
  frame: {
    version: 'next',
    name: 'Test Frame',
  },
  accountAssociation: {
    header: 'eyJmaWQiOjgxODAyNiwidHlwZSI6ImN1c3RvZHkifQ',
    payload: 'eyJkb21haW4iOiJvbmNoYWlua2l0Lnh5eiJ9',
    signature: '0x1234567890abcdef',
    domain: 'example.com',
  },
};

describe('FarcasterJsonRaw', () => {
  it('should render', () => {
    render(<FarcasterJsonRaw farcasterJson={mockJson} />);
    expect(screen.getByText('Show raw farcaster.json')).toBeInTheDocument();
  });

  it('should toggle content visibility when clicking the button', () => {
    render(<FarcasterJsonRaw farcasterJson={mockJson} />);
    const button = screen.getByRole('button');
    const container = screen.getByTestId('jsonRawContainer');

    expect(container).toHaveClass('grid-rows-[0fr]');

    fireEvent.click(button);
    expect(container).toHaveClass('grid-rows-[1fr]');
    expect(screen.getByText('Hide raw farcaster.json')).toBeInTheDocument();

    fireEvent.click(button);
    expect(container).toHaveClass('grid-rows-[0fr]');
    expect(screen.getByText('Show raw farcaster.json')).toBeInTheDocument();
  });
});
