// https://github.com/testing-library/jest-dom#with-vitest
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('./src/version', () => ({
  version: '0.0.1',
}));
