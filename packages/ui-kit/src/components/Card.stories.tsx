import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "react-native";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI Kit/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    padding: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Text>This is a card with default padding</Text>,
  },
};

export const CustomPadding: Story = {
  args: {
    padding: 32,
    children: <Text>This is a card with custom padding (32px)</Text>,
  },
};

export const NoPadding: Story = {
  args: {
    padding: 0,
    children: (
      <Text style={{ padding: 16 }}>
        This is a card with no padding (content has its own padding)
      </Text>
    ),
  },
};
