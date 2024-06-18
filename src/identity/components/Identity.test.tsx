/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from './Avatar';
import { Name } from './Name';
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

  it('should render the Identity component with Avatar', async () => {
    (useAvatar as jest.Mock).mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    (useName as jest.Mock).mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Avatar />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Name', async () => {
    (useName as jest.Mock).mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Name />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar and Name', async () => {
    (useAvatar as jest.Mock).mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    (useName as jest.Mock).mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
    });
  });
});
