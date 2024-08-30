import { describe, expect, it } from 'vitest';
import { setFrameHtmlButtons } from './setFrameHtmlButtons';

describe('setFrameHtmlButtons', () => {
  it('should return no button HTML', () => {
    const testButtonsHtml = setFrameHtmlButtons(undefined);

    expect(testButtonsHtml).toEqual('');
  });

  it('should return the correct HTML', () => {
    const testButtonsHtml = setFrameHtmlButtons([
      { label: 'button1', action: 'post' },
      { label: 'button2', action: 'mint', target: 'https://example.com' },
      { label: 'button3', action: 'post_redirect' },
      { label: 'button4' },
    ]);

    expect(testButtonsHtml).toEqual(
      `  <meta property="fc:frame:button:1" content="button1" />\n` +
        `  <meta property="fc:frame:button:1:action" content="post" />\n` +
        `  <meta property="fc:frame:button:2" content="button2" />\n` +
        `  <meta property="fc:frame:button:2:action" content="mint" />\n` +
        `  <meta property="fc:frame:button:2:target" content="https://example.com" />\n` +
        `  <meta property="fc:frame:button:3" content="button3" />\n` +
        `  <meta property="fc:frame:button:3:action" content="post_redirect" />\n` +
        `  <meta property="fc:frame:button:4" content="button4" />\n`,
    );
  });

  it('should return the correct HTML for button with action mint and target', () => {
    const testButtonsHtml = setFrameHtmlButtons([
      {
        label: 'Mint',
        action: 'mint',
        target: 'https://zizzamia.xyz/api/frame/mint',
      },
    ]);

    expect(testButtonsHtml).toEqual(
      `  <meta property="fc:frame:button:1" content="Mint" />\n` +
        `  <meta property="fc:frame:button:1:action" content="mint" />\n` +
        `  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/mint" />\n`,
    );
  });

  it('should return the correct HTML for button with action tx and target', () => {
    const testButtonsHtml = setFrameHtmlButtons([
      {
        label: 'Tx',
        action: 'tx',
        target: 'https://zizzamia.xyz/api/frame/tx',
      },
    ]);

    expect(testButtonsHtml).toEqual(
      `  <meta property="fc:frame:button:1" content="Tx" />\n` +
        `  <meta property="fc:frame:button:1:action" content="tx" />\n` +
        `  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/tx" />\n`,
    );
  });

  it('should return the correct metadata for button with action post and post_url', () => {
    const testButtonsHtml = setFrameHtmlButtons([
      {
        label: 'Button1',
        action: 'post',
        postUrl: 'https://zizzamia.xyz/api/frame/post_url',
      },
    ]);

    expect(testButtonsHtml).toEqual(
      `  <meta property="fc:frame:button:1" content="Button1" />\n` +
        `  <meta property="fc:frame:button:1:action" content="post" />\n` +
        `  <meta property="fc:frame:button:1:post_url" content="https://zizzamia.xyz/api/frame/post_url" />\n`,
    );
  });

  it('should return the correct metadata for buttons with action tx and custom targets', () => {
    const testButtonsHtml = setFrameHtmlButtons([
      {
        label: 'Button1',
        action: 'tx',
        target: 'https://zizzamia.xyz/api/frame/tx?queryParam=XXX',
      },
      {
        label: 'Button2',
        action: 'tx',
        target: 'https://zizzamia.xyz/api/frame/tx?queryParam=YYY',
      },
    ]);

    expect(testButtonsHtml).toEqual(
      `  <meta property="fc:frame:button:1" content="Button1" />\n` +
        `  <meta property="fc:frame:button:1:action" content="tx" />\n` +
        `  <meta property="fc:frame:button:1:target" content="https://zizzamia.xyz/api/frame/tx?queryParam=XXX" />\n` +
        `  <meta property="fc:frame:button:2" content="Button2" />\n` +
        `  <meta property="fc:frame:button:2:action" content="tx" />\n` +
        `  <meta property="fc:frame:button:2:target" content="https://zizzamia.xyz/api/frame/tx?queryParam=YYY" />\n`,
    );
  });

  it('should return the correct metadata for buttons with action post and custom post_urls', () => {
    const testButtonsHtml = setFrameHtmlButtons([
      {
        label: 'Button1',
        action: 'post',
        postUrl: 'https://zizzamia.xyz/api/frame/post-url?queryParam=XXX',
      },
      {
        label: 'Button2',
        action: 'post',
        postUrl: 'https://zizzamia.xyz/api/frame/post-url?queryParam=YYY',
      },
    ]);
    expect(testButtonsHtml).toEqual(
      `  <meta property="fc:frame:button:1" content="Button1" />\n` +
        `  <meta property="fc:frame:button:1:action" content="post" />\n` +
        `  <meta property="fc:frame:button:1:post_url" content="https://zizzamia.xyz/api/frame/post-url?queryParam=XXX" />\n` +
        `  <meta property="fc:frame:button:2" content="Button2" />\n` +
        `  <meta property="fc:frame:button:2:action" content="post" />\n` +
        `  <meta property="fc:frame:button:2:post_url" content="https://zizzamia.xyz/api/frame/post-url?queryParam=YYY" />\n`,
    );
  });
});
