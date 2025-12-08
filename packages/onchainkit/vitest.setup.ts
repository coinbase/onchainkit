// https://github.com/testing-library/jest-dom#with-vitest
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.stubGlobal('matchMedia', (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

vi.mock('./src/version', () => ({
  version: '0.0.1',
}));

// Override the classname prefix to be empty string in tests
vi.stubGlobal('__CLASSNAME_PREFIX__', '');
