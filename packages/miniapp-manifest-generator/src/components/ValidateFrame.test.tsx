import { render, screen } from '@testing-library/react';
import { ValidateFrame } from './ValidateFrame';
import { describe, expect, it } from 'vitest';

const validFrame = {
  version: 'next',
  name: 'Test Frame',
  homeUrl: 'https://example.com',
  iconUrl: 'https://example.com/icon.png',
  imageUrl: 'https://example.com/image.png',
  buttonTitle: 'Launch Test',
};

const invalidFrame = {
  version: '2.0', // invalid version
  name: '', // empty name
  homeUrl: 'https://example.com',
  iconUrl: 'https://example.com/icon.png',
  imageUrl: 'https://example.com/image.png',
  buttonTitle: 'x'.repeat(33), // too long
};

const frameWithOptionals = {
  ...validFrame,
  splashImageUrl: 'https://example.com/splash.png',
  splashBackgroundColor: '#123456',
  webhookUrl: 'https://example.com/webhook',
};

const frameWithInvalidOptionals = {
  ...validFrame,
  splashBackgroundColor: 'not-a-hex-color',
};

describe('ValidateFrame', () => {
  it('should show valid state for correct frame', () => {
    render(<ValidateFrame frame={validFrame} />);

    const asterisks = screen.getAllByText('*');
    expect(asterisks).toHaveLength(6);

    const checkmarks = screen.getAllByText('✅');
    expect(checkmarks).toHaveLength(6);

    expect(
      screen.getByText('✅ Your frame configuration is valid!'),
    ).toBeInTheDocument();
  });

  it('should show errors for invalid frame', () => {
    render(<ValidateFrame frame={invalidFrame} />);

    expect(
      screen.getByText('Version must be either "next" or start with "1."'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Name is required and max length is 32 characters'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Button title is required and max length is 32 characters',
      ),
    ).toBeInTheDocument();

    const xMarks = screen.getAllByText('❌');
    expect(xMarks).toHaveLength(3);

    expect(
      screen.queryByText('✅ Your frame configuration is valid!'),
    ).not.toBeInTheDocument();
  });

  it('should validate optional fields when provided', () => {
    render(<ValidateFrame frame={frameWithOptionals} />);

    const checkmarks = screen.getAllByText('✅');
    expect(checkmarks).toHaveLength(9); // 6 required + 3 optional

    expect(
      screen.getByText('✅ Your frame configuration is valid!'),
    ).toBeInTheDocument();
  });

  it('should show errors for invalid optional fields', () => {
    render(<ValidateFrame frame={frameWithInvalidOptionals} />);

    expect(
      screen.getByText('Splash background color must be a valid hex color'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('✅ Your frame configuration is valid!'),
    ).not.toBeInTheDocument();
  });

  it('should show required fields indicator', () => {
    render(<ValidateFrame frame={validFrame} />);
    expect(
      screen.getByText('* marked fields are required'),
    ).toBeInTheDocument();
  });
});
