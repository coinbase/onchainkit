import { describe, expect, it, vi } from 'vitest';
import { generateUUIDWithInsecureFallback } from './crypto';

describe('generateUUIDWithInsecureFallback', () => {
  it('should generate a UUID when crypto is defined', () => {
    vi.mock('crypto', () => ({
      randomUUID: vi.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
    }));

    const uuid = generateUUIDWithInsecureFallback();
    expect(uuid).toBeDefined();
    expect(uuid.length).toBe(36);
  });

  it('should generate a UUID when crypto is not defined', () => {
    vi.mock('crypto', () => ({
      randomUUID: undefined,
    }));

    const uuid = generateUUIDWithInsecureFallback();
    expect(uuid).toBeDefined();
    expect(uuid.length).toBe(36);
  });
});
