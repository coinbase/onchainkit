import { frameResultToFrameMetadata } from './frameResultToFrameMetadata';

const baseGoodDefinition = {
  'fc:frame': 'vNext',
  'fc:frame:image': 'https://images.party/this-is-a-test.apng',
  'og:image': 'https://images.party/this-is-a-test.apng',
};

describe('frameResultToFrameMetadata', () => {
  it('handles the minimum viable input', () => {
    expect(frameResultToFrameMetadata(baseGoodDefinition)).toEqual(
      expect.objectContaining({
        image: baseGoodDefinition['og:image'],
      }),
    );
  });

  it('handles buttons', () => {
    expect(
      frameResultToFrameMetadata({
        ...baseGoodDefinition,
        'fc:frame:button:1': 'henlo',
        'fc:frame:button:1:action': 'post',
        'fc:frame:button:2': 'henlo',
        'fc:frame:button:2:action': 'post_redirect',
        'fc:frame:button:3': 'henlo',
        'fc:frame:button:3:action': 'mint',
        'fc:frame:button:4': 'henlo',
        'fc:frame:button:4:action': 'link',
        'fc:frame:button:4:target': 'https://google.com',
      }),
    ).toMatchSnapshot();
  });

  it('handles input text', () => {
    expect(frameResultToFrameMetadata({ ...baseGoodDefinition, 'fc:frame:input': 'lmbo' })).toEqual(
      expect.objectContaining({
        input: { text: 'lmbo' },
      }),
    );
  });

  it('handles state', () => {
    expect(
      frameResultToFrameMetadata({
        ...baseGoodDefinition,
        'fc:frame:state': JSON.stringify({ status: 'buzzin' }),
      }),
    ).toEqual(
      expect.objectContaining({
        state: { status: 'buzzin' },
      }),
    );
  });
});
