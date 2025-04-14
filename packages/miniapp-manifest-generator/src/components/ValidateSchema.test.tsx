import { render, screen } from '@testing-library/react';
import { ValidateSchema } from './ValidateSchema';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import * as useZodValidatorModule from '../hooks/useZodValidator';

describe('ValidateSchema', () => {
  const testSchema = z.object({
    version: z.literal('next'),
    imageUrl: z.string().url(),
    button: z.object({
      title: z.string(),
      action: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('launch_frame'),
          name: z.string(),
          url: z.string().url(),
        }),
        z.object({
          type: z.literal('view_token'),
          token: z.string(),
        }),
      ]),
    }),
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders valid data correctly', () => {
    vi.spyOn(useZodValidatorModule, 'useZodValidator').mockReturnValue({
      data: [
        { path: 'version', value: 'next', required: true, errors: [] },
        {
          path: 'imageUrl',
          value: 'https://example.com/image.png',
          required: true,
          errors: [],
        },
        {
          path: 'button.title',
          value: 'Click me',
          required: true,
          errors: [],
        },
        {
          path: 'button.action.type',
          value: 'launch_frame',
          required: true,
          errors: [],
        },
        {
          path: 'button.action.name',
          value: 'My Frame',
          required: true,
          errors: [],
        },
        {
          path: 'button.action.url',
          value: 'https://example.com',
          required: true,
          errors: [],
        },
      ],
      valid: true,
    });

    render(<ValidateSchema schema={testSchema} schemaData={{}} />);

    expect(screen.getByText('version:')).toBeInTheDocument();
    expect(screen.getByText('next')).toBeInTheDocument();
    expect(
      screen.getByText('✅ Your frame metadata is valid!'),
    ).toBeInTheDocument();
  });

  it('shows errors for missing required fields', () => {
    vi.spyOn(useZodValidatorModule, 'useZodValidator').mockReturnValue({
      data: [
        {
          path: 'version',
          value: undefined,
          required: true,
          errors: ['Missing version'],
        },
      ],
      valid: false,
    });

    render(<ValidateSchema schema={testSchema} schemaData={{}} />);

    expect(screen.getByText('not set')).toBeInTheDocument();
    expect(screen.getByText('Missing version')).toBeInTheDocument();
    expect(
      screen.queryByText('✅ Your frame metadata is valid!'),
    ).not.toBeInTheDocument();
  });

  it('shows errors for invalid data', () => {
    vi.spyOn(useZodValidatorModule, 'useZodValidator').mockReturnValue({
      data: [
        {
          path: 'version',
          value: 'invalid',
          required: true,
          errors: ['Invalid version'],
        },
        {
          path: 'imageUrl',
          value: 'not-a-url',
          required: true,
          errors: ['Invalid image URL'],
        },
        {
          path: 'button.action.url',
          value: 'not-a-url',
          required: true,
          errors: ['Invalid URL'],
        },
      ],
      valid: false,
    });

    render(<ValidateSchema schema={testSchema} schemaData={{}} />);

    expect(screen.queryAllByText('❌')).toHaveLength(3);
    expect(screen.getByText('Invalid version')).toBeInTheDocument();
    expect(screen.getByText('Invalid image URL')).toBeInTheDocument();
    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
    expect(
      screen.queryByText('✅ Your frame metadata is valid!'),
    ).not.toBeInTheDocument();
  });

  it('shows required field indicators', () => {
    vi.spyOn(useZodValidatorModule, 'useZodValidator').mockReturnValue({
      data: [
        { path: 'version', value: 'next', required: true, errors: [] },
        {
          path: 'optional',
          value: undefined,
          required: false,
          errors: [],
        },
      ],
      valid: true,
    });

    render(<ValidateSchema schema={testSchema} schemaData={{}} />);

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(
      screen.getByText('* marked fields are required'),
    ).toBeInTheDocument();
  });

  it('skips rendering unset optional fields', () => {
    vi.spyOn(useZodValidatorModule, 'useZodValidator').mockReturnValue({
      data: [
        { path: 'required', value: 'value', required: true, errors: [] },
        {
          path: 'optional',
          value: undefined,
          required: false,
          errors: [],
        },
      ],
      valid: true,
    });

    render(<ValidateSchema schema={testSchema} schemaData={{}} />);

    expect(screen.getByText('required:')).toBeInTheDocument();
    expect(screen.queryByText('optional:')).not.toBeInTheDocument();
  });
});
