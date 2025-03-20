import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { render, screen } from '@testing-library/react';
import { encodeAbiParameters } from 'viem';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { Signature } from './Signature';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(() => 'default-light'),
}));
vi.mock('@/internal/hooks/useIsMounted');
vi.mock('./SignatureProvider', () => ({
  SignatureProvider: vi.fn(({ children }) => (
    <div data-testid="SignatureProvider">{children}</div>
  )),
}));
vi.mock('./SignatureStatus', () => ({
  SignatureStatus: vi.fn(() => <div>SignatureStatus</div>),
}));
vi.mock('./SignatureToast', () => ({
  SignatureToast: vi.fn(() => <div>SignatureToast</div>),
}));
vi.mock('./SignatureButton', () => ({
  SignatureButton: vi.fn(({ label, disabled }) => (
    <button type="button" disabled={disabled}>
      {label}
    </button>
  )),
}));

const SCHEMA_UID =
  '0xf58b8b212ef75ee8cd7e8d803c37c03e0519890502d5e99ee2412aae1456cafe';
const EAS_CONTRACT = '0x4200000000000000000000000000000000000021';

const domain = {
  name: 'EAS Attestation',
  version: '1.0.0',
  chainId: base.id,
  verifyingContract: EAS_CONTRACT,
} as const;

const types = {
  Attest: [
    { name: 'schema', type: 'bytes32' },
    { name: 'recipient', type: 'address' },
    { name: 'time', type: 'uint64' },
    { name: 'revocable', type: 'bool' },
    { name: 'refUID', type: 'bytes32' },
    { name: 'data', type: 'bytes' },
    { name: 'value', type: 'uint256' },
  ],
} as const;

const message = {
  schema: SCHEMA_UID,
  recipient: '0x0000000000000000000000000000000000000000',
  time: BigInt(0),
  revocable: false,
  refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
  data: encodeAbiParameters([{ type: 'string' }], ['test attestation']),
  value: BigInt(0),
} as const;

describe('Signature', () => {
  beforeEach(() => {
    (useIsMounted as Mock).mockReturnValue(true);
  });

  it('should render an empty div if not mounted', () => {
    (useIsMounted as Mock).mockReturnValue(false);

    render(<Signature message="test" />);

    expect(screen.queryByTestId('SignatureProvider')).not.toBeInTheDocument();
  });

  it('should render with valid EIP712 typed data', () => {
    render(
      <Signature
        domain={domain}
        types={types}
        message={message}
        primaryType="Attest"
        label="EIP712"
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByText('EIP712')).toBeInTheDocument();
  });

  it('should render with valid signable message', () => {
    render(
      <Signature
        message="test message"
        label="personal_sign"
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByText('personal_sign')).toBeInTheDocument();
  });

  it('should render custom children instead of default button', () => {
    render(
      <Signature message="test message" onSuccess={vi.fn()}>
        <button type="button">Custom Button</button>
      </Signature>,
    );

    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });

  it('should apply a custom className', () => {
    render(
      <Signature
        message="test message"
        className="custom-class"
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByTestId('SignatureProvider').firstChild).toHaveClass(
      'custom-class',
    );
  });

  it('should disable the button when disabled prop is true', () => {
    render(
      <Signature message="test message" disabled={true} onSuccess={vi.fn()} />,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
