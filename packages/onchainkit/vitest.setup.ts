// https://github.com/testing-library/jest-dom#with-vitest
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('./src/version', () => ({
  version: '0.0.1',
}));

// Mock window.matchMedia for test environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
} else {
  // For environments where window doesn't exist, create a global mock
  const mockWindow = {
    matchMedia: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  Object.defineProperty(globalThis, 'window', {
    value: mockWindow,
    writable: true,
  });
}
