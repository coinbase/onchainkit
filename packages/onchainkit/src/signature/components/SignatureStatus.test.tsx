import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSignatureContext } from './SignatureProvider';
import { SignatureStatus } from './SignatureStatus';

vi.mock('./SignatureProvider', () => ({
  useSignatureContext: vi.fn(),
}));
vi.mock('./SignatureLabel', () => ({
  SignatureLabel: vi.fn(() => <div>SignatureLabel</div>),
}));

describe('SignatureStatus', () => {
  beforeEach(() => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'init',
      },
    });
  });

  it('should render default children', () => {
    render(<SignatureStatus />);
    expect(screen.getByText('SignatureLabel')).toBeInTheDocument();
  });

  it('should render passed in children', () => {
    render(
      <SignatureStatus>
        <div>Custom Child</div>
      </SignatureStatus>,
    );
    expect(screen.getByText('Custom Child')).toBeInTheDocument();
  });

  it('should render error className', () => {
    (useSignatureContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'error',
      },
    });
    render(<SignatureStatus />);
    expect(screen.getByText('SignatureLabel').parentElement).toHaveClass(
      'ock-text-error',
    );
  });

  it('should set custom className', () => {
    render(<SignatureStatus className="custom-class" />);
    expect(screen.getByText('SignatureLabel').parentElement).toHaveClass(
      'custom-class',
    );
  });
});
