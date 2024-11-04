import { fn, within, userEvent, expect } from '@storybook/test';
import React from 'react';
import { getTokens } from '../../api/getTokens.js';
import { TokenSearch } from './TokenSearch.js';
import { jsx } from 'react/jsx-runtime';
const meta = {
  title: 'Token/TokenSearch',
  component: () => {
    // const [tokens, setTokens] = React.useState<Token[]>([]);

    // TODO: This requires an API key
    const handleChange = React.useCallback(async () => {
      const _data = await getTokens();
      // setTokens(data)
    }, []);
    return /*#__PURE__*/jsx("div", {
      children: /*#__PURE__*/jsx(TokenSearch, {
        onChange: handleChange
      })
    });
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    delayMs: 200,
    onChange: fn()
  }
};
const Basic = {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const Input = canvas.getByPlaceholderText('Search for a token');
    await userEvent.type(Input, 'eth', {
      delay: 300
    });
    const CloseButton = canvas.getByRole('button');
    expect(CloseButton).not.toBeUndefined();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(CloseButton);
  }
};
export { Basic, meta as default };
//# sourceMappingURL=TokenSearch.stories.js.map
