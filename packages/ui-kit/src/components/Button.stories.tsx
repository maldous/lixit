import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI Kit/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "Primary Button",
    variant: "primary",
    onPress: () => console.log("Primary button pressed"),
  },
};

export const Secondary: Story = {
  args: {
    title: "Secondary Button",
    variant: "secondary",
    onPress: () => console.log("Secondary button pressed"),
  },
};

export const Disabled: Story = {
  args: {
    title: "Disabled Button",
    variant: "primary",
    disabled: true,
    onPress: () => console.log("This should not fire"),
  },
};
