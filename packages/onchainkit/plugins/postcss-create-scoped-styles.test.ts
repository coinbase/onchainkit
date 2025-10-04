import postcss from 'postcss';
import postcssCreateScopedStyles from './postcss-create-scoped-styles.js';

describe('postcssCreateScopedStyles', () => {
  const runPlugin = (input: string) => {
    return postcss([postcssCreateScopedStyles()])
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
});
