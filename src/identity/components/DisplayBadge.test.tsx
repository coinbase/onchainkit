/**
 * @vi-environment jsdom
 */
import React from 'react';
import '@testing-library/vi-dom';
import { render, screen } from '@testing-library/react';
import { DisplayBadge } from './DisplayBadge';
import { Badge } from './Badge';
import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { useIdentityContext } from './IdentityProvider';

vi.mock('../../useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));
vi.mock('../hooks/useAttestations', () => ({
  useAttestations: vi.fn(),
}));
vi.mock('./IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

describe('DisplayBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if neither contextSchemaId nor schemaId is provided', () => {
    (useOnchainKit as vi.Mock).mockReturnValue({
      chain: 'test-chain',
      schemaId: null,
    });
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: null,
      address: '0x123',
    });
    (useAttestations as vi.Mock).mockReturnValue([]);

    expect(() =>
      render(
        <DisplayBadge>
          <Badge />
        </DisplayBadge>
      )
    ).toThrow(
      'Name: a SchemaId must be provided to the OnchainKitProvider or Identity component.'
    );
  });

  it('should return null if attestations are empty', () => {
    (useOnchainKit as vi.Mock).mockReturnValue({
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: null,
      address: '0x123',
    });
    (useAttestations as vi.Mock).mockReturnValue([]);

    const { container } = render(
      <DisplayBadge>
        <Badge />
      </DisplayBadge>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render children if attestations are not empty', () => {
    (useOnchainKit as vi.Mock).mockReturnValue({
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: null,
      address: '0x123',
    });
    (useAttestations as vi.Mock).mockReturnValue(['attestation1']);

    render(
      <DisplayBadge>
        <Badge />
      </DisplayBadge>
    );
    expect(screen.getByTestId('ockBadge')).toBeInTheDocument();
  });
});
