/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from './Avatar';
import { Identity } from './Identity';
import { useName } from '../hooks/useName';
import { useAvatar } from '../hooks/useAvatar';

jest.mock('../hooks/useAvatar', () => ({
  useAvatar: jest.fn(),
}));

jest.mock('../hooks/useName', () => ({
  useName: jest.fn(),
}));

describe('Identity Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Identity component', async () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    render(
      <Identity address="0x123456789">
        <Avatar />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockIdentity_container')).toBeInTheDocument();
    });
  });
});
