import { queryHelpers } from '@testing-library/react';
import { FrameMetadata } from './FrameMetadata';

describe('FrameMetadata', () => {
  it('renders', () => {
    expect(FrameMetadata).toBeDefined();
  });

  it('renders with image', () => {
    const meta = FrameMetadata({
      image: 'https://example.com/image.png',
    });
  });
});