import { describe, expect, it, vi } from 'vitest';
import { generateUUIDWithInsecureFallback } from './crypto';
import { beforeEach } from 'node:test';

describe('generateUUIDWithInsecureFallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a UUID when crypto is defined', () => {
    vi.mock('crypto', () => ({
      randomUUID: vi.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
    }));

    const uuid = generateUUIDWithInsecureFallback();
    expect(uuid).toBeDefined();
    expect(uuid.length).toBe(36);
  });

  it('should generate a UUID when crypto is not defined', () => {
    vi.stubGlobal('crypto', {
      randomUUID: undefined,
      getRandomValues: () => new Uint8Array(16),
    });

    const uuid = generateUUIDWithInsecureFallback();
    expect(uuid).toBeDefined();
    expect(uuid.length).toBe(36);
  });
});
