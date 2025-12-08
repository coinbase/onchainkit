import { describe, expect, it, vi } from 'vitest';
import { withValidManifest } from './manifestUtils';
import type {
  MiniAppManifest,
  LegacyMiniAppManifest,
  MiniAppFields,
} from './types';

function getMiniAppValue(
  manifest: MiniAppManifest | LegacyMiniAppManifest,
): MiniAppFields {
  // After withValidManifest processing, the result always has 'miniapp' field
  if ('miniapp' in manifest && manifest.miniapp) {
    return manifest.miniapp;
  }
  throw new Error('Invalid manifest: no miniapp found');
}

describe('withValidManifest', () => {
  const validMiniappBase: MiniAppFields = {
    version: '1',
    name: 'Test App',
    homeUrl: 'https://example.com',
    iconUrl: 'https://example.com/icon.png',
  };

  const validManifestBase: MiniAppManifest = {
    miniapp: validMiniappBase,
  };

  describe('error cases', () => {
    it('should throw error when miniapp field is missing', () => {
      const manifest = {} as MiniAppManifest;
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: miniapp field is required',
      );
    });

    it('should throw error when version is missing', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          version: undefined as unknown as string,
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: version is required',
      );
    });

    it('should throw error when name is missing', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          name: undefined as unknown as string,
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: name is required',
      );
    });

    it('should throw error when homeUrl is missing', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          homeUrl: undefined as unknown as string,
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: homeUrl is required',
      );
    });

    it('should throw error when iconUrl is missing', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          iconUrl: undefined as unknown as string,
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: iconUrl is required',
      );
    });

    it('should throw error when version is not "1"', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          version: '2',
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: version must be "1"',
      );
    });

    it('should throw error when required fields are empty strings', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          name: '',
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: name is required',
      );
    });

    it('should throw error when required fields are null', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          homeUrl: null as unknown as string,
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: homeUrl is required',
      );
    });
  });

  describe('success cases', () => {
    it('should return valid manifest with only required fields', () => {
      const result = withValidManifest(validManifestBase);
      expect(result).toEqual({
        miniapp: validMiniappBase,
      });
    });

    it('should include valid optional fields', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          subtitle: 'Test subtitle',
          description: 'Test description',
          splashImageUrl: 'https://example.com/splash.png',
          splashBackgroundColor: '#ffffff',
          webhookUrl: 'https://example.com/webhook',
          screenshotUrls: [
            'https://example.com/screenshot1.png',
            'https://example.com/screenshot2.png',
          ],
          primaryCategory: 'games',
          tags: ['tag1', 'tag2'],
          heroImageUrl: 'https://example.com/hero.png',
          tagline: 'Test tagline',
          ogTitle: 'Test OG Title',
          ogDescription: 'Test OG Description',
          ogImageUrl: 'https://example.com/og.png',
          noindex: true,
          requiredChains: ['ethereum', 'polygon'],
          requiredCapabilities: ['wallet', 'identity'],
          canonicalDomain: 'example.com',
        },
      };

      const result = withValidManifest(manifest);
      expect(getMiniAppValue(result)).toEqual(getMiniAppValue(manifest));
    });

    it('should include deprecated fields if they have values', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          imageUrl: 'https://example.com/image.png',
          buttonTitle: 'Click me',
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp).toEqual(manifest.miniapp);
    });

    it('should include valid accountAssociation', () => {
      const manifest: MiniAppManifest = {
        miniapp: validMiniappBase,
        accountAssociation: {
          header: 'test-header',
          payload: 'test-payload',
          signature: 'test-signature',
        },
      };

      const result = withValidManifest(manifest);
      expect(result).toEqual(manifest);
    });
  });

  describe('deprecated frame field', () => {
    it('should handle deprecated frame field fallback', () => {
      const manifest: LegacyMiniAppManifest = {
        frame: validMiniappBase,
      };

      const result = withValidManifest(manifest);
      expect(result).toEqual({
        miniapp: validMiniappBase,
      });
    });

    it('should throw error when frame field is missing required fields', () => {
      const manifest: LegacyMiniAppManifest = {
        frame: {
          ...validMiniappBase,
          name: undefined as unknown as string,
        },
      };
      expect(() => withValidManifest(manifest)).toThrow(
        'Invalid manifest: name is required',
      );
    });

    it('should handle frame field with accountAssociation', () => {
      const manifest: LegacyMiniAppManifest = {
        frame: validMiniappBase,
        accountAssociation: {
          header: 'test-header',
          payload: 'test-payload',
          signature: 'test-signature',
        },
      };

      const result = withValidManifest(manifest);
      expect(result).toEqual({
        miniapp: validMiniappBase,
        accountAssociation: {
          header: 'test-header',
          payload: 'test-payload',
          signature: 'test-signature',
        },
      });
    });
  });

  describe('optional field cleaning', () => {
    it('should remove empty string optional fields', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          subtitle: '',
          description: 'Valid description',
          splashImageUrl: '',
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp.subtitle).toBeUndefined();
      expect(result.miniapp.description).toBe('Valid description');
      expect(result.miniapp.splashImageUrl).toBeUndefined();
    });

    it('should remove null optional fields', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          subtitle: null as unknown as string,
          description: 'Valid description',
          splashImageUrl: null as unknown as string,
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp.subtitle).toBeUndefined();
      expect(result.miniapp.description).toBe('Valid description');
      expect(result.miniapp.splashImageUrl).toBeUndefined();
    });

    it('should remove undefined optional fields', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          subtitle: undefined,
          description: 'Valid description',
          splashImageUrl: undefined,
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp.subtitle).toBeUndefined();
      expect(result.miniapp.description).toBe('Valid description');
      expect(result.miniapp.splashImageUrl).toBeUndefined();
    });

    it('should remove empty arrays', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          screenshotUrls: [],
          tags: ['valid-tag'],
          requiredChains: [],
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp.screenshotUrls).toBeUndefined();
      expect(result.miniapp.tags).toEqual(['valid-tag']);
      expect(result.miniapp.requiredChains).toBeUndefined();
    });

    it('should keep non-empty arrays', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          screenshotUrls: ['https://example.com/screenshot.png'],
          tags: ['tag1', 'tag2'],
          requiredChains: ['ethereum'],
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp.screenshotUrls).toEqual([
        'https://example.com/screenshot.png',
      ]);
      expect(result.miniapp.tags).toEqual(['tag1', 'tag2']);
      expect(result.miniapp.requiredChains).toEqual(['ethereum']);
    });

    it('should keep boolean false values', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          noindex: false,
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp.noindex).toBe(false);
    });

    it('should keep boolean true values', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          noindex: true,
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp.noindex).toBe(true);
    });
  });

  describe('accountAssociation handling', () => {
    it('should omit accountAssociation when header is missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const manifest: MiniAppManifest = {
        miniapp: validMiniappBase,
        accountAssociation: {
          header: undefined as unknown as string,
          payload: 'test-payload',
          signature: 'test-signature',
        },
      };

      const result = withValidManifest(manifest);
      expect(result.accountAssociation).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid manifest accountAssociation. Omitting from manifest.',
      );

      consoleSpy.mockRestore();
    });

    it('should omit accountAssociation when payload is missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const manifest: MiniAppManifest = {
        miniapp: validMiniappBase,
        accountAssociation: {
          header: 'test-header',
          payload: undefined as unknown as string,
          signature: 'test-signature',
        },
      };

      const result = withValidManifest(manifest);
      expect(result.accountAssociation).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid manifest accountAssociation. Omitting from manifest.',
      );

      consoleSpy.mockRestore();
    });

    it('should omit accountAssociation when signature is missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const manifest: MiniAppManifest = {
        miniapp: validMiniappBase,
        accountAssociation: {
          header: 'test-header',
          payload: 'test-payload',
          signature: undefined as unknown as string,
        },
      };

      const result = withValidManifest(manifest);
      expect(result.accountAssociation).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid manifest accountAssociation. Omitting from manifest.',
      );

      consoleSpy.mockRestore();
    });

    it('should omit accountAssociation when all fields are missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const manifest: MiniAppManifest = {
        miniapp: validMiniappBase,
        accountAssociation: {
          header: undefined as unknown as string,
          payload: undefined as unknown as string,
          signature: undefined as unknown as string,
        },
      };

      const result = withValidManifest(manifest);
      expect(result.accountAssociation).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid manifest accountAssociation. Omitting from manifest.',
      );

      consoleSpy.mockRestore();
    });

    it('should not warn when accountAssociation is not provided', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const manifest: MiniAppManifest = {
        miniapp: validMiniappBase,
      };

      const result = withValidManifest(manifest);
      expect(result.accountAssociation).toBeUndefined();
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should include accountAssociation when all fields are present', () => {
      const manifest: MiniAppManifest = {
        miniapp: validMiniappBase,
        accountAssociation: {
          header: 'test-header',
          payload: 'test-payload',
          signature: 'test-signature',
        },
      };

      const result = withValidManifest(manifest);
      expect(result.accountAssociation).toEqual({
        header: 'test-header',
        payload: 'test-payload',
        signature: 'test-signature',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle all primaryCategory values', () => {
      const categories = [
        'games',
        'social',
        'finance',
        'utility',
        'productivity',
        'health-fitness',
        'news-media',
        'music',
        'shopping',
        'education',
        'developer-tools',
        'entertainment',
        'art-creativity',
      ] as const;

      for (const category of categories) {
        const manifest: MiniAppManifest = {
          miniapp: {
            ...validMiniappBase,
            primaryCategory: category,
          },
        };

        const result = withValidManifest(manifest);
        expect(result.miniapp.primaryCategory).toBe(category);
      }
    });

    it('should handle complex manifest with mixed valid and invalid optional fields', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          ...validMiniappBase,
          subtitle: 'Valid subtitle',
          description: '', // Should be removed
          splashImageUrl: 'https://example.com/splash.png',
          splashBackgroundColor: null as unknown as string, // Should be removed
          webhookUrl: undefined, // Should be removed
          screenshotUrls: ['https://example.com/screenshot.png'], // Should be kept
          primaryCategory: 'games',
          tags: [], // Should be removed
          heroImageUrl: 'https://example.com/hero.png',
          tagline: '', // Should be removed
          ogTitle: 'Valid OG Title',
          ogDescription: '', // Should be removed
          ogImageUrl: 'https://example.com/og.png',
          noindex: false, // Should be kept
          requiredChains: ['ethereum'], // Should be kept
          requiredCapabilities: [], // Should be removed
          canonicalDomain: 'example.com',
        },
      };

      const result = withValidManifest(manifest);
      expect(result.miniapp).toEqual({
        version: '1',
        name: 'Test App',
        homeUrl: 'https://example.com',
        iconUrl: 'https://example.com/icon.png',
        subtitle: 'Valid subtitle',
        splashImageUrl: 'https://example.com/splash.png',
        screenshotUrls: ['https://example.com/screenshot.png'],
        primaryCategory: 'games',
        heroImageUrl: 'https://example.com/hero.png',
        ogTitle: 'Valid OG Title',
        ogImageUrl: 'https://example.com/og.png',
        noindex: false,
        requiredChains: ['ethereum'],
        canonicalDomain: 'example.com',
      });
    });

    it('should handle manifest with all fields as valid values', () => {
      const manifest: MiniAppManifest = {
        miniapp: {
          version: '1',
          name: 'Complete Test App',
          homeUrl: 'https://example.com',
          iconUrl: 'https://example.com/icon.png',
          splashImageUrl: 'https://example.com/splash.png',
          splashBackgroundColor: '#ffffff',
          webhookUrl: 'https://example.com/webhook',
          subtitle: 'Complete subtitle',
          description: 'Complete description',
          screenshotUrls: [
            'https://example.com/screenshot1.png',
            'https://example.com/screenshot2.png',
          ],
          primaryCategory: 'games',
          tags: ['tag1', 'tag2', 'tag3'],
          heroImageUrl: 'https://example.com/hero.png',
          tagline: 'Complete tagline',
          ogTitle: 'Complete OG Title',
          ogDescription: 'Complete OG Description',
          ogImageUrl: 'https://example.com/og.png',
          noindex: true,
          requiredChains: ['ethereum', 'polygon', 'base'],
          requiredCapabilities: ['wallet', 'identity', 'notifications'],
          canonicalDomain: 'example.com',
          imageUrl: 'https://example.com/deprecated-image.png',
          buttonTitle: 'Deprecated Button',
        },
        accountAssociation: {
          header: 'complete-header',
          payload: 'complete-payload',
          signature: 'complete-signature',
        },
      };

      const result = withValidManifest(manifest);
      expect(result).toEqual(manifest);
    });
  });
});

describe('deprecated frame field fallback', () => {
  it('should handle deprecated frame field fallback', () => {
    const validFrameBase: MiniAppFields = {
      version: '1',
      name: 'Test App',
      homeUrl: 'https://example.com',
      iconUrl: 'https://example.com/icon.png',
    };

    const manifest: LegacyMiniAppManifest = {
      frame: validFrameBase,
    };

    const result = withValidManifest(manifest);

    // The result should always have 'miniapp' field, even when input has 'frame'
    expect(result).toHaveProperty('miniapp');
    expect(result.miniapp).toEqual(validFrameBase);
  });
});
