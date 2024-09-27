import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openPopup } from './openPopup';

const mockOpen = vi.fn();

describe('openPopup', () => {
  beforeEach(() => {
    vi.stubGlobal('open', mockOpen);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens a popup in the center of the screen', () => {
    vi.stubGlobal('screen', { width: 1200, height: 900 });

    openPopup({
      url: 'https://my.popup.com',
      height: 200,
      width: 100,
    });

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://my.popup.com'),
      undefined,
      expect.stringContaining(
        'width=100,height=200,resizable,scrollbars=yes,status=1,left=550,top=350',
      ),
    );
  });
});
