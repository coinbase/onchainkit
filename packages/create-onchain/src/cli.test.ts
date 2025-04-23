import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createOnchainKitTemplate } from './onchainkit';
import { createMiniKitTemplate, createMiniKitManifest } from './minikit';
import { getVersion } from './utils.js';

vi.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`${code}`);
});

vi.mock('./utils', async () => {
  const actual = await vi.importActual<typeof import('./utils')>('./utils');
  return {
    ...actual,
    getVersion: vi.fn(),
  };
});

vi.mock('./onchainkit', async () => {
  const actual = await vi.importActual<typeof import('./onchainkit')>('./onchainkit');
  return {
    ...actual,
    createOnchainKitTemplate: vi.fn(),
  };
});

vi.mock('./minikit', async () => {
  const actual = await vi.importActual<typeof import('./minikit')>('./minikit');
  return {
    ...actual,
    createMiniKitTemplate: vi.fn(),
    createMiniKitManifest: vi.fn(),
  };
});

const logSpy = vi.spyOn(console, 'log');

describe('CLI', () => {
  const originalGetArgs = process.argv;

  beforeEach(() => {
    process.argv = [...originalGetArgs];

    vi.mocked(getVersion).mockResolvedValue('0.0.1');
  });

  afterEach(() => {
    process.argv = originalGetArgs;
    vi.resetAllMocks();
    vi.resetModules();
  })

  it('calls createOnchainKitTemplate with no arguments', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('./cli.js');

    expect(createOnchainKitTemplate).toHaveBeenCalled();
  });

  it('calls createMiniKitTemplate with --mini', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '--mini'];

    await import('./cli.js');

    expect(createMiniKitTemplate).toHaveBeenCalledWith('minikit-basic');
  });

  it('calls createMiniKitManifest with --manifest', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '--manifest'];

    await import('./cli.js');

    expect(createMiniKitManifest).toHaveBeenCalled();
  });

  it('calls createMiniKitTemplate with --template=minikit-basic', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '--template=minikit-basic'];

    await import('./cli.js');

    expect(createMiniKitTemplate).toHaveBeenCalledWith('minikit-basic');
  });

  it('calls createMiniKitTemplate with --template=minikit-snake', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '--template=minikit-snake'];

    await import('./cli.js');

    expect(createMiniKitTemplate).toHaveBeenCalledWith('minikit-snake');
  });

  it('shows help text with --help', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '--help'];

    await import('./cli.js');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Options:'));
  });

  it('shows help text with -h', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '-h'];

    await import('./cli.js');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Options:'));
  });

  it('shows version with --version', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '--version'];

    await import('./cli.js');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('v0.0.1'));
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  it('shows version with -v', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.argv = ['node', 'cli.js', '-v'];

    await import('./cli.js');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('v0.0.1'));
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));
  });
});
