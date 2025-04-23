import postcss from 'postcss';
import { describe, it, expect } from 'vitest';
import postcssPrefixClassnames from '../postcss-prefix-classnames';

// Helper function to process CSS through the plugin
async function run(
  input: string,
  opts: {
    prefix: string;
    includeFiles?: string | RegExp | Array<string | RegExp>;
    excludeFiles?: string | RegExp | Array<string | RegExp>;
  },
  fileOption: string = 'test.css',
) {
  const result = await postcss([postcssPrefixClassnames(opts)]).process(input, {
    from: fileOption,
  });
  return result.css;
}

describe('postcss-prefix-classnames', () => {
  it('should add prefix to class names', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, { prefix: 'bar-' });
    expect(output).toBe('.bar-foo { color: red; }');
  });

  it('should handle multiple selectors', async () => {
    const input = '.foo, .bar { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe('.prefix-foo, .prefix-bar { color: red; }');
  });

  it('should not add prefix if already has the prefix', async () => {
    const input = '.prefix-foo { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should handle selectors with no classes', async () => {
    const input = 'div { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe('div { color: red; }');
  });

  it('should handle complex selectors', async () => {
    const input = '.foo .bar, div.baz { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe(
      '.prefix-foo .prefix-bar, div.prefix-baz { color: red; }',
    );
  });

  it('should handle escaped dots', async () => {
    const input = '.foo\\.bar { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe('.prefix-foo\\.bar { color: red; }');
  });

  it('should handle pseudo-classes and pseudo-elements', async () => {
    const input = '.foo:hover, .bar::before { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe(
      '.prefix-foo:hover, .prefix-bar::before { color: red; }',
    );
  });

  it('should handle includeFiles with string match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      includeFiles: 'test.css',
    });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should handle includeFiles with string non-match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(
      input,
      { prefix: 'prefix-', includeFiles: 'other.css' },
      'test.css',
    );
    expect(output).toBe('.foo { color: red; }');
  });

  it('should handle includeFiles with RegExp match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      includeFiles: /test\.css$/,
    });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should handle includeFiles with RegExp non-match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      includeFiles: /other\.css$/,
    });
    expect(output).toBe('.foo { color: red; }');
  });

  it('should handle includeFiles with array match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      includeFiles: ['other.css', 'test.css'],
    });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should handle includeFiles with array non-match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      includeFiles: ['other1.css', 'other2.css'],
    });
    expect(output).toBe('.foo { color: red; }');
  });

  it('should handle excludeFiles with string match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      excludeFiles: 'test.css',
    });
    expect(output).toBe('.foo { color: red; }');
  });

  it('should handle excludeFiles with string non-match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      excludeFiles: 'other.css',
    });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should handle excludeFiles with RegExp match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      excludeFiles: /test\.css$/,
    });
    expect(output).toBe('.foo { color: red; }');
  });

  it('should handle excludeFiles with RegExp non-match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      excludeFiles: /other\.css$/,
    });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should handle excludeFiles with array match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      excludeFiles: ['other.css', 'test.css'],
    });
    expect(output).toBe('.foo { color: red; }');
  });

  it('should handle excludeFiles with array non-match', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      excludeFiles: ['other1.css', 'other2.css'],
    });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should prioritize excludeFiles over includeFiles', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, {
      prefix: 'prefix-',
      includeFiles: 'test.css',
      excludeFiles: 'test.css',
    });
    expect(output).toBe('.foo { color: red; }');
  });

  it('should handle dot in prefix', async () => {
    const input = '.foo { color: red; }';
    const output = await run(input, { prefix: '.prefix-' });
    expect(output).toBe('.prefix-foo { color: red; }');
  });

  it('should handle nested selectors correctly', async () => {
    const input = '.parent { color: red; } .parent .child { color: blue; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe(
      '.prefix-parent { color: red; } .prefix-parent .prefix-child { color: blue; }',
    );
  });

  it('should handle attribute selectors correctly', async () => {
    const input = '.foo[type="text"] { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe('.prefix-foo[type="text"] { color: red; }');
  });

  it('should handle class combined with ID selectors correctly', async () => {
    const input = '#id.foo { color: red; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe('#id.prefix-foo { color: red; }');
  });

  it('should handle multiple rules correctly', async () => {
    const input = '.foo { color: red; } .bar { color: blue; }';
    const output = await run(input, { prefix: 'prefix-' });
    expect(output).toBe(
      '.prefix-foo { color: red; } .prefix-bar { color: blue; }',
    );
  });

  it('should handle no file source gracefully', async () => {
    const input = '.foo { color: red; }';
    // This test will process CSS without providing a source file
    const result = await postcss([
      postcssPrefixClassnames({ prefix: 'prefix-' }),
    ]).process(input);
    expect(result.css).toBe('.prefix-foo { color: red; }');
  });
});
