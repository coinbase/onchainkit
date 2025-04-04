import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAttestations } from '@/identity/hooks/useAttestations';
import { base } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnchainKit } from '../../useOnchainKit';
import { Badge } from './Badge';
import { useIdentityContext } from './IdentityProvider';

vi.mock('@/identity/hooks/useAttestations');
vi.mock('./IdentityProvider');
vi.mock('../../useOnchainKit');

describe('Badge Component', () => {
  const badgeStyle = 'height: 12px; width: 12px';

  beforeEach(() => {
    vi.mocked(useIdentityContext).mockReturnValue({
      address: '0x123',
      schemaId: '0xschema',
    });

    vi.mocked(useOnchainKit).mockReturnValue({
      address: null,
      apiKey: null,
      chain: base,
      rpcUrl: null,
      schemaId: null,
      projectId: null,
      sessionId: null,
      config: {
        appearance: {},
      },
    });

    vi.mocked(useAttestations).mockReturnValue([]);
  });

  it('should render the svg', async () => {
    render(<Badge />);

    await waitFor(() => {
      const inner = screen.queryByTestId('ockBadge');
      expect(inner).toBeInTheDocument();
    });
  });

  it('should render the default svg with a blue background and no border', async () => {
    render(<Badge />);

    await waitFor(() => {
      const badge = screen.queryByTestId('ockBadge');
      expect(badge).toHaveStyle(badgeStyle);
      expect(badge).toHaveClass('ock-bg-primary');
      const ticker = screen.queryByTestId('ock-badgeSvg');
      expect(ticker).toHaveClass('ock-icon-color-inverse');
    });
  });

  it('should not show tooltip when tooltip is false', async () => {
    render(<Badge tooltip={false} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.queryByTestId('ockBadgeTooltip')).not.toBeInTheDocument();
  });

  it('should show tooltip with default content when tooltip is true', async () => {
    render(<Badge tooltip={true} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.getByTestId('ockBadgeTooltip')).toBeInTheDocument();
    expect(screen.getByTestId('ockBadgeTooltip')).toHaveTextContent('Verified');
  });

  it('should show tooltip with custom text when tooltip is a string', async () => {
    render(<Badge tooltip="Custom tooltip" />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.getByTestId('ockBadgeTooltip')).toBeInTheDocument();
    expect(screen.getByTestId('ockBadgeTooltip')).toHaveTextContent(
      'Custom tooltip',
    );
  });

  it('should not show tooltip when mouse leaves', async () => {
    render(<Badge tooltip={true} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);
    expect(screen.getByTestId('ockBadgeTooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(badge);
    expect(screen.queryByTestId('ockBadgeTooltip')).not.toBeInTheDocument();
  });

  it('should apply custom className', async () => {
    render(<Badge className="custom-class" />);

    const badge = await screen.findByTestId('ockBadge');
    expect(badge).toHaveClass('custom-class');
  });

  it('should use attestation name when available and tooltip is true', async () => {
    vi.mocked(useAttestations).mockReturnValue([
      {
        decodedDataJson: JSON.stringify({ attestation: 'Coinbase Verified' }),
        id: '1',
        attester: '0x456',
        expirationTime: 0,
        recipient: '0x123',
        revocationTime: 0,
        revoked: false,
        schemaId: '0xschema',
        time: 123456789,
      },
    ]);

    render(<Badge tooltip={true} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.getByTestId('ockBadgeTooltip')).toHaveTextContent(
      'Coinbase Verified',
    );
  });

  it('should handle complex attestation data structure', async () => {
    vi.mocked(useAttestations).mockReturnValue([
      {
        decodedDataJson: JSON.stringify({
          verification: {
            name: 'verification',
            type: 'string',
            signature: 'xyz',
            value: 'Base Verified',
          },
        }),
        id: '1',
        attester: '0x456',
        expirationTime: 0,
        recipient: '0x123',
        revocationTime: 0,
        revoked: false,
        schemaId: '0xschema',
        time: 123456789,
      },
    ]);

    render(<Badge tooltip={true} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.getByTestId('ockBadgeTooltip')).toHaveTextContent(
      'Base Verified',
    );
  });

  it('should handle array-formatted attestation data', async () => {
    vi.mocked(useAttestations).mockReturnValue([
      {
        decodedDataJson: JSON.stringify([
          {
            name: 'Array Attestation',
            type: 'string',
            signature: 'abc',
            value: 'Value not used',
          },
        ]),
        id: '1',
        attester: '0x789',
        expirationTime: 0,
        recipient: '0x123',
        revocationTime: 0,
        revoked: false,
        schemaId: '0xschema',
        time: 123456789,
      },
    ]);

    render(<Badge tooltip={true} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.getByTestId('ockBadgeTooltip')).toHaveTextContent(
      'Array Attestation',
    );
  });

  it('should handle JSON parsing errors gracefully', async () => {
    vi.mocked(useAttestations).mockReturnValue([
      {
        decodedDataJson: 'invalid-json',
        id: '1',
        attester: '0x456',
        expirationTime: 0,
        recipient: '0x123',
        revocationTime: 0,
        revoked: false,
        schemaId: '0xschema',
        time: 123456789,
      },
    ]);

    render(<Badge tooltip={true} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.getByTestId('ockBadgeTooltip')).toHaveTextContent('Verified');
  });

  it('should use context schemaId if tooltip is enabled', async () => {
    vi.mocked(useIdentityContext).mockReturnValue({
      address: '0x123',
      schemaId: '0xcontextSchema',
    });

    vi.mocked(useOnchainKit).mockReturnValue({
      address: null,
      apiKey: null,
      chain: base,
      rpcUrl: null,
      schemaId: '0xkitSchema',
      projectId: null,
      sessionId: null,
      config: {
        appearance: {},
      },
    });

    render(<Badge tooltip={true} />);

    expect(useAttestations).toHaveBeenCalledWith({
      address: '0x123',
      chain: base,
      schemaId: '0xcontextSchema',
    });
  });

  it('should pass null schemaId when tooltip is disabled', async () => {
    vi.mocked(useIdentityContext).mockReturnValue({
      address: '0x123',
      schemaId: '0xcontextSchema',
    });

    vi.mocked(useOnchainKit).mockReturnValue({
      address: null,
      apiKey: null,
      chain: base,
      rpcUrl: null,
      schemaId: '0xkitSchema',
      projectId: null,
      sessionId: null,
      config: {
        appearance: {},
      },
    });

    render(<Badge tooltip={false} />);

    expect(useAttestations).toHaveBeenCalledWith({
      address: '0x123',
      chain: base,
      schemaId: null,
    });
  });

  it('should fall back to kit schemaId if context schemaId is not available and tooltip is enabled', async () => {
    vi.mocked(useIdentityContext).mockReturnValue({
      address: '0x123',
      schemaId: null,
    });

    vi.mocked(useOnchainKit).mockReturnValue({
      address: null,
      apiKey: null,
      chain: base,
      rpcUrl: null,
      schemaId: '0xkitSchema',
      projectId: null,
      sessionId: null,
      config: {
        appearance: {},
      },
    });

    render(<Badge tooltip={true} />);

    expect(useAttestations).toHaveBeenCalledWith({
      address: '0x123',
      chain: base,
      schemaId: '0xkitSchema',
    });
  });

  it('should display default "Verified" text when no attestation is available', async () => {
    vi.mocked(useAttestations).mockReturnValue([]);

    render(<Badge tooltip={true} />);

    const badge = await screen.findByTestId('ockBadge');
    fireEvent.mouseEnter(badge);

    expect(screen.getByTestId('ockBadgeTooltip')).toHaveTextContent('Verified');
  });
});
