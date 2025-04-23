import { render, screen, fireEvent } from '@testing-library/react';
import { ShowJson } from './ShowJson';
import { describe, expect, it, vi } from 'vitest';
import { FarcasterManifest } from '../types';

const mockJson = {
  frame: {
    version: 'next',
    name: 'Test Frame',
  },
  accountAssociation: {
    header: 'eyJmaWQiOjgxODAyNiwidHlwZSI6ImN1c3RvZHkifQ',
    payload: 'eyJkb21haW4iOiJvbmNoYWlua2l0Lnh5eiJ9',
    signature: '0x1234567890abcdef',
  },
} as FarcasterManifest;

const mockClipboard = {
  writeText: vi.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe('ShowJson', () => {
  it('should render', () => {
    render(<ShowJson label="farcaster.json" json={mockJson} />);
    expect(screen.getByText(/Show farcaster\.json/i)).toBeInTheDocument();
  });

  it('should toggle content visibility when clicking the button', () => {
    render(<ShowJson label="farcaster.json" json={mockJson} />);
    const button = screen.getByText(/Show farcaster\.json/i);
    const container = screen.getByTestId('jsonRawContainer');

    expect(container).toHaveClass('grid-rows-[0fr]');

    fireEvent.click(button);
    expect(container).toHaveClass('grid-rows-[1fr]');
    expect(screen.getByText(/Hide farcaster.json/i)).toBeInTheDocument();

    fireEvent.click(button);
    expect(container).toHaveClass('grid-rows-[0fr]');
    expect(screen.getByText(/Show farcaster.json/i)).toBeInTheDocument();
  });

  it('should copy the JSON to the clipboard when the copy button is clicked', () => {
    render(<ShowJson label="farcaster.json" json={mockJson} />);
    const button = screen.getByText(/Show farcaster\.json/i);

    fireEvent.click(button);
    fireEvent.click(screen.getByText(/Copy/i));

    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(mockJson, null, 2),
    );
  });
});
