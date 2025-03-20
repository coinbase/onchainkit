import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { MessageType } from '../types';
import { SignatureIcon } from './SignatureIcon';
import { useSignatureContext } from './SignatureProvider';

vi.mock('./SignatureProvider', () => ({
  useSignatureContext: vi.fn(),
}));
vi.mock('../../internal/svg/errorSvg', () => ({
  ErrorSvg: vi.fn(() => <div>ErrorSvg</div>),
}));
vi.mock('../../internal/svg/successSvg', () => ({
  SuccessSvg: vi.fn(() => <div>SuccessSvg</div>),
}));
vi.mock('../../internal/components/Spinner', () => ({
  Spinner: vi.fn(() => <div>Spinner</div>),
}));

describe('SignatureIcon', () => {
  it('should render success icon', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'success',
        statusData: {
          signature: '0x123',
          type: MessageType.TYPED_DATA,
        },
      },
    });

    render(<SignatureIcon />);
    expect(screen.getByText('SuccessSvg')).toBeInTheDocument();
  });

  it('should render error icon', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'error',
        statusData: {
          signature: '0x123',
          type: MessageType.TYPED_DATA,
        },
      },
    });
    render(<SignatureIcon />);
    expect(screen.getByText('ErrorSvg')).toBeInTheDocument();
  });

  it('should render spinner icon', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'pending',
        statusData: {
          signature: '0x123',
          type: MessageType.TYPED_DATA,
        },
      },
    });
    render(<SignatureIcon />);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
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

    render(<SignatureIcon className="custom-class" />);
    expect(screen.getByText('SuccessSvg').parentElement).toHaveClass(
      'custom-class',
    );
  });

  it('should not render if no icon', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'init',
        statusData: null,
      },
    });

    render(<SignatureIcon />);
    expect(screen.queryByTestId('ockSignatureIcon')).not.toBeInTheDocument();
  });
});
