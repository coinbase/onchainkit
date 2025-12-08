import { describe, expect, it } from 'vitest';
import { multiplyFloats } from './multiplyFloats';

describe('multiplyFloats', () => {
  it('multiplies small floats', () => {
    expect(multiplyFloats(0.0051, 3)).toEqual(0.0153);
  });

  it('multiplies two small floats', () => {
    expect(multiplyFloats(0.0051, 0.003)).toEqual(0.0000153);
  });

  it('multiplies two positive floats', () => {
    expect(multiplyFloats(1.2, 3.4)).toEqual(4.08);
  });

  it('multiplies multiple positive floats', () => {
    expect(multiplyFloats(1.2, 3.4, 2.5)).toEqual(10.2);
  });

  it('multiplies positive and negative floats', () => {
    expect(multiplyFloats(1.2, -3.4)).toEqual(-4.08);
  });

  it('multiplies multiple negative floats', () => {
    expect(multiplyFloats(-1.2, -3.4)).toEqual(4.08);
  });

  it('multiplies floats with different decimal places', () => {
    expect(multiplyFloats(1.23, 4.567)).toEqual(5.61741);
  });

  it('multiplies by zero', () => {
    expect(multiplyFloats(1.2, 0)).toEqual(0);
  });

  it('multiplies with one number', () => {
    expect(multiplyFloats(1.2)).toEqual(1.2);
  });

  it('multiplies with no numbers', () => {
    expect(multiplyFloats()).toEqual(1);
  });
});
