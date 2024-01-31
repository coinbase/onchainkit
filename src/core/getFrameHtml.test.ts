import { getFrameHtml } from './getFrameHtml';

describe('getFrameHtml', () => {
  it('should return correct HTML with all parameters', () => {
    const html = getFrameHtml({
      buttons: [
        { label: 'button1', action: 'post' },
        { label: 'button2' },
        { label: 'button3', action: 'post_redirect' },
        { label: 'button4' },
      ],
      image: 'https://example.com/image.png',
      post_url: 'https://example.com/api/frame',
      refresh_period: 10,
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain('<meta property="fc:frame:button:1:action" content="post" />');
    expect(html).toContain('<meta property="fc:frame:button:2" content="button2" />');
    expect(html).toContain('<meta property="fc:frame:button:3" content="button3" />');
    expect(html).toContain('<meta property="fc:frame:button:3:action" content="post_redirect" />');
    expect(html).toContain('<meta property="fc:frame:button:4" content="button4" />');
    expect(html).toContain(
      '<meta property="fc:frame:post_url" content="https://example.com/api/frame" />',
    );
    expect(html).toContain('<meta property="fc:frame:refresh_period" content="10" />');
  });

  it('should handle no buttons', () => {
    const html = getFrameHtml({
      image: 'https://example.com/image.png',
      post_url: 'https://example.com/api/frame',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain(
      '<meta property="fc:frame:post_url" content="https://example.com/api/frame" />',
    );
    expect(html).not.toContain('fc:frame:button:');
  });

  it('should handle no post_url', () => {
    const html = getFrameHtml({
      buttons: [{ label: 'button1' }],
      image: 'https://example.com/image.png',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).not.toContain('fc:frame:post_url');
  });

  it('should handle no refresh_period', () => {
    const html = getFrameHtml({
      buttons: [{ label: 'button1' }],
      image: 'https://example.com/image.png',
      post_url: 'https://example.com/api/frame',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain(
      '<meta property="fc:frame:post_url" content="https://example.com/api/frame" />',
    );
    expect(html).not.toContain('fc:frame:refresh_period');
  });
});

export { getFrameHtml };
