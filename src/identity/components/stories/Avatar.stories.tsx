import { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../Avatar";

const meta = {
  title: "Identity/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    address: "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9",
  },
};
