import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { useZodValidator } from './useZodValidator';

describe('useZodValidator', () => {
  const testSchema = z.object({
    version: z.literal('next'),
    imageUrl: z.string().url(),
    aspectRatio: z.union([z.literal('1:1'), z.literal('3:2')]).optional(),
    button: z.object({
      title: z.string(),
      action: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('launch_frame'),
          name: z.string(),
          url: z.string().url(),
          splashImageUrl: z.string().url().optional(),
          splashBackgroundColor: z.string().optional(),
        }),
        z.object({
          type: z.literal('view_token'),
          token: z.string(),
        }),
      ]),
    }),
  });

  it('validates correct data structure', () => {
    const data = {
      version: 'next',
      imageUrl: 'https://example.com/image.png',
      aspectRatio: '1:1',
      button: {
        title: 'Click me',
        action: {
          type: 'launch_frame',
          name: 'My Frame',
          url: 'https://example.com',
          splashImageUrl: 'https://example.com/splash.png',
          splashBackgroundColor: '#FFFFFF',
        },
      },
    };

    const result = useZodValidator(testSchema, data);
    expect(result.valid).toBe(true);
    expect(result.data).toContainEqual({
      path: 'version',
      required: true,
      value: 'next',
      errors: undefined,
    });
  });

  it('detects invalid data', () => {
    const data = {
      version: 'invalid',
      imageUrl: 'not-a-url',
      button: {
        title: 'Click me',
        action: {
          type: 'launch_frame',
          name: 'My Frame',
          url: 'not-a-url',
        },
      },
    };

    const result = useZodValidator(testSchema, data);
    expect(result.valid).toBe(false);
    expect(result.data.find((f) => f.path === 'version')?.errors).toBeDefined();
    expect(
      result.data.find((f) => f.path === 'imageUrl')?.errors,
    ).toBeDefined();
    expect(
      result.data.find((f) => f.path === 'button.action.url')?.errors,
    ).toBeDefined();
  });

  it('handles discriminated unions correctly', () => {
    const data = {
      version: 'next',
      imageUrl: 'https://example.com/image.png',
      button: {
        title: 'View Token',
        action: {
          type: 'view_token',
          token: 'eip155:1/erc721:0x123/1',
        },
      },
    };

    const result = useZodValidator(testSchema, data);
    expect(result.valid).toBe(true);
    expect(result.data.some((f) => f.path === 'button.action.token')).toBe(
      true,
    );
    expect(
      result.data.find((f) => f.path === 'button.action.type')?.value,
    ).toBe('view_token');
    expect(result.data.some((f) => f.path === 'button.action.url')).toBe(false);
  });

  it('handles discriminated unions with invalid data', () => {
    const data = {
      version: 'next',
      imageUrl: 'https://example.com/image.png',
      button: {
        title: 'View Token',
        action: {
          type: 'invalid_type',
          token: 'invalid-token',
        },
      },
    };

    const result = useZodValidator(testSchema, data);
    expect(result.valid).toBe(false);
    expect(
      result.data.find((f) => f.path === 'button.action.type')?.errors,
    ).toBeDefined();
  });

  it('handles optional fields correctly', () => {
    const data = {
      version: 'next',
      imageUrl: 'https://example.com/image.png',
      button: {
        title: 'Click me',
        action: {
          type: 'launch_frame',
          name: 'My Frame',
          url: 'https://example.com',
          // omitting optional fields splashImageUrl and splashBackgroundColor
        },
      },
    };

    const result = useZodValidator(testSchema, data);
    expect(result.valid).toBe(true);
    expect(result.data.find((f) => f.path === 'aspectRatio')?.required).toBe(
      false,
    );
    expect(
      result.data.find((f) => f.path === 'button.action.splashImageUrl')
        ?.required,
    ).toBe(false);
  });
});
