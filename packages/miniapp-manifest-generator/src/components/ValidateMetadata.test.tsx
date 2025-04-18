import { render, screen } from '@testing-library/react';
import { ValidateMetadata } from './ValidateMetadata';
import { describe, expect, it } from 'vitest';
import { FrameMetadata } from '../types';

const validMetadata = {
  version: 'next',
  imageUrl: 'https://example.com/image.png',
  button: {
    title: 'Click me',
    action: {
      type: 'launch_frame' as FrameMetadata['button']['action']['type'],
      url: 'https://example.com/action',
    },
  },
};

const invalidMetadata = {
  version: '2.0', // invalid version
  imageUrl: '', // empty url
  button: {
    title: 'x'.repeat(33), // too long
    action: {
      type: 'invalid_type' as FrameMetadata['button']['action']['type'],
    },
  },
};

const metadataWithOptionals = {
  ...validMetadata,
  button: {
    title: 'Mint NFT',
    action: {
      type: 'launch_frame' as FrameMetadata['button']['action']['type'],
      url: 'https://example.com/mint',
      name: 'test-action',
      splashImageUrl: 'https://example.com/splash.png',
      splashBackgroundColor: '#123456',
    },
  },
};

const metadataWithInvalidOptionals = {
  ...validMetadata,
  button: {
    title: 'Invalid title',
    action: {
      type: 'invalid_action' as FrameMetadata['button']['action']['type'],
      splashBackgroundColor: 'not-a-hex-color',
    },
  },
};

describe('ValidateMetadata', () => {
  it('should show valid state for correct metadata', () => {
    render(<ValidateMetadata metadata={validMetadata} />);

    const asterisks = screen.getAllByText('*');
    expect(asterisks).toHaveLength(4); // version, imageUrl, button.title, button.action.type

    const checkmarks = screen.getAllByText('✅');
    expect(checkmarks).toHaveLength(5);

    expect(
      screen.getByText('✅ Your frame metadata is valid!'),
    ).toBeInTheDocument();
  });

  it('should show errors for invalid metadata', () => {
    render(<ValidateMetadata metadata={invalidMetadata} />);

    expect(
      screen.getByText('Version must be "1" or "next"'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Image URL is required and max length is 1024 characters',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Button title is required and max length is 32 characters',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Action type is required and max length is 32 characters',
      ),
    ).toBeInTheDocument();

    const xMarks = screen.getAllByText('❌');
    expect(xMarks).toHaveLength(2);

    expect(
      screen.queryByText('✅ Your frame metadata is valid!'),
    ).not.toBeInTheDocument();
  });

  it('should validate optional fields when provided', () => {
    render(<ValidateMetadata metadata={metadataWithOptionals} />);

    const checkmarks = screen.getAllByText('✅');
    expect(checkmarks).toHaveLength(8); // 4 required + 3 optional + valid text

    expect(
      screen.getByText('✅ Your frame metadata is valid!'),
    ).toBeInTheDocument();
  });

  it.only('should show errors for invalid optional fields', () => {
    render(<ValidateMetadata metadata={metadataWithInvalidOptionals} />);

    expect(
      screen.getByText(
        'Action type must be one of: post, link, post_redirect, mint, tx',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('✅ Your frame metadata is valid!'),
    ).not.toBeInTheDocument();
  });

  it('should show required fields indicator', () => {
    render(<ValidateMetadata metadata={validMetadata} />);
    expect(
      screen.getByText('* marked fields are required'),
    ).toBeInTheDocument();
  });
});
