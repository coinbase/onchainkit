import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { MessageType } from '../types';
import { SignatureLabel } from './SignatureLabel';
import { useSignatureContext } from './SignatureProvider';

vi.mock('./SignatureProvider', () => ({
  useSignatureContext: vi.fn(),
}));

describe('SignatureLabel', () => {
  it('should render success message', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'success',
        statusData: {
          signature: '0x123',
          type: MessageType.TYPED_DATA,
        },
      },
    });

    render(<SignatureLabel />);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('should render error message', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'error',
        statusData: {
          code: 'TEST01',
          message: 'Test error message',
          type: MessageType.TYPED_DATA,
        },
      },
    });
    render(<SignatureLabel />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render pending message', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'pending',
        statusData: {
          type: MessageType.TYPED_DATA,
        },
      },
    });
    render(<SignatureLabel />);
    expect(screen.getByText('Confirm in wallet')).toBeInTheDocument();
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

    render(<SignatureLabel className="custom-class" />);
    expect(screen.getByText('Success')).toHaveClass('custom-class');
  });

  it('should not render if no label', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'init',
        statusData: null,
      },
    });

    render(<SignatureLabel />);
    expect(screen.queryByTestId('ockSignatureLabel')).not.toBeInTheDocument();
  });
});
