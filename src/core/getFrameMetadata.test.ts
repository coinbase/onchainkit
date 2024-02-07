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
        image: 'image',
        post_url: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:button:2': 'button2',
      'fc:frame:button:2:action': 'post_redirect',
      'fc:frame:button:3': 'button3',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with one button', () => {
    expect(
      getFrameMetadata({
        buttons: [{ label: 'button1' }],
        image: 'image',
        post_url: 'post_url',
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
        post_url: 'post_url',
        refresh_period: 10,
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
        post_url: 'post_url',
        refresh_period: 10,
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
        post_url: 'https://zizzamia.xyz/api/frame',
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
        post_url: 'https://zizzamia.xyz/api/frame',
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
});
