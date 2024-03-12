import { getFrameMetadata } from './getFrameMetadata';

describe('getFrameMetadata', () => {
  it('should return the correct metadata', () => {
    expect(
      getFrameMetadata({
        buttons: [
          { label: 'button1', action: 'post' },
          { label: 'button2', action: 'post_redirect' },
          { label: 'button3' },
        ],
        image: { src: 'image', aspectRatio: '1.91:1' },
        postUrl: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:button:2': 'button2',
      'fc:frame:button:2:action': 'post_redirect',
      'fc:frame:button:3': 'button3',
      'fc:frame:image': 'image',
      'fc:frame:image:aspect_ratio': '1.91:1',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with image src', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: { src: 'image' },
        postUrl: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with image aspect ratio', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: { src: 'image', aspectRatio: '1:1' },
        postUrl: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:image': 'image',
      'fc:frame:image:aspect_ratio': '1:1',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with one button', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: 'image',
        postUrl: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with refresh_period', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: 'image',
        postUrl: 'post_url',
        refreshPeriod: 10,
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
      'fc:frame:refresh_period': '10',
    });
  });

  it('should return the correct metadata with input', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: 'image',
        input: {
          text: 'Enter a message...',
        },
        postUrl: 'post_url',
        refreshPeriod: 10,
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:image': 'image',
      'fc:frame:input:text': 'Enter a message...',
      'fc:frame:post_url': 'post_url',
      'fc:frame:refresh_period': '10',
    });
  });

  it('should return the correct metadata with action mint', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'Mint', action: 'mint', target: 'https://zizzamia.xyz/api/frame/mint' }],
        image: 'https://zizzamia.xyz/park-1.png',
        input: {
          text: 'Tell me a boat story',
        },
        postUrl: 'https://zizzamia.xyz/api/frame',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Mint',
      'fc:frame:button:1:action': 'mint',
      'fc:frame:button:1:target': 'https://zizzamia.xyz/api/frame/mint',
      'fc:frame:image': 'https://zizzamia.xyz/park-1.png',
      'fc:frame:input:text': 'Tell me a boat story',
      'fc:frame:post_url': 'https://zizzamia.xyz/api/frame',
    });
  });

  it('should return the correct metadata with action link', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'Link', action: 'link', target: 'https://zizzamia.xyz/frame/link' }],
        image: 'https://zizzamia.xyz/park-1.png',
        input: {
          text: 'Tell me a boat story',
        },
        postUrl: 'https://zizzamia.xyz/api/frame',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Link',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': 'https://zizzamia.xyz/frame/link',
      'fc:frame:image': 'https://zizzamia.xyz/park-1.png',
      'fc:frame:input:text': 'Tell me a boat story',
      'fc:frame:post_url': 'https://zizzamia.xyz/api/frame',
    });
  });

  it('should return the correct metadata with action tx', () => {
    expect(
      getFrameMetadata({
        buttons: [
          { label: 'Transaction', action: 'tx', target: 'https://zizzamia.xyz/api/frame/tx' },
        ],
        image: 'https://zizzamia.xyz/park-1.png',
        input: {
          text: 'Tell me a boat story',
        },
        postUrl: 'https://zizzamia.xyz/api/frame',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Transaction',
      'fc:frame:button:1:action': 'tx',
      'fc:frame:button:1:target': 'https://zizzamia.xyz/api/frame/tx',
      'fc:frame:image': 'https://zizzamia.xyz/park-1.png',
      'fc:frame:input:text': 'Tell me a boat story',
      'fc:frame:post_url': 'https://zizzamia.xyz/api/frame',
    });
  });

  it('should return the correct metadata with action tx and post_url', () => {
    expect(
      getFrameMetadata({
        buttons: [
          {
            label: 'Transaction',
            action: 'tx',
            target: 'https://zizzamia.xyz/api/frame/tx',
            postUrl: 'https://zizzamia.xyz/api/frame/tx-post-url',
          },
        ],
        image: 'https://zizzamia.xyz/park-1.png',
        postUrl: 'https://zizzamia.xyz/api/frame',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'Transaction',
      'fc:frame:button:1:action': 'tx',
      'fc:frame:button:1:target': 'https://zizzamia.xyz/api/frame/tx',
      'fc:frame:button:1:post_url': 'https://zizzamia.xyz/api/frame/tx-post-url',
      'fc:frame:image': 'https://zizzamia.xyz/park-1.png',
      'fc:frame:post_url': 'https://zizzamia.xyz/api/frame',
    });
  });

  it('should not render action target if action is not link, mint or tx', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1', action: 'post' }],
        image: 'image',
        postUrl: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should render the target metadata for post and post_redirect (including implicit POST)', () => {
    expect(
      getFrameMetadata({
        buttons: [
          { label: 'button1', action: 'post', target: 'https://zizzamia.xyz/api/frame1' },
          { label: 'button2', action: 'post_redirect', target: 'https://zizzamia.xyz/api/frame2' },
          { label: 'button3', target: 'https://zizzamia.xyz/api/frame3' },
        ],
        image: 'image',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:button:1:target': 'https://zizzamia.xyz/api/frame1',
      'fc:frame:button:2': 'button2',
      'fc:frame:button:2:action': 'post_redirect',
      'fc:frame:button:2:target': 'https://zizzamia.xyz/api/frame2',
      'fc:frame:button:3': 'button3',
      'fc:frame:button:3:target': 'https://zizzamia.xyz/api/frame3',
      'fc:frame:image': 'image',
    });
  });

  it('should return the correct metadata with state', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: 'image',
        postUrl: 'post_url',
        refreshPeriod: 10,
        state: {
          counter: 1,
        },
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
      'fc:frame:refresh_period': '10',
      'fc:frame:state': '%7B%22counter%22%3A1%7D',
    });
  });

  it('should return the correct metadata with state when Cross Site Scripting occur', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: 'image',
        postUrl: 'post_url',
        refreshPeriod: 10,
        state: {
          counter: 1,
          xss: '<script>alert("XSS")</script>',
        },
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
      'fc:frame:refresh_period': '10',
      'fc:frame:state':
        '%7B%22counter%22%3A1%2C%22xss%22%3A%22%3Cscript%3Ealert(%5C%22XSS%5C%22)%3C%2Fscript%3E%22%7D',
    });
  });
});
