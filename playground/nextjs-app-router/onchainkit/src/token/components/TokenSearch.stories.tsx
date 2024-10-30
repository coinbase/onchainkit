import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import React from 'react';
import { getTokens } from '../../api/getTokens';
import { TokenSearch } from './TokenSearch';

const meta = {
  title: 'Token/TokenSearch',
  component: () => {
    // const [tokens, setTokens] = React.useState<Token[]>([]);

    // TODO: This requires an API key
    const handleChange = React.useCallback(async () => {
      const _data = await getTokens();
      // setTokens(data)
    }, []);

    return (
      <div>
        <TokenSearch onChange={handleChange} />
        {/** <pre>{JSON.stringify(tokens, null, 2)}</pre> */}
      </div>
    );
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    delayMs: 200,
    onChange: fn(),
  },
} satisfies Meta<typeof TokenSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const Input = canvas.getByPlaceholderText('Search for a token');

    await userEvent.type(Input, 'eth', { delay: 300 });

    const CloseButton = canvas.getByRole('button');
    expect(CloseButton).not.toBeUndefined();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await userEvent.click(CloseButton);
  },
};
