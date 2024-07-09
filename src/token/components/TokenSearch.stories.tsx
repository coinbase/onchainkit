import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { TokenSearch } from './TokenSearch';
import { getTokens } from '../core/getTokens';
import type { Token } from '../types';

const meta = {
  title: 'Token/TokenSearch',
  component: () => {
    const [tokens, setTokens] = React.useState<Token[]>([]);

    // TODO: This requires an API key
    const handleChange = React.useCallback(async () => {
      const data = await getTokens();
      // setTokens(data)
    }, []);

    return (
      <div>
        <TokenSearch onChange={handleChange} />
        {/** <pre>{JSON.stringify(tokens, null, 2)}</pre> */}
      </div>
    );
  },
  parameters: {
    layout: 'centered',
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
