import { getFrameHtmlResponse } from './getFrameHtmlResponse';

describe('getFrameHtmlResponse', () => {
  it('should return correct HTML with all parameters', () => {
    const html = getFrameHtmlResponse({
      buttons: [
        { label: 'button1', action: 'post' },
        { label: 'button2', action: 'mint', target: 'https://example.com' },
        { label: 'button3', action: 'post_redirect' },
        { label: 'button4' },
      ],
      image: {
        src: 'https://example.com/image.png',
        aspectRatio: '1.91:1',
      },
      input: {
        text: 'Enter a message...',
      },
      postUrl: 'https://example.com/api/frame',
      refreshPeriod: 10,
      state: {
        counter: 1,
      },
    });

    expect(html).toBe(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="Frame description" />
  <meta property="og:title" content="Frame title" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:button:1" content="button1" />
  <meta property="fc:frame:button:1:action" content="post" />
  <meta property="fc:frame:button:2" content="button2" />
  <meta property="fc:frame:button:2:action" content="mint" />
  <meta property="fc:frame:button:2:target" content="https://example.com" />
  <meta property="fc:frame:button:3" content="button3" />
  <meta property="fc:frame:button:3:action" content="post_redirect" />
  <meta property="fc:frame:button:4" content="button4" />
  <meta property="og:image" content="https://example.com/image.png" />
  <meta property="fc:frame:image" content="https://example.com/image.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:input:text" content="Enter a message..." />
  <meta property="fc:frame:post_url" content="https://example.com/api/frame" />
  <meta property="fc:frame:refresh_period" content="10" />
  <meta property="fc:frame:state" content="%7B%22counter%22%3A1%7D" />

</head>
</html>`);
  });

  it('should return correct HTML with image src', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'Mint', action: 'mint', target: 'https://zizzamia.xyz/api/frame/mint' }],
      image: {
        src: 'https://zizzamia.xyz/park-1.png',
      },
    });

    expect(html).toBe(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="Frame description" />
  <meta property="og:title" content="Frame title" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:button:1" content="Mint" />
  <meta property="fc:frame:button:1:action" content="mint" />
  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/mint" />
  <meta property="og:image" content="https://zizzamia.xyz/park-1.png" />
  <meta property="fc:frame:image" content="https://zizzamia.xyz/park-1.png" />

</head>
</html>`);
  });

  it('should return correct HTML with 1:1 image aspect ratio', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'Mint', action: 'mint', target: 'https://zizzamia.xyz/api/frame/mint' }],
      image: {
        src: 'https://zizzamia.xyz/park-1.png',
        aspectRatio: '1:1',
      },
    });

    expect(html).toBe(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="Frame description" />
  <meta property="og:title" content="Frame title" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:button:1" content="Mint" />
  <meta property="fc:frame:button:1:action" content="mint" />
  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/mint" />
  <meta property="og:image" content="https://zizzamia.xyz/park-1.png" />
  <meta property="fc:frame:image" content="https://zizzamia.xyz/park-1.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1:1" />

</head>
</html>`);
  });

  it('should return correct HTML with action mint', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'Mint', action: 'mint', target: 'https://zizzamia.xyz/api/frame/mint' }],
      image: 'https://zizzamia.xyz/park-1.png',
    });

    expect(html).toBe(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="Frame description" />
  <meta property="og:title" content="Frame title" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:button:1" content="Mint" />
  <meta property="fc:frame:button:1:action" content="mint" />
  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/mint" />
  <meta property="og:image" content="https://zizzamia.xyz/park-1.png" />
  <meta property="fc:frame:image" content="https://zizzamia.xyz/park-1.png" />

</head>
</html>`);
  });

  it('should return correct HTML with action link', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'Link', action: 'link', target: 'https://zizzamia.xyz/api/frame/link' }],
      image: 'https://zizzamia.xyz/park-1.png',
    });

    expect(html).toBe(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="Frame description" />
  <meta property="og:title" content="Frame title" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:button:1" content="Link" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/link" />
  <meta property="og:image" content="https://zizzamia.xyz/park-1.png" />
  <meta property="fc:frame:image" content="https://zizzamia.xyz/park-1.png" />

</head>
</html>`);
  });

  it('should return correct HTML with action link, even if action is not explicitly set', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'Click', target: 'https://zizzamia.xyz/api/frame/click' }],
      image: 'https://zizzamia.xyz/park-1.png',
    });

    expect(html).toBe(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="Frame description" />
  <meta property="og:title" content="Frame title" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:button:1" content="Click" />
  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/click" />
  <meta property="og:image" content="https://zizzamia.xyz/park-1.png" />
  <meta property="fc:frame:image" content="https://zizzamia.xyz/park-1.png" />

</head>
</html>`);
  });

  it('should return correct HTML with action tx', () => {
    const html = getFrameHtmlResponse({
      buttons: [
        { label: 'Transaction', action: 'tx', target: 'https://zizzamia.xyz/api/frame/tx' },
        {
          label: 'Transaction 2',
          action: 'tx',
          target: 'https://zizzamia.xyz/api/frame/tx',
          postUrl: 'https://zizzamia.xyz/api/frame/tx-success',
        },
      ],
      image: 'https://zizzamia.xyz/park-1.png',
    });

    expect(html).toBe(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="Frame description" />
  <meta property="og:title" content="Frame title" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:button:1" content="Transaction" />
  <meta property="fc:frame:button:1:action" content="tx" />
  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/tx" />
  <meta property="fc:frame:button:2" content="Transaction 2" />
  <meta property="fc:frame:button:2:action" content="tx" />
  <meta property="fc:frame:button:2:target" content="https://zizzamia.xyz/api/frame/tx" />
  <meta property="fc:frame:button:2:post_url" content="https://zizzamia.xyz/api/frame/tx-success" />
  <meta property="og:image" content="https://zizzamia.xyz/park-1.png" />
  <meta property="fc:frame:image" content="https://zizzamia.xyz/park-1.png" />

</head>
</html>`);
  });

  it('should handle no input', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1' }],
      image: 'https://example.com/image.png',
      postUrl: 'https://example.com/api/frame',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="og:image" content="https://example.com/image.png" />');
    expect(html).toContain(
      '<meta property="fc:frame:post_url" content="https://example.com/api/frame" />',
    );
    expect(html).not.toContain('fc:frame:input:text');
  });

  it('should handle no buttons', () => {
    const html = getFrameHtmlResponse({
      image: 'https://example.com/image.png',
      postUrl: 'https://example.com/api/frame',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="og:image" content="https://example.com/image.png" />');
    expect(html).toContain(
      '<meta property="fc:frame:post_url" content="https://example.com/api/frame" />',
    );
    expect(html).not.toContain('fc:frame:button:');
  });

  it('should handle no post_url', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1' }],
      image: 'https://example.com/image.png',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="og:image" content="https://example.com/image.png" />');
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).not.toContain('fc:frame:post_url');
  });

  it('should handle no refresh_period', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1' }],
      image: 'https://example.com/image.png',
      postUrl: 'https://example.com/api/frame',
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

  it('should not render action target if action is not link, mint or tx', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1', action: 'post' }],
      image: 'image',
      postUrl: 'post_url',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain('<meta property="fc:frame:button:1:action" content="post" />');
    expect(html).toContain('<meta property="fc:frame:image" content="image" />');
    expect(html).toContain('<meta property="fc:frame:post_url" content="post_url" />');
    expect(html).not.toContain('fc:frame:button:1:target');
  });

  it('should set og:description and og:title to default values if not provided', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1' }],
      image: 'image',
      postUrl: 'post_url',
    });

    expect(html).toContain('<meta property="og:description" content="Frame description" />');
    expect(html).toContain('<meta property="og:title" content="Frame title" />');
  });

  it('should set og:description and og:title to provided values', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1' }],
      image: 'image',
      postUrl: 'post_url',
      ogDescription: 'description',
      ogTitle: 'title',
    });

    expect(html).toContain('<meta property="og:description" content="description" />');
    expect(html).toContain('<meta property="og:title" content="title" />');
  });

  it('should set a button link only once', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1', action: 'link', target: 'https://example.com' }],
      image: 'image',
      postUrl: 'post_url',
    });

    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain('<meta property="fc:frame:button:1:action" content="link" />');
    expect(html).toContain(
      '<meta property="fc:frame:button:1:target" content="https://example.com" />',
    );
    expect(html).not.toContain('fc:frame:button:2');
    expect(html).not.toContain('fc:frame:button:2:action');
    expect(html).not.toContain('fc:frame:button:2:target');
    expect(html).not.toContain('fc:frame:button:3');
    expect(html).not.toContain('fc:frame:button:3:action');
    expect(html).not.toContain('fc:frame:button:3:target');
    expect(html).not.toContain('fc:frame:button:4');
    expect(html).not.toContain('fc:frame:button:4:action');
    expect(html).not.toContain('fc:frame:button:4:target');
  });

  it('should set a target when action is post', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1', action: 'post', target: 'https://example.com/api/frame7' }],
      image: 'image',
    });

    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain('<meta property="fc:frame:button:1:action" content="post" />');
    expect(html).toContain(
      '<meta property="fc:frame:button:1:target" content="https://example.com/api/frame7" />',
    );
    expect(html).not.toContain('fc:frame:button:2');
    expect(html).not.toContain('fc:frame:button:2:action');
    expect(html).not.toContain('fc:frame:button:2:target');
    expect(html).not.toContain('fc:frame:button:3');
    expect(html).not.toContain('fc:frame:button:3:action');
    expect(html).not.toContain('fc:frame:button:3:target');
    expect(html).not.toContain('fc:frame:button:4');
    expect(html).not.toContain('fc:frame:button:4:action');
    expect(html).not.toContain('fc:frame:button:4:target');
  });

  it('should set a target when action is tx', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'Transaction', action: 'tx', target: 'https://example.com/api/tx7' }],
      image: 'image',
    });

    expect(html).toContain('<meta property="fc:frame:button:1" content="Transaction" />');
    expect(html).toContain('<meta property="fc:frame:button:1:action" content="tx" />');
    expect(html).toContain(
      '<meta property="fc:frame:button:1:target" content="https://example.com/api/tx7" />',
    );
    expect(html).not.toContain('fc:frame:button:2');
    expect(html).not.toContain('fc:frame:button:2:action');
    expect(html).not.toContain('fc:frame:button:2:target');
    expect(html).not.toContain('fc:frame:button:3');
    expect(html).not.toContain('fc:frame:button:3:action');
    expect(html).not.toContain('fc:frame:button:3:target');
    expect(html).not.toContain('fc:frame:button:4');
    expect(html).not.toContain('fc:frame:button:4:action');
    expect(html).not.toContain('fc:frame:button:4:target');
  });

  it('should handle no state', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1' }],
      image: 'https://example.com/image.png',
      postUrl: 'https://example.com/api/frame',
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="og:image" content="https://example.com/image.png" />');
    expect(html).toContain(
      '<meta property="fc:frame:post_url" content="https://example.com/api/frame" />',
    );
    expect(html).not.toContain('fc:frame:state');
  });

  it('should handle state when Cross Site Scripting occur', () => {
    const html = getFrameHtmlResponse({
      buttons: [{ label: 'button1' }],
      image: 'https://example.com/image.png',
      postUrl: 'https://example.com/api/frame',
      state: {
        counter: 1,
        xss: '<script>alert("XSS")</script>',
      },
    });

    expect(html).toContain('<meta property="fc:frame" content="vNext" />');
    expect(html).toContain('<meta property="fc:frame:button:1" content="button1" />');
    expect(html).toContain(
      '<meta property="fc:frame:image" content="https://example.com/image.png" />',
    );
    expect(html).toContain('<meta property="og:image" content="https://example.com/image.png" />');
    expect(html).toContain(
      '<meta property="fc:frame:post_url" content="https://example.com/api/frame" />',
    );
    expect(html).toContain(
      '<meta property="fc:frame:state" content="%7B%22counter%22%3A1%2C%22xss%22%3A%22%3Cscript%3Ealert(%5C%22XSS%5C%22)%3C%2Fscript%3E%22%7D"',
    );
    expect(html).not.toContain('<script>alert("XSS")</script>');
  });
});

export { getFrameHtmlResponse };
