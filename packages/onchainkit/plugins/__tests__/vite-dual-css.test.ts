/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'node:path';
import { dualCSSPlugin } from '../vite-dual-css.js';

// Define types locally since we don't have rollup installed
interface OutputAsset {
  type: 'asset';
  fileName: string;
  source: string | Uint8Array;
  name?: string;
}

interface OutputChunk {
  type: 'chunk';
  fileName: string;
  [key: string]: unknown;
}

type OutputBundle = Record<string, OutputAsset | OutputChunk>;

interface NormalizedOutputOptions {
  dir?: string;
  file?: string;
  [key: string]: unknown;
}

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

describe('dualCSSPlugin', () => {
  const mockFs = fs as unknown as {
    existsSync: ReturnType<typeof vi.fn>;
    mkdirSync: ReturnType<typeof vi.fn>;
    writeFileSync: ReturnType<typeof vi.fn>;
  };

  // Helper to call writeBundle (handles both function and object forms)
  async function callWriteBundle(
    plugin: ReturnType<typeof dualCSSPlugin>,
    outputOptions: NormalizedOutputOptions,
    bundle: OutputBundle,
  ) {
    const writeBundle = plugin.writeBundle;
    if (typeof writeBundle === 'function') {
      await writeBundle.call({} as any, outputOptions as any, bundle as any);
    } else if (
      writeBundle &&
      typeof writeBundle === 'object' &&
      'handler' in writeBundle
    ) {
      await writeBundle.handler.call(
        {} as any,
        outputOptions as any,
        bundle as any,
      );
    }
  }

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a plugin with correct name', () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });
    expect(plugin.name).toBe('dual-css');
  });

  it('should process CSS and write scoped file when style.css is found', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'onchainkit.css' });

    const cssAsset: OutputAsset = {
      type: 'asset',
      fileName: 'assets/style.css',
      source: '.test { color: red; }',
      name: 'style.css',
    };

    const bundle: OutputBundle = {
      'assets/style.css': cssAsset,
    };

    const outputOptions: NormalizedOutputOptions = {
      dir: '/output',
    } as NormalizedOutputOptions;

    mockFs.existsSync.mockReturnValue(true);

    await callWriteBundle(plugin, outputOptions, bundle);

    expect(console.log).toHaveBeenCalledWith('📦 Generating scoped styles...');
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      path.join('/output', 'assets', 'onchainkit.css'),
      expect.any(String),
    );
    expect(console.log).toHaveBeenCalledWith(
      '✅ Generated scoped styles: assets/onchainkit.css',
    );
  });

  it('should create assets directory if it does not exist', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const cssAsset: OutputAsset = {
      type: 'asset',
      fileName: 'assets/style.css',
      source: '.test { color: blue; }',
      name: 'style.css',
    };

    const bundle: OutputBundle = {
      'assets/style.css': cssAsset,
    };

    const outputOptions: NormalizedOutputOptions = {
      dir: '/output',
    } as NormalizedOutputOptions;

    mockFs.existsSync.mockReturnValue(false);

    await callWriteBundle(plugin, outputOptions, bundle);

    expect(mockFs.mkdirSync).toHaveBeenCalledWith(
      path.join('/output', 'assets'),
      { recursive: true },
    );
  });

  it('should warn when no style.css is found in bundle', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const bundle: OutputBundle = {
      'other-file.js': {
        type: 'chunk',
        fileName: 'other-file.js',
      } as any,
    };

    const outputOptions: NormalizedOutputOptions = {
      dir: '/output',
    } as NormalizedOutputOptions;

    await callWriteBundle(plugin, outputOptions, bundle);

    expect(console.warn).toHaveBeenCalledWith(
      '⚠️  No style.css found in bundle',
    );
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should handle outputOptions with file instead of dir', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const cssAsset: OutputAsset = {
      type: 'asset',
      fileName: 'assets/style.css',
      source: '.test { color: green; }',
      name: 'style.css',
    };

    const bundle: OutputBundle = {
      'assets/style.css': cssAsset,
    };

    const outputOptions: NormalizedOutputOptions = {
      file: '/output/bundle.js',
    } as NormalizedOutputOptions;

    mockFs.existsSync.mockReturnValue(true);

    await callWriteBundle(plugin, outputOptions, bundle);

    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      path.join('/output', 'assets', 'scoped.css'),
      expect.any(String),
    );
  });

  it('should handle errors during CSS processing', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const cssAsset: OutputAsset = {
      type: 'asset',
      fileName: 'assets/style.css',
      source: '.test { color: red; }',
      name: 'style.css',
    };

    const bundle: OutputBundle = {
      'assets/style.css': cssAsset,
    };

    const outputOptions: NormalizedOutputOptions = {
      dir: '/output',
    } as NormalizedOutputOptions;

    const testError = new Error('PostCSS processing failed');
    mockFs.existsSync.mockReturnValue(true);
    mockFs.writeFileSync.mockImplementation(() => {
      throw testError;
    });

    await callWriteBundle(plugin, outputOptions, bundle);

    expect(console.error).toHaveBeenCalledWith(
      '❌ Error generating scoped styles:',
      testError,
    );
  });

  it('should apply postcss transformations to CSS', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const cssAsset: OutputAsset = {
      type: 'asset',
      fileName: 'assets/style.css',
      source: 'html { --color: red; }',
      name: 'style.css',
    };

    const bundle: OutputBundle = {
      'assets/style.css': cssAsset,
    };

    const outputOptions: NormalizedOutputOptions = {
      dir: '/output',
    } as NormalizedOutputOptions;

    mockFs.existsSync.mockReturnValue(true);

    await callWriteBundle(plugin, outputOptions, bundle);

    // Verify that writeFileSync was called with transformed CSS
    expect(mockFs.writeFileSync).toHaveBeenCalled();
    const writtenCss = mockFs.writeFileSync.mock.calls[0][1] as string;

    // The CSS should be transformed by postcssCreateScopedStyles
    // html should be transformed to .ock:el and --color to --ock-color
    expect(writtenCss).toContain('.ock\\:el');
    expect(writtenCss).toContain('--ock-color');
  });

  it('should handle empty outputOptions gracefully', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const cssAsset: OutputAsset = {
      type: 'asset',
      fileName: 'assets/style.css',
      source: '.test { color: red; }',
      name: 'style.css',
    };

    const bundle: OutputBundle = {
      'assets/style.css': cssAsset,
    };

    const outputOptions: NormalizedOutputOptions =
      {} as NormalizedOutputOptions;

    mockFs.existsSync.mockReturnValue(true);

    await callWriteBundle(plugin, outputOptions, bundle);

    // Should use empty string as dir when no dir or file is provided
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      path.join('assets', 'scoped.css'),
      expect.any(String),
    );
  });

  it('should process CSS with consolidateLayers option enabled', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const cssAsset: OutputAsset = {
      type: 'asset',
      fileName: 'assets/style.css',
      source: '@layer theme { .theme { color: blue; } }',
      name: 'style.css',
    };

    const bundle: OutputBundle = {
      'assets/style.css': cssAsset,
    };

    const outputOptions: NormalizedOutputOptions = {
      dir: '/output',
    } as NormalizedOutputOptions;

    mockFs.existsSync.mockReturnValue(true);

    await callWriteBundle(plugin, outputOptions, bundle);

    const writtenCss = mockFs.writeFileSync.mock.calls[0][1] as string;

    // Should consolidate layers without wrapping in @layer onchainkit
    expect(writtenCss).not.toContain('@layer onchainkit');
    expect(writtenCss).not.toContain('@layer theme');
    expect(writtenCss).toContain('Theme section');
  });

  it('should skip processing if asset is not of type asset', async () => {
    const plugin = dualCSSPlugin({ scopedFileName: 'scoped.css' });

    const bundle: OutputBundle = {
      'assets/style.css': {
        type: 'chunk',
        fileName: 'assets/style.css',
      } as any,
    };

    const outputOptions: NormalizedOutputOptions = {
      dir: '/output',
    } as NormalizedOutputOptions;

    await callWriteBundle(plugin, outputOptions, bundle);

    expect(console.warn).toHaveBeenCalledWith(
      '⚠️  No style.css found in bundle',
    );
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });
});
