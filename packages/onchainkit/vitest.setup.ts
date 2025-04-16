import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
// https://github.com/testing-library/jest-dom#with-vitest

vi.mock('./src/version', () => ({
  version: '0.0.1',
}));
