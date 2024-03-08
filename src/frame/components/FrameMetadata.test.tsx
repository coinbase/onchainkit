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
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });

  it('renders with image src', () => {
    const meta = render(<FrameMetadata image={{ src: 'https://example.com/image.png' }} />);
    expect(
      meta.container.querySelector('meta[property="fc:frame:image"]')?.getAttribute('content'),
    ).toBe('https://example.com/image.png');
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });

  it('renders with image aspect ratio', () => {
    const meta = render(
      <FrameMetadata image={{ src: 'https://example.com/image.png', aspectRatio: '1:1' }} />,
    );
    expect(
      meta.container.querySelector('meta[property="fc:frame:image:aspect_ratio"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:image:aspect_ratio"]')
        ?.getAttribute('content'),
    ).toBe('1:1');
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
  });

  it('renders with input', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" input={{ text: 'test' }} />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:input:text"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:input:text"]')?.getAttribute('content'),
    ).toBe('test');
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
  });

  it('renders with state', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" state={{ counter: 1 }} />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:state"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:state"]')?.getAttribute('content'),
    ).toBe('%7B%22counter%22%3A1%7D');
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
  });

  it('renders with state when Cross Site Scripting occur', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        state={{ counter: 1, xss: '<script>' }}
      />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:state"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:state"]')?.getAttribute('content'),
    ).toBe('%7B%22counter%22%3A1%2C%22xss%22%3A%22%3Cscript%3E%22%7D');
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
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
    expect(meta.container.querySelectorAll('meta').length).toBe(6);
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
    expect(meta.container.querySelectorAll('meta').length).toBe(12);
  });

  it('renders with post_url', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" postUrl="https://example.com" />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:post_url"]')).not.toBeNull();
    expect(
      meta.container.querySelector('meta[property="fc:frame:post_url"]')?.getAttribute('content'),
    ).toBe('https://example.com');
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
  });

  it('renders with refresh_period', () => {
    const meta = render(<FrameMetadata image="https://example.com/image.png" refreshPeriod={10} />);
    expect(meta.container.querySelector('meta[property="fc:frame:refresh_period"]')).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:refresh_period"]')
        ?.getAttribute('content'),
    ).toBe('10');
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
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
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
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
    expect(meta.container.querySelectorAll('meta').length).toBe(6);
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
    expect(meta.container.querySelectorAll('meta').length).toBe(6);
  });

  it('renders with action tx', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        buttons={[
          {
            label: 'TX',
            action: 'tx',
            target: 'https://zizzamia.xyz/api/frame/tx',
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
    ).toBe('tx');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:1:target"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:1:target"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/tx');
    expect(meta.container.querySelectorAll('meta').length).toBe(6);
  });

  it('renders with action tx with post_url', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        buttons={[
          {
            label: 'TX',
            action: 'tx',
            target: 'https://zizzamia.xyz/api/frame/tx',
            postUrl: 'https://zizzamia.xyz/api/frame/tx-post-url',
          },
          {
            label: 'TX',
            action: 'tx',
            target: 'https://zizzamia.xyz/api/frame/tx2',
            postUrl: 'https://zizzamia.xyz/api/frame/tx-post-url2',
          },
          {
            label: 'TX',
            action: 'tx',
            target: 'https://zizzamia.xyz/api/frame/tx3',
            postUrl: 'https://zizzamia.xyz/api/frame/tx-post-url3',
          },
          {
            label: 'TX',
            action: 'tx',
            target: 'https://zizzamia.xyz/api/frame/tx4',
            postUrl: 'https://zizzamia.xyz/api/frame/tx-post-url4',
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
    ).toBe('tx');
    expect(
      meta.container.querySelector('meta[property="fc:frame:button:1:post_url"]'),
    ).not.toBeNull();
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:1:post_url"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/tx-post-url');
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:2:post_url"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/tx-post-url2');
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:3:post_url"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/tx-post-url3');
    expect(
      meta.container
        .querySelector('meta[property="fc:frame:button:4:post_url"]')
        ?.getAttribute('content'),
    ).toBe('https://zizzamia.xyz/api/frame/tx-post-url4');
    expect(meta.container.querySelectorAll('meta').length).toBe(19);
  });

  it('should not render action target if action is not link or mint', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        buttons={[{ label: 'button1', action: 'post' }]}
        postUrl="post_url"
      />,
    );
    expect(meta.container.querySelector('meta[property="fc:frame:button:1:target"')).toBeNull();
    expect(meta.container.querySelectorAll('meta').length).toBe(6);
  });

  it('should set og:description', () => {
    const meta = render(
      <FrameMetadata
        image="https://example.com/image.png"
        ogDescription="This is the description"
      />,
    );
    expect(
      meta.container.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    ).toBe('This is the description');
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
  });

  it('should set og:title', () => {
    const meta = render(
      <FrameMetadata image="https://example.com/image.png" ogTitle="This is the title" />,
    );
    expect(meta.container.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'This is the title',
    );
    expect(meta.container.querySelectorAll('meta').length).toBe(4);
  });

  it('should not render og:description and og:title if not provided', () => {
    const meta = render(<FrameMetadata image="https://example.com/image.png" />);
    expect(meta.container.querySelector('meta[property="og:description"]')).toBeNull();
    expect(meta.container.querySelector('meta[property="og:title"]')).toBeNull();
    expect(meta.container.querySelectorAll('meta').length).toBe(3);
  });
});
