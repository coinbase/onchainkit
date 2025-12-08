import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Success } from './Success';

const mockClipboard = {
  writeText: vi.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

const mockAccountAssociation = {
  header: 'test-header',
  payload: 'test-payload',
  signature: 'test-signature',
  domain: 'https://example.com',
};

describe('Success', () => {
  const mockHandleClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    render(
      <Success
        accountAssocation={mockAccountAssociation}
        handleClose={mockHandleClose}
      />,
    );

    expect(
      screen.getByText('Mini-App Manifest Generated Successfully!'),
    ).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText(/test-header/)).toBeInTheDocument();
    expect(screen.getByText(/test-payload/)).toBeInTheDocument();
    expect(screen.getByText(/test-signature/)).toBeInTheDocument();
  });

  it('should not render when accountAssociation is null', () => {
    render(<Success accountAssocation={null} handleClose={mockHandleClose} />);

    expect(
      screen.queryByText('Mini-App Manifest Generated Successfully!'),
    ).not.toBeInTheDocument();
  });

  it('should copy account association data to clipboard', () => {
    render(
      <Success
        accountAssocation={mockAccountAssociation}
        handleClose={mockHandleClose}
      />,
    );

    fireEvent.click(screen.getByText('Copy'));

    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(
        {
          header: mockAccountAssociation.header,
          payload: mockAccountAssociation.payload,
          signature: mockAccountAssociation.signature,
        },
        null,
        2,
      ),
    );
  });

  it('should handle close button click', () => {
    render(
      <Success
        accountAssocation={mockAccountAssociation}
        handleClose={mockHandleClose}
      />,
    );

    fireEvent.click(screen.getByText(/Close window and return to CLI/));

    expect(mockHandleClose).toHaveBeenCalled();
  });
});
