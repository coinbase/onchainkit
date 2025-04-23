import { render, screen, fireEvent } from '@testing-library/react';
import { ShowJson } from './ShowJson';
import { describe, expect, it } from 'vitest';
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
    domain: 'example.com',
  },
} as unknown as FarcasterManifest;

describe('ShowJson', () => {
  it('should render', () => {
    render(<ShowJson label="farcaster.json" json={mockJson} />);
    expect(screen.getByText(/Show farcaster\.json/i)).toBeInTheDocument();
  });

  it('should toggle content visibility when clicking the button', () => {
    render(<ShowJson label="farcaster.json" json={mockJson} />);
    const button = screen.getByRole('button');
    const container = screen.getByTestId('jsonRawContainer');

    expect(container).toHaveClass('grid-rows-[0fr]');

    fireEvent.click(button);
    expect(container).toHaveClass('grid-rows-[1fr]');
    expect(screen.getByText(/Hide farcaster.json/i)).toBeInTheDocument();

    fireEvent.click(button);
    expect(container).toHaveClass('grid-rows-[0fr]');
    expect(screen.getByText(/Show farcaster.json/i)).toBeInTheDocument();
  });
});
