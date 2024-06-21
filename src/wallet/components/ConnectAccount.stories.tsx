import { ConnectAccount } from "./ConnectAccount";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Wallet/ConnectAccount",
  component: ConnectAccount,
} satisfies Meta<typeof ConnectAccount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
