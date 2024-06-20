/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { WalletDropdown } from './WalletDropdown';
import { Avatar } from '../../identity/components/Avatar';
import { Identity } from '../../identity/components/Identity';
import { useName } from '../../identity/hooks/useName';
import { useAvatar } from '../../identity/hooks/useAvatar';

jest.mock('../../identity/hooks/useAvatar', () => ({
  useAvatar: jest.fn(),
}));

jest.mock('../../identity/hooks/useName', () => ({
  useName: jest.fn(),
}));

describe('WalletDropdown Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Identity component with Avatar', async () => {
    (useAvatar as jest.Mock).mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    (useName as jest.Mock).mockReturnValue({ data: 'name', isLoading: false });
    render(
      <WalletDropdown>
        <Identity address="0x123456789">
          <Avatar />
        </Identity>
      </WalletDropdown>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
    });
  });
});
