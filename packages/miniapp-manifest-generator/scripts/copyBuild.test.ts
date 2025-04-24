import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cp, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

vi.mock('fs/promises');
vi.mock('path');

describe('copyBuild', () => {
  const originalArgv = process.argv;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.argv = [...originalArgv];
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should copy files successfully', async () => {
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(cp).mockResolvedValue(undefined);

    process.argv = ['node', 'copyBuild.js', '--out', '/test/output'];

    await import('./copyBuild.js');

    expect(mkdir).toHaveBeenCalledWith('/test/output', {
      recursive: true,
    });

    const sourceDir = join(
      dirname(fileURLToPath(import.meta.url)),
      '..',
      'dist',
    );
    expect(cp).toHaveBeenCalledWith(sourceDir, '/test/output', {
      recursive: true,
    });

    expect(logSpy).toHaveBeenCalledWith(
      'Successfully copied files to /test/output',
    );
  });

  it('should exit with error if --out flag is missing', async () => {
    process.argv = ['node', 'copyBuild.js'];

    await import('./copyBuild.js');

    expect(errorSpy).toHaveBeenCalledWith(
      'Please specify an output directory with --out',
    );
  });

  it('should exit with error if --out flag has no value', async () => {
    process.argv = ['node', 'copyBuild.js', '--out'];

    await import('./copyBuild.js');

    expect(errorSpy).toHaveBeenCalledWith(
      'Please specify an output directory with --out',
    );
  });

  it('should handle mkdir error', async () => {
    vi.mocked(mkdir).mockRejectedValue(new Error('mkdir failed'));
    vi.mocked(cp).mockResolvedValue(undefined);

    process.argv = ['node', 'copyBuild.js', '--out', '/test/output'];

    await import('./copyBuild.js');

    expect(errorSpy).toHaveBeenCalledWith(
      'Error copying files:',
      new Error('mkdir failed'),
    );
  });

  it('should handle cp error', async () => {
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(cp).mockRejectedValue(new Error('cp failed'));

    process.argv = ['node', 'copyBuild.js', '--out', '/test/output'];

    await import('./copyBuild.js');

    expect(errorSpy).toHaveBeenCalledWith(
      'Error copying files:',
      new Error('cp failed'),
    );
  });
});
