import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import postcssCreateScopedStyles from '../postcss-create-scoped-styles.js';

describe('postcssCreateScopedStyles', () => {
  const runPlugin = (input: string, options = {}) => {
    return postcss([postcssCreateScopedStyles(options)])
      .process(input, { from: undefined })
      .then((result) => result.css);
  };

  it('should split :root variables by --ock- prefix', async () => {
    const input = `
      :root {
        --ock-primary: blue;
        --font-mono: monospace;
        --color-red: red;
      }
    `;

    const output = await runPlugin(input);

    expect(output).toContain('--ock-primary: blue');
    expect(output).toContain(':root');
    expect(output).toContain('--ock-font-mono: monospace');
    expect(output).toContain('--ock-color-red: red');
  });

  it('should transform global element selectors', async () => {
    const input = `
      * {
        box-sizing: border-box;
      }
      html {
        font-family: Inter;
      }
    `;

    const output = await runPlugin(input);

    expect(output).toContain('.ock\\:el {');
    expect(output).toContain('box-sizing: border-box');
    expect(output).toContain('font-family: Inter');
  });

  it('should not transform existing .ock: prefixed classes', async () => {
    const input = `
      .ock\\:bg-primary {
        background: blue;
      }
    `;

    const output = await runPlugin(input);

    expect(output).toContain('.ock\\:bg-primary');
    expect(output).not.toContain('.ock\\:el .ock\\:bg-primary');
  });

  it('should transform pseudo-elements correctly', async () => {
    const input = `
      ::before {
        content: '';
      }
    `;

    const output = await runPlugin(input);

    expect(output).toContain(':where(.ock\\:el)::before');
  });

  it('should move @import rules to top', async () => {
    const input = `
      .foo { color: red; }
      @import "test.css";
      .bar { color: blue; }
    `;

    const output = await runPlugin(input);
    const lines = output.trim().split('\n');
    expect(lines[0]).toContain('@import');
  });

  it('should consolidate layers when enabled', async () => {
    const input = `
      @layer theme {
        .theme { color: blue; }
      }
      @layer base {
        .base { margin: 0; }
      }
    `;

    const output = await runPlugin(input, { consolidateLayers: true });
    expect(output).not.toContain('@layer onchainkit');
    expect(output).not.toContain('@layer theme');
    expect(output).not.toContain('@layer base');
    expect(output).toContain('Theme section');
    expect(output).toContain('Base section');
  });

  it('should transform @keyframes names', async () => {
    const input = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('@keyframes ock-fadeIn');
  });

  it('should transform animation references', async () => {
    const input = `
      @keyframes fadeIn {
        from { opacity: 0; }
      }
      .element {
        animation: fadeIn 1s;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('animation: ock-fadeIn 1s');
  });

  it('should transform @property rules', async () => {
    const input = `
      @property --custom-color {
        syntax: "<color>";
        inherits: false;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('@property --ock-custom-color');
  });

  it('should handle @supports rules', async () => {
    const input = `
      @supports (display: grid) {
        .grid {
          display: grid;
          --spacing: 10px;
        }
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('@supports');
    expect(output).toContain('--ock-spacing');
  });

  it('should skip keyframes content transformation', async () => {
    const input = `
      @keyframes slide {
        from { transform: translateX(0); }
        to { transform: translateX(100px); }
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('from');
    expect(output).toContain('to');
  });

  it('should transform variable references in values', async () => {
    const input = `
      .element {
        color: var(--primary);
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('var(--ock-primary)');
  });

  it('should transform variable references with fallbacks', async () => {
    const input = `
      .element {
        color: var(--primary, blue);
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('var(--ock-primary, blue)');
  });

  it('should transform nested variable references', async () => {
    const input = `
      .element {
        color: var(--primary, var(--fallback));
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('var(--ock-primary, var(--ock-fallback))');
  });

  it('should handle :host selector', async () => {
    const input = `
      :host {
        display: block;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('.ock\\:el:host {');
  });

  it('should handle element selectors with pseudo-classes', async () => {
    const input = `
      input:focus {
        outline: 2px solid blue;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('input:where(.ock\\:el):focus');
  });

  it('should handle ::after pseudo-element', async () => {
    const input = `
      ::after {
        content: '';
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain(':where(.ock\\:el)::after');
  });

  it('should handle ::backdrop pseudo-element', async () => {
    const input = `
      ::backdrop {
        background: rgba(0,0,0,0.5);
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain(':where(.ock\\:el)::backdrop');
  });

  it('should handle functional pseudo-classes', async () => {
    const input = `
      :where(.class) {
        color: red;
      }
      :is(.class) {
        color: blue;
      }
      :not(.class) {
        color: green;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('.ock\\:el:where(.class)');
    expect(output).toContain('.ock\\:el:is(.class)');
    expect(output).toContain('.ock\\:el:not(.class)');
  });

  it('should skip selectors with & parent reference', async () => {
    const input = `
      .parent {
        &:hover {
          color: red;
        }
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('&:hover');
  });

  it('should skip theme selectors', async () => {
    const input = `
      [data-ock-theme="dark"] {
        --bg: black;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('[data-ock-theme="dark"]');
    expect(output).not.toContain('.ock\\:el [data-ock-theme');
  });

  it('should handle animation-name property', async () => {
    const input = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .spinner {
        animation-name: spin;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('animation-name: ock-spin');
  });

  it('should handle element selectors with attribute selectors', async () => {
    const input = `
      input[type="text"] {
        border: 1px solid gray;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('input:where(.ock\\:el)[type="text"]');
  });

  it('should handle multiple selectors', async () => {
    const input = `
      h1, h2, h3 {
        margin: 0;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('h1:where(.ock\\:el)');
    expect(output).toContain('h2:where(.ock\\:el)');
    expect(output).toContain('h3:where(.ock\\:el)');
  });

  it('should handle :root, :host combined selector', async () => {
    const input = `
      :root, :host {
        --color: red;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('--ock-color: red');
  });

  it('should handle custom scope class option', async () => {
    const input = `
      html {
        font-size: 16px;
      }
    `;

    const output = await runPlugin(input, { scopeClass: '.custom' });
    expect(output).toContain('.custom {');
  });

  it('should handle pseudo-selectors like :focus', async () => {
    const input = `
      :focus {
        outline: 2px solid blue;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('.ock\\:el:focus');
  });

  it('should handle complex element selectors', async () => {
    const input = `
      body {
        margin: 0;
      }
      hr {
        border: 0;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('body:where(.ock\\:el)');
    expect(output).toContain('hr:where(.ock\\:el)');
  });

  it('should handle layer declarations without content', async () => {
    const input = `
      @layer theme, base, utilities;
      @layer theme {
        .theme { color: blue; }
      }
    `;

    const output = await runPlugin(input, { consolidateLayers: true });
    expect(output).not.toContain('@layer onchainkit');
    expect(output).not.toContain('@layer theme, base, utilities');
    expect(output).toContain('Theme section');
  });

  it('should handle multiple imports', async () => {
    const input = `
      @import "first.css";
      @import "second.css";
      .element { color: red; }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('@import "first.css"');
    expect(output).toContain('@import "second.css"');
    // Imports should be at the top
    expect(output.indexOf('@import "first.css"')).toBeLessThan(
      output.indexOf('.element'),
    );
  });

  it('should handle ::file-selector-button pseudo-element', async () => {
    const input = `
      ::file-selector-button {
        padding: 10px;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain(':where(.ock\\:el)::file-selector-button');
  });

  it('should handle :has() functional pseudo-class', async () => {
    const input = `
      :has(.child) {
        color: red;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('.ock\\:el:has(.child)');
  });

  it('should handle variable declarations in keyframes with animation reference', async () => {
    const input = `
      @keyframes fadeIn {
        to {
          opacity: 1;
          --animate-delay: fadeIn;
        }
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('--animate-delay: ock-fadeIn');
  });

  it('should handle selectors with parentheses in :not()', async () => {
    const input = `
      :not(.foo, .bar) {
        color: red;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('.ock\\:el:not(.foo, .bar)');
  });

  it('should transform variables in @supports params', async () => {
    const input = `
      @supports (--custom: value) {
        .element {
          color: var(--custom);
        }
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('var(--ock-custom)');
  });

  it('should transform animation variables with empty fallback', async () => {
    const input = `
      .element {
        color: var(--primary,);
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('var(--ock-primary,)');
  });

  it('should handle complex selectors with class combinations', async () => {
    const input = `
      div.container {
        margin: 0;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('.ock\\:el div.container');
  });

  it('should handle other non-element selectors', async () => {
    const input = `
      .custom-class {
        color: red;
      }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('.ock\\:el .custom-class');
  });

  it('should handle single import with proper formatting', async () => {
    const input = `
      @import "single.css";
      .element { color: red; }
    `;

    const output = await runPlugin(input);
    expect(output).toContain('@import "single.css"');
  });

  it('should handle layer with no matching content', async () => {
    const input = `
      @layer properties {
        .prop { color: blue; }
      }
    `;

    const output = await runPlugin(input, { consolidateLayers: true });
    expect(output).not.toContain('@layer onchainkit');
    expect(output).not.toContain('@layer properties');
    expect(output).toContain('Properties section');
  });

  it('should insert layers after imports when consolidating', async () => {
    const input = `
      @import "first.css";
      @layer theme {
        .theme { color: blue; }
      }
      @layer base {
        .base { margin: 0; }
      }
    `;

    const output = await runPlugin(input, { consolidateLayers: true });
    const lines = output.trim().split('\n');
    expect(lines[0]).toContain('@import');
    expect(output).toContain('Theme section');
    expect(output).toContain('Base section');
    expect(output).not.toContain('@layer theme');
    expect(output).not.toContain('@layer base');
  });
});
