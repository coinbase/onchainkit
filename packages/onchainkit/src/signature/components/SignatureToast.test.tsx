import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { MessageType } from '../types';
import { useSignatureContext } from './SignatureProvider';
import { SignatureToast } from './SignatureToast';

vi.mock('./SignatureProvider', () => ({
  useSignatureContext: vi.fn(),
}));

vi.mock('./SignatureIcon', () => ({
  SignatureIcon: vi.fn(() => <div>SignatureIcon</div>),
}));
vi.mock('./SignatureLabel', () => ({
  SignatureLabel: vi.fn(() => <div>SignatureLabel</div>),
}));

describe('SignatureToast', () => {
  it('should render if status it not init', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'success',
        statusData: {
          signature: '0x123',
          type: MessageType.TYPED_DATA,
        },
      },
    });

    render(<SignatureToast />);
    expect(screen.getByTestId('ockToast')).toBeInTheDocument();
  });

  it('should not render in init status', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'init',
        statusData: null,
      },
    });

    render(<SignatureToast />);
    expect(screen.queryByTestId('ockToast')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'success',
        statusData: {
          signature: '0x123',
          type: MessageType.TYPED_DATA,
        },
      },
    });

    render(<SignatureToast className="custom-class" />);
    expect(screen.getByTestId('ockToast')).toHaveClass('custom-class');
  });

  it('should hide toast onClose', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'success',
        statusData: {
          signature: '0x123',
          type: MessageType.TYPED_DATA,
        },
      },
    });

    render(<SignatureToast />);

    expect(screen.queryByTestId('ockToast')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('ockCloseButton'));

    expect(screen.queryByTestId('ockToast')).not.toBeInTheDocument();
  });

  it('should render default children', () => {
    render(<SignatureToast />);
    expect(screen.getByText('SignatureIcon')).toBeInTheDocument();
    expect(screen.getByText('SignatureLabel')).toBeInTheDocument();
  });

  it('should render passed in children', () => {
    render(
      <SignatureToast>
        <div>Custom Child</div>
      </SignatureToast>,
    );
    expect(screen.getByText('Custom Child')).toBeInTheDocument();
  });
});
