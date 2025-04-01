import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  GetSocialPlatformDetails,
  PLATFORM_CONFIG,
  type SocialPlatform,
} from './getSocialPlatformDetails';

describe('PLATFORM_CONFIG', () => {
  it('should generate correct Twitter URL', () => {
    const url = PLATFORM_CONFIG.twitter.href('username');
    expect(url).toBe('https://x.com/username');
  });

  it('should generate correct GitHub URL', () => {
    const url = PLATFORM_CONFIG.github.href('username');
    expect(url).toBe('https://github.com/username');
  });

  it('should generate correct Farcaster URL', () => {
    const url = PLATFORM_CONFIG.farcaster.href('username');
    expect(url).toBe('https://warpcast.com/username');
  });

  it('should return website URL as-is', () => {
    const url = PLATFORM_CONFIG.website.href('https://example.com');
    expect(url).toBe('https://example.com');
  });

  it('should have an icon for each platform', () => {
    const platforms: SocialPlatform[] = [
      'twitter',
      'github',
      'farcaster',
      'website',
    ];
    for (const platform of platforms) {
      expect(PLATFORM_CONFIG[platform].icon).toBeDefined();
    }
  });
});

describe('GetSocialPlatformDetails', () => {
  const platforms: SocialPlatform[] = [
    'twitter',
    'github',
    'farcaster',
    'website',
  ];

  for (const platform of platforms) {
    it(`should render ${platform} link correctly`, () => {
      const value = platform === 'website' ? 'https://example.com' : 'username';
      render(<GetSocialPlatformDetails platform={platform} value={value} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute(
        'href',
        PLATFORM_CONFIG[platform].href(value),
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');

      expect(screen.getByText(platform)).toHaveClass('sr-only');

      const expectedTestId = `ockSocials_${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      expect(link).toHaveAttribute('data-testid', expectedTestId);

      const iconContainer = link.querySelector('.flex.h-4.w-4');
      expect(iconContainer).toBeInTheDocument();
    });
  }

  it('should apply correct CSS classes', () => {
    render(<GetSocialPlatformDetails platform="twitter" value="username" />);
    const link = screen.getByRole('link');

    expect(link.className).toContain('flex items-center justify-center p-2');
  });
});
