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

  it('renders with two basic buttons', () => {
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

  it('renders with all buttons', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        buttons={[
          { label: 'button1' },
          { label: 'button2', action: 'post_redirect' },
          { label: 'button3', action: 'mint', target: 'https://zizzamia.xyz/api/frame/mint' },
          { label: 'button4', action: 'link', target: 'https://zizzamia.xyz/api/frame/link' },
        ]}
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
    // Button 3
    expect(meta.container.querySelector('meta[property="fc:frame:button:3"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:3"]')?.getAttribute('content'),
    ).toBe('button3');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:3:action"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:3:action"]')
        ?.getAttribute('content'),
    ).toBe('mint');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:3:target"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:3:target"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/mint');
    // Button 4
    expect(meta.container.querySelector('meta[property="fc:frame:button:4"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:4"]')?.getAttribute('content'),
    ).toBe('button4');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:4:action"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:4:action"]')
        ?.getAttribute('content'),
    ).toBe('link');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:4:target"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:4:target"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/link');
    // Length
    expect(meta.container.querySelectorAll('meta').length).toBe(11);
  });

  it('renders with post_url', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" postUrl="https://example.com" />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:post_url"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:post_url"]')?.getAttribute('content'),
    ).toBe('https://example.com');
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });

  it('renders with refresh_period', () => {
    const meta = render(<FrameMetadata image="https://example.com/image.png" refreshPeriod={10} />);
    expect(meta.container.querySelector('meta[property="fc:frame:refresh_period"]')).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:refresh_period"]')
        ?.getAttribute('content'),
    ).toBe('10');
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });

  it('renders with wrapper', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        wrapper={({ children }) => <div id="wrapper">{children}</div>}
      />,
    );

    expect(meta.container.querySelector('#wrapper')).not.toBeNull();
    expect(meta.container.querySelector('meta[property="fc:frame:image"]')).not.toBeNull();
    expect(meta.container.querySelectorAll('meta').length).toBe(2);
  });

  it('renders with action mint', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        buttons={[
          {
            label: 'Mint',
            action: 'mint',
            target: 'https://zizzamia.xyz/api/frame/mint',
          },
        ]}
      />,
    );
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:1:action"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:1:action"]')
        ?.getAttribute('content'),
    ).toBe('mint');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:1:target"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:1:target"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/mint');
    expect(meta.container.querySelectorAll('meta').length).toBe(5);
  });

  it('renders with action link', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        buttons={[
          {
            label: 'Link',
            action: 'link',
            target: 'https://zizzamia.xyz/api/frame/link',
          },
        ]}
      />,
    );
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:1:action"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:1:action"]')
        ?.getAttribute('content'),
    ).toBe('link');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:1:target"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:1:target"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/link');
    expect(meta.container.querySelectorAll('meta').length).toBe(5);
  });

  it('should not render action target if action is not link or mint', () => {
    const meta = render(
      <FrameMetadata
        image="image"
        buttons={[{ label: 'button1', action: 'post' }]}
        postUrl="post_url"
      />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:button:1:target"')).toBeNull();
    expect(meta.container.querySelectorAll('meta').length).toBe(5);
  });
});
