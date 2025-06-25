import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI Kit/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    secureTextEntry: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const InputWithState = (args: Partial<React.ComponentProps<typeof Input>> & { [key: string]: unknown }) => {
  const [value, setValue] = useState(args.value || '');
  return <Input {...args} value={value} onChangeText={setValue} />;
};

export const Default: Story = {
  render: InputWithState,
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: '',
  },
};

export const WithValue: Story = {
  render: InputWithState,
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    value: 'John Doe',
  },
};

export const Password: Story = {
  render: InputWithState,
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    secureTextEntry: true,
    value: '',
  },
};

export const WithError: Story = {
  render: InputWithState,
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};
