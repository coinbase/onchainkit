import { getFrameMetadata } from './getFrameMetadata';

describe('getFrameMetadata', () => {
  it('should return the correct metadata', () => {
    expect(
      getFrameMetadata({
        image: 'image',
        buttons: [
          { label: 'button1', action: 'post' },
          { label: 'button2', action: 'post_redirect' },
          { label: 'button3' },
        ],
        post_url: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:image': 'image',
      'fc:frame:button:1': 'button1',
      'fc:frame:button:1:action': 'post',
      'fc:frame:button:2': 'button2',
      'fc:frame:button:2:action': 'post_redirect',
      'fc:frame:button:3': 'button3',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with one button', () => {
    expect(
      getFrameMetadata({
        image: 'image',
        buttons: [{ label: 'button1' }],
        post_url: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:image': 'image',
      'fc:frame:button:1': 'button1',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with refresh_period', () => {
    expect(
      getFrameMetadata({
        image: 'image',
        buttons: [{ label: 'button1' }],
        post_url: 'post_url',
        refresh_period: 10,
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:image': 'image',
      'fc:frame:button:1': 'button1',
      'fc:frame:post_url': 'post_url',
      'fc:frame:refresh_period': '10',
    });
  });

  it('should return the correct metadata with input', () => {
    expect(
      getFrameMetadata({
        image: 'image',
        input: {
          prompt_text: 'Enter a message...',
        },
        buttons: [{ label: 'button1' }],
        post_url: 'post_url',
        refresh_period: 10,
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:image': 'image',
      'fc:frame:input:text': 'Enter a message...',
      'fc:frame:button:1': 'button1',
      'fc:frame:post_url': 'post_url',
      'fc:frame:refresh_period': '10',
    });
  });
});
