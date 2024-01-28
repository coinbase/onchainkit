import { getFrameMetadata } from './getFrameMetadata';

describe('getFrameMetadata', () => {
  it('should return the correct metadata', () => {
    expect(
      getFrameMetadata({
        buttons: ['button1', 'button2', 'button3'],
        image: 'image',
        post_url: 'post_url',
      }),
    ).toEqual({
      'fc:frame': 'vNext',
      'fc:frame:button:1': 'button1',
      'fc:frame:button:2': 'button2',
      'fc:frame:button:3': 'button3',
      'fc:frame:image': 'image',
      'fc:frame:post_url': 'post_url',
    });
  });

  it('should return the correct metadata with one button', () => {
    expect(
      getFrameMetadata({
        buttons: ['button1'],
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
