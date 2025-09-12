import { transformSync, PluginObj } from '@babel/core';
import { describe, it, expect } from 'vitest';
import { babelPrefixReactClassNames } from '../babel-prefix-react-classnames';

// Helper function to transform code using the plugin
function transform(
  code: string,
  options: { prefix: string; cnUtil?: string | false } = { prefix: 'prefix-' },
): string {
  const result = transformSync(code, {
    plugins: [
      [babelPrefixReactClassNames(options) as unknown as PluginObj, {}],
    ],
    presets: ['@babel/preset-react'],
    configFile: false,
    babelrc: false,
  });

  return result?.code || '';
}

describe('babel-prefix-react-classnames', () => {
  it('should add prefix to string literal className', () => {
    const code = '<div className="foo">Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: "prefix-foo"');
  });

  it('should handle multiple classes in string literal className', () => {
    const code = '<div className="foo bar">Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: "prefix-foo prefix-bar"');
  });

  it('should not add prefix if already has the prefix', () => {
    const code = '<div className="prefix-foo">Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: "prefix-foo"');
  });

  it('should handle mixed prefixed and non-prefixed classes', () => {
    const code = '<div className="prefix-foo bar">Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: "prefix-foo prefix-bar"');
  });

  it('should handle template literals', () => {
    const code = '<div className={`foo ${dynamic} bar`}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: `prefix-foo ${dynamic} prefix-bar`');
  });

  it('should handle continuous class names in template literals with expressions', () => {
    const code =
      '<div className={`foo${isLarge ? "-large" : ""}-bar prefix-blah ${active && "active"}`}>Hello</div>';
    const result = transform(code);
    expect(result).toContain(
      'className: `prefix-foo${isLarge ? "-large" : ""}-bar prefix-blah ${active && "active"}`',
    );
  });

  it('should not transform identifiers', () => {
    const code = '<div className={classes}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: classes');
  });

  it('should not transform member expressions', () => {
    const code = '<div className={styles.container}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: styles.container');
  });

  it('should handle cn utility function calls with string arguments', () => {
    const code = '<div className={cn("foo", "bar")}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('cn("prefix-foo"');
    expect(result).toContain('"prefix-bar"');
  });

  it('should handle cn utility function calls with template literals', () => {
    const code = '<div className={cn(`foo ${dynamic}`, "bar")}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('cn(`prefix-foo ${dynamic}`');
    expect(result).toContain('"prefix-bar"');
  });

  it('should not transform member expressions in multiple elements', () => {
    const code = `
      <div>
        <div className={styles.container}>First</div>
        <span className={otherStyles.text}>Second</span>
        <button className={btnStyles.button}>Third</button>
      </div>
    `;
    const result = transform(code);

    expect(result).toContain('className: styles.container');
    expect(result).toContain('className: otherStyles.text');
    expect(result).toContain('className: btnStyles.button');
  });

  it('should handle cn utility function calls with variables', () => {
    const code = '<div className={cn(classes, "bar")}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('cn(classes');
    expect(result).toContain('"prefix-bar"');
  });

  it('should use custom cn utility name if provided', () => {
    const code = '<div className={classNames("foo", "bar")}>Hello</div>';
    const result = transform(code, { prefix: 'prefix-', cnUtil: 'classNames' });
    expect(result).toContain('classNames("prefix-foo"');
    expect(result).toContain('"prefix-bar"');
  });

  it('should handle multiple JSX elements with className', () => {
    const code = `
      <div>
        <span className="foo">Span</span>
        <p className="bar">Paragraph</p>
      </div>
    `;
    const result = transform(code);
    expect(result).toMatch(/className: "prefix-foo"/);
    expect(result).toMatch(/className: "prefix-bar"/);
  });

  it('should handle complex nested JSX with mixed className types', () => {
    const code = `
      <div className="container">
        <span className={styles.text}>Text</span>
        <button className={cn('btn', isActive && 'active')}>Click</button>
      </div>
    `;
    const result = transform(code);
    expect(result).toMatch(/className: "prefix-container"/);
    expect(result).toMatch(/className: styles\.text/);
    expect(result).toMatch(/cn\("prefix-btn"/);
    expect(result).toMatch(/isActive && "prefix-active"/);
  });

  it('should handle JSX attributes other than className', () => {
    const code = '<div id="main" className="foo" data-test="value">Hello</div>';
    const result = transform(code);
    expect(result).toContain('id: "main"');
    expect(result).toContain('className: "prefix-foo"');
    expect(result).toContain('"data-test": "value"');
  });

  it('should handle JSX elements without className', () => {
    const code = '<div>Hello</div>';
    const result = transform(code);
    expect(result).toContain('React.createElement("div"');
  });

  it('should only transform className attributes', () => {
    const code = '<div className="foo" style={{ color: "red" }}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: "prefix-foo"');
    expect(result).toContain('style: {');
    expect(result).toContain('color: "red"');
  });

  it('should not transform member expressions', () => {
    const code = '<div className={styles.container}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('className: styles.container');
  });

  it('should not modify non-JSX code', () => {
    const code = 'const foo = "bar"; function test() { return 42; }';
    const result = transform(code);
    expect(result).toContain('const foo = "bar"');
    expect(result).toContain('function test()');
    expect(result).toContain('return 42');
  });

  it('should handle logical expressions with template literals in cn utility', () => {
    const code =
      '<div className={cn(isActive && `foo ${dynamic} bar`)}>Hello</div>';
    const result = transform(code);
    expect(result).toContain('isActive && `prefix-foo ${dynamic} prefix-bar`');
  });

  it('should handle conditional expressions with string literals in cn utility', () => {
    const code =
      '<div className={cn(isActive ? "active-class" : "inactive-class")}>Hello</div>';
    const result = transform(code);
    expect(result).toContain(
      'isActive ? "prefix-active-class" : "prefix-inactive-class"',
    );
  });

  it('should handle conditional expressions with template literals in cn utility', () => {
    const code =
      '<div className={cn(isActive ? `active-${dynamic}` : `inactive-${dynamic}`)}>Hello</div>';
    const result = transform(code);
    expect(result).toContain(
      'isActive ? `prefix-active-${dynamic}` : `prefix-inactive-${dynamic}`',
    );
  });

  it('should handle conditional expressions with mixed string and template literals in cn utility', () => {
    const code =
      '<div className={cn(isActive ? "active-class" : `inactive-${dynamic}`)}>Hello</div>';
    const result = transform(code);
    expect(result).toContain(
      'isActive ? "prefix-active-class" : `prefix-inactive-${dynamic}`',
    );
  });

  it('should handle conditional expressions with template literal and string literal in cn utility', () => {
    const code =
      '<div className={cn(isActive ? `active-${dynamic}` : "inactive-class")}>Hello</div>';
    const result = transform(code);
    expect(result).toContain(
      'isActive ? `prefix-active-${dynamic}` : "prefix-inactive-class"',
    );
  });
});
