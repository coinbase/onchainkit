import { describe, expect, it } from 'vitest';
import {
  formatAmount,
  getTokens,
  TokenChip,
  TokenImage,
  TokenRow,
  TokenSearch,
  TokenSelectDropdown,
  TokenSelectModal,
} from './index'; // Adjust the path accordingly

describe('Module Exports', () => {
  it('should export TokenChip', () => {
    expect(TokenChip).toBeDefined();
  });

  it('should export TokenImage', () => {
    expect(TokenImage).toBeDefined();
  });

  it('should export TokenRow', () => {
    expect(TokenRow).toBeDefined();
  });

  it('should export TokenSearch', () => {
    expect(TokenSearch).toBeDefined();
  });

  it('should export TokenSelectDropdown', () => {
    expect(TokenSelectDropdown).toBeDefined();
  });

  it('should export TokenSelectModal', () => {
    expect(TokenSelectModal).toBeDefined();
  });

  it('should export formatAmount', () => {
    expect(formatAmount).toBeDefined();
  });

  it('should export getTokens', () => {
    expect(getTokens).toBeDefined();
  });
});
