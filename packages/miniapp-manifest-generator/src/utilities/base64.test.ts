import { describe, it, expect } from 'vitest';
import { decodeSignature, fromBase64Url, toBase64Url } from './base64';

describe('toBase64Url', () => {
  it('should encode basic strings', () => {
    expect(toBase64Url('hello')).toBe('aGVsbG8');
  });

  it('should handle empty string', () => {
    expect(toBase64Url('')).toBe('');
  });

  it('should handle special characters', () => {
    expect(toBase64Url('hello+world')).toBe('aGVsbG8rd29ybGQ');
  });

  it('should handle JSON strings', () => {
    const jsonStr = JSON.stringify({ key: 'value' });
    expect(toBase64Url(jsonStr)).toBe('eyJrZXkiOiJ2YWx1ZSJ9');
  });
});

describe('fromBase64Url', () => {
  it('should decode basic strings', () => {
    expect(fromBase64Url('aGVsbG8')).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(fromBase64Url('')).toBe('');
  });

  it('should handle special characters', () => {
    expect(fromBase64Url('aGVsbG8rd29ybGQ')).toBe('hello+world');
  });

  it('should handle JSON strings', () => {
    const jsonStr = JSON.stringify({ key: 'value' });
    expect(fromBase64Url('eyJrZXkiOiJ2YWx1ZSJ9')).toBe(jsonStr);
  });
});

describe('decodeSignature', () => {
  const bytes = Array.from({ length: 65 }, (_, i) => (i * 7) % 256);
  const hex = `0x${bytes.map((b) => b.toString(16).padStart(2, '0')).join('')}`;
  const asRawBytes = toBase64Url(String.fromCharCode(...bytes));
  const asHexText = toBase64Url(hex);

  it('should decode base64url of the raw signature bytes', () => {
    expect(decodeSignature(asRawBytes)).toBe(hex);
  });

  it('should decode base64url of the ASCII "0x..." string', () => {
    expect(decodeSignature(asHexText)).toBe(hex);
  });

  it('should decode both encodings of one signature to the same hex', () => {
    expect(decodeSignature(asRawBytes)).toBe(decodeSignature(asHexText));
  });

  it('should preserve a long smart-account signature', () => {
    // ERC-6492 wrapped signatures run to a few hundred bytes and end in the magic
    // suffix. They must survive decoding intact rather than being truncated or rejected.
    const magic = '6492'.repeat(16);
    const long = `0x${'ab'.repeat(200)}${magic}`;
    expect(decodeSignature(toBase64Url(long))).toBe(long);
  });

  it('should not mistake a non-hex payload for hex text', () => {
    const raw = String.fromCharCode(0x30, 0x78, 0x9f, 0x01); // starts with "0x", not hex
    expect(decodeSignature(toBase64Url(raw))).toBe('0x30789f01');
  });
});
