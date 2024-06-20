/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DisplayBadge } from './DisplayBadge';
import { Badge } from './Badge';
import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { useIdentityContext } from '../context';

jest.mock('../../useOnchainKit', () => ({
  useOnchainKit: jest.fn(),
}));
jest.mock('../hooks/useAttestations', () => ({
  useAttestations: jest.fn(),
}));
jest.mock('../context', () => ({
  useIdentityContext: jest.fn(),
}));

describe('DisplayBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if neither contextSchemaId nor schemaId is provided', () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: 'test-chain',
      schemaId: null,
    });
    (useIdentityContext as jest.Mock).mockReturnValue({
      schemaId: null,
      address: '0x123',
    });
    (useAttestations as jest.Mock).mockReturnValue([]);

    expect(() =>
      render(
        <DisplayBadge>
          <Badge />
        </DisplayBadge>,
      ),
    ).toThrow(
      'Name: a SchemaId must be provided to the Identity or Avatar component.',
    );
  });

  it('should return null if attestations are empty', () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
    (useIdentityContext as jest.Mock).mockReturnValue({
      schemaId: null,
      address: '0x123',
    });
    (useAttestations as jest.Mock).mockReturnValue([]);

    const { container } = render(
      <DisplayBadge>
        <Badge />
      </DisplayBadge>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render children if attestations are not empty', () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: 'test-chain',
      schemaId: 'test-schema-id',
    });
    (useIdentityContext as jest.Mock).mockReturnValue({
      schemaId: null,
      address: '0x123',
    });
    (useAttestations as jest.Mock).mockReturnValue(['attestation1']);

    render(
      <DisplayBadge>
        <Badge />
      </DisplayBadge>,
    );
    expect(screen.getByTestId('ockBadge')).toBeInTheDocument();
  });
});
