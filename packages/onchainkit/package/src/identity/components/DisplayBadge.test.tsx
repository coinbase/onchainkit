import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { useAttestations } from '@/identity/hooks/useAttestations';
import { useOnchainKit } from '@/useOnchainKit';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { DisplayBadge } from './DisplayBadge';
import { useIdentityContext } from './IdentityProvider';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));
vi.mock('@/identity/hooks/useAttestations', () => ({
  useAttestations: vi.fn(),
}));
vi.mock('@/identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

const useIdentityContextMock = mock(useIdentityContext);
const useOnchainKitMock = mock(useOnchainKit);
const useAttestationsMock = mock(useAttestations);

describe('DisplayBadge', () => {
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testDisplayBadgeComponentAddress = '0xDisplayBadgeAddress';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if neither contextSchemaId nor schemaId is provided', () => {
    useOnchainKitMock.mockReturnValue({
      chain: 'test-chain',
      schemaId: null,
    });
    useIdentityContextMock.mockReturnValue({
      schemaId: null,
      address: testIdentityProviderAddress,
    });
    useAttestationsMock.mockReturnValue([]);

    expect(() =>
      render(
        <DisplayBadge>
          <Badge />
        </DisplayBadge>,
      ),
    ).toThrow(
      'Name: a SchemaId must be provided to the OnchainKitProvider or Identity component.',
    );
  });

  it('should return null if attestations are empty', () => {
    useOnchainKitMock.mockReturnValue({
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
    useIdentityContextMock.mockReturnValue({
      schemaId: null,
      address: testIdentityProviderAddress,
    });
    useAttestationsMock.mockReturnValue([]);

    const { container } = render(
      <DisplayBadge>
        <Badge />
      </DisplayBadge>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render children if attestations are not empty', () => {
    useOnchainKitMock.mockReturnValue({
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
    useIdentityContextMock.mockReturnValue({
      schemaId: null,
      address: testIdentityProviderAddress,
    });
    useAttestationsMock.mockReturnValue(['attestation1']);

    render(
      <DisplayBadge>
        <Badge />
      </DisplayBadge>,
    );
    expect(screen.getByTestId('ockBadge')).toBeInTheDocument();
  });

  it('use identity context address if provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });

    render(
      <DisplayBadge>
        <Badge />
      </DisplayBadge>,
    );

    expect(useAttestations).toHaveBeenCalledWith({
      address: testIdentityProviderAddress,
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
  });

  it('use component address over identity context if both are provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });

    render(
      <DisplayBadge address={testDisplayBadgeComponentAddress}>
        <Badge />
      </DisplayBadge>,
    );

    expect(useAttestations).toHaveBeenCalledWith({
      address: testDisplayBadgeComponentAddress,
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
  });
});
