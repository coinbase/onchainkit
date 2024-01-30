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

  it('should return the correct metadata with no refresh_period', () => {
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
});
