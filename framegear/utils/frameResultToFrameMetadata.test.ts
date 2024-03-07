import { frameResultToFrameMetadata } from './frameResultToFrameMetadata';

describe('frameResultToFrameMetadata', () => {
  const baseResult = {
    'fc:frame:button:1': 'Button 1',
    'fc:frame:button:1:action': 'Action 1',
    'fc:frame:button:1:target': 'Target 1',
    'fc:frame:image': 'Image URL',
    'fc:frame:input': 'Input Text',
    'fc:frame:post_url': 'Post URL',
    'fc:frame:state': JSON.stringify({ key: 'value' }),
    'fc:frame:refresh_period': '10',
  };

  it('should correctly map frame result to frame metadata', () => {
    const metadata = frameResultToFrameMetadata(baseResult);

    expect(metadata).toEqual({
      buttons: [
        {
          action: 'Action 1',
          label: 'Button 1',
          target: 'Target 1',
        },
        undefined,
        undefined,
        undefined,
      ],
      image: { src: 'Image URL', aspectRatio: undefined },
      input: { text: 'Input Text' },
      postUrl: 'Post URL',
      state: { key: 'value' },
      refreshPeriod: 10,
    });
  });

  it('should handle missing optional fields', () => {
    const result = { ...baseResult };
    delete (result as any)['fc:frame:button:1'];
    delete (result as any)['fc:frame:image'];
    delete (result as any)['fc:frame:input'];
    delete (result as any)['fc:frame:post_url'];
    delete (result as any)['fc:frame:state'];
    delete (result as any)['fc:frame:refresh_period'];

    const metadata = frameResultToFrameMetadata(result);

    expect(metadata).toEqual({
      buttons: [undefined, undefined, undefined, undefined],
      image: { src: undefined, aspectRatio: undefined },
      input: undefined,
      postUrl: undefined,
      state: undefined,
      refreshPeriod: undefined,
    });
  });
});
