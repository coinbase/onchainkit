import { describe, expect, it } from 'vitest';
import { setFrameMetadataButtons } from './setFrameMetadataButtons';

describe('setFrameMetadataButtons', () => {
  it('should return no button metadata', () => {
    const testMetadata = {
      'fc:frame': 'vNext',
    };
    setFrameMetadataButtons(testMetadata, undefined);

    expect(testMetadata).toEqual({
      'fc:frame': 'vNext',
    });
  });

  it('should return the correct metadata', () => {
    const testMetadata = {
      'fc:frame': 'vNext',
    };
    setFrameMetadataButtons(testMetadata, [
      { label: 'button1', action: 'post' },
      { label: 'button2', action: 'post_redirect' },
      { label: 'button3' },
    ]);

    expect(testMetadata).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:button:2': 'button2',
      'fc:frame:button:2:action': 'post_redirect',
      'fc:frame:button:3': 'button3',
    });
  });

  it('should return the correct metadata for button with action tx and target', () => {
    const testMetadata = { 'fc:frame': 'vNext' };
    setFrameMetadataButtons(testMetadata, [
      {
        label: 'Button1',
        action: 'tx',
        target: 'https://zizzamia.xyz/api/frame/tx',
      },
    ]);

    expect(testMetadata).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Button1',
      'fc:frame:button:1:action': 'tx',
      'fc:frame:button:1:target': 'https://zizzamia.xyz/api/frame/tx',
    });
  });

  it('should return the correct metadata for button with action post and post_url', () => {
    const testMetadata = { 'fc:frame': 'vNext' };
    setFrameMetadataButtons(testMetadata, [
      {
        label: 'Button1',
        action: 'post',
        postUrl: 'https://zizzamia.xyz/api/frame/post_url',
      },
    ]);

    expect(testMetadata).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:button:1:post_url': 'https://zizzamia.xyz/api/frame/post_url',
    });
  });

  it('should return the correct metadata for buttons with action tx and custom targets', () => {
    const testMetadata = { 'fc:frame': 'vNext' };
    setFrameMetadataButtons(testMetadata, [
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

    expect(testMetadata).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Button1',
      'fc:frame:button:1:action': 'tx',
      'fc:frame:button:1:target':
        'https://zizzamia.xyz/api/frame/tx?queryParam=XXX',
      'fc:frame:button:2': 'Button2',
      'fc:frame:button:2:action': 'tx',
      'fc:frame:button:2:target':
        'https://zizzamia.xyz/api/frame/tx?queryParam=YYY',
    });
  });

  it('should return the correct metadata for buttons with action post and custom post_urls', () => {
    const testMetadata = { 'fc:frame': 'vNext' };
    setFrameMetadataButtons(testMetadata, [
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
    expect(testMetadata).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:button:1:post_url':
        'https://zizzamia.xyz/api/frame/post-url?queryParam=XXX',
      'fc:frame:button:2': 'Button2',
      'fc:frame:button:2:action': 'post',
      'fc:frame:button:2:post_url':
        'https://zizzamia.xyz/api/frame/post-url?queryParam=YYY',
    });
  });
});
