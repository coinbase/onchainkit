/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { FrameMetadata } from './FrameMetadata';

describe('FrameMetadata', () => {
  it('renders', () => {
    expect(FrameMetadata).toBeDefined();
  });

  it('renders with image', () => {
    const meta = render(<FrameMetadata image="https://example.com/image.png" />);
    expect(
      meta.container.querySelector('meta[property="fc:frame:image"]')?.getAttribute('content'),
    ).toBe('https://example.com/image.png');
    expect(meta.container.querySelectorAll('meta').length).toBe(2);
  });

  it('renders with input', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" input={{ text: 'test' }} />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:input:text"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:input:text"]')?.getAttribute('content'),
    ).toBe('test');
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });

  it('renders with buttons', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        buttons={[{ label: 'button1' }, { label: 'button2', action: 'post_redirect' }]}
      />,
    );
    // Button 1
    expect(meta.container.querySelector('meta[property="fc:frame:button:1"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:1"]')?.getAttribute('content'),
    ).toBe('button1');
    expect(meta.container.querySelector('meta[property="fc:frame:button:1:action"]')).toBeNull();
    // Button 2
    expect(meta.container.querySelector('meta[property="fc:frame:button:2"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:2"]')?.getAttribute('content'),
    ).toBe('button2');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:2:action"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:2:action"]')
        ?.getAttribute('content'),
    ).toBe('post_redirect');
    // Length
    expect(meta.container.querySelectorAll('meta').length).toBe(5);
  });

  it('renders with post_url', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" post_url="https://example.com" />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:post_url"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:post_url"]')?.getAttribute('content'),
    ).toBe('https://example.com');
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });

  it('renders with refresh_period', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" refresh_period={10} />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:refresh_period"]')).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:refresh_period"]')
        ?.getAttribute('content'),
    ).toBe('10');
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });
});
