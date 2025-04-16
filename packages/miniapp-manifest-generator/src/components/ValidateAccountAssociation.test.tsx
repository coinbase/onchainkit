import { render, screen, waitFor } from '@testing-library/react';
import { ValidateAccountAssociation } from './ValidateAccountAssociation';
import { describe, expect, it, vi } from 'vitest';
import * as useValidateManifestModule from '../hooks/useValidateManifest';

const mockAccountAssociation = {
  header: 'mockHeader',
  payload: 'mockPayload',
  signature: 'mockSignature',
  domain: 'example.com',
};

const mockValidationResult = {
  type: 'custody',
  key: '0x1234567890abcdef' as `0x${string}`,
  fid: 12345,
  custodyAddress: '0x1234567890abcdef' as `0x${string}`,
  domain: 'example.com',
};

describe('ValidateAccountAssociation', () => {
  it('should show loading state', () => {
    vi.spyOn(useValidateManifestModule, 'useValidateManifest').mockReturnValue(
      () => new Promise(() => {}),
    );

    render(
      <ValidateAccountAssociation
        accountAssociation={mockAccountAssociation}
      />,
    );
    expect(
      screen.getByText('Validating account association...'),
    ).toBeInTheDocument();
  });

  it('should display validation results when successful', async () => {
    vi.spyOn(useValidateManifestModule, 'useValidateManifest').mockReturnValue(
      () => Promise.resolve(mockValidationResult),
    );

    render(
      <ValidateAccountAssociation
        accountAssociation={mockAccountAssociation}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Signer FID:')).toBeInTheDocument();
      expect(screen.getByText('12345')).toBeInTheDocument();
      expect(screen.getByText('Signer Custody Address:')).toBeInTheDocument();
      expect(screen.getByText('0x1234567890abcdef')).toBeInTheDocument();
      expect(screen.getByText('Signed Domain:')).toBeInTheDocument();
      expect(screen.getByText('example.com')).toBeInTheDocument();
      expect(
        screen.getByText('✅ Your account association is valid!'),
      ).toBeInTheDocument();
    });
  });

  it('should display error message when validation fails', async () => {
    const errorMessage = 'Invalid signature';
    vi.spyOn(useValidateManifestModule, 'useValidateManifest').mockReturnValue(
      () => Promise.reject(new Error(errorMessage)),
    );

    render(
      <ValidateAccountAssociation
        accountAssociation={mockAccountAssociation}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(`❌ ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('should handle non-Error rejection', async () => {
    vi.spyOn(useValidateManifestModule, 'useValidateManifest').mockReturnValue(
      () => Promise.reject('Unknown error'),
    );

    render(
      <ValidateAccountAssociation
        accountAssociation={mockAccountAssociation}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText('❌ Manifest validation failed'),
      ).toBeInTheDocument();
    });
  });
});
