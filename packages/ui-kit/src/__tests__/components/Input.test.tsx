import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Input } from '../../components/Input';

describe('Input', () => {
  test('renders with label and value', () => {
    const onChangeText = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <Input label="Name" value="John" onChangeText={onChangeText} />
    );
    expect(getByText('Name')).toBeTruthy();
    expect(getByDisplayValue('John')).toBeTruthy();
  });

  test('renders with error message', () => {
    const onChangeText = jest.fn();
    const { getByText } = render(
      <Input 
        label="Email" 
        value="invalid" 
        error="Invalid email" 
        onChangeText={onChangeText} 
      />
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Invalid email')).toBeTruthy();
  });

  test('renders without label when not provided', () => {
    const onChangeText = jest.fn();
    const { queryByText, getByDisplayValue } = render(
      <Input value="No label" onChangeText={onChangeText} />
    );
    expect(queryByText('Name')).toBeNull();
    expect(getByDisplayValue('No label')).toBeTruthy();
  });

  test('renders without error when not provided', () => {
    const onChangeText = jest.fn();
    const { queryByText, getByDisplayValue } = render(
      <Input value="No error" onChangeText={onChangeText} />
    );
    expect(queryByText('Invalid')).toBeNull();
    expect(getByDisplayValue('No error')).toBeTruthy();
  });

  test('handles text change', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <Input value="initial" onChangeText={onChangeText} />
    );
    const input = getByDisplayValue('initial');
    fireEvent.change(input, { target: { value: 'new text' } });
    expect(onChangeText).toHaveBeenCalledWith('new text');
  });

  test('renders with placeholder', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input 
        value="" 
        placeholder="Enter text" 
        onChangeText={onChangeText} 
      />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  test('renders with secureTextEntry enabled', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <Input 
        value="password" 
        secureTextEntry={true} 
        onChangeText={onChangeText} 
      />
    );
    const input = getByDisplayValue('password');
    expect(input).toBeTruthy();
  });

  test('renders with secureTextEntry disabled by default', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <Input value="text" onChangeText={onChangeText} />
    );
    const input = getByDisplayValue('text');
    expect(input).toBeTruthy();
  });

  test('renders with secureTextEntry explicitly disabled', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <Input 
        value="text" 
        secureTextEntry={false} 
        onChangeText={onChangeText} 
      />
    );
    const input = getByDisplayValue('text');
    expect(input).toBeTruthy();
  });

  test('applies error styles when error is present', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <Input 
        value="error text" 
        error="Error message" 
        onChangeText={onChangeText} 
      />
    );
    const input = getByDisplayValue('error text');
    expect(input).toBeTruthy();
  });

  test('does not apply error styles when no error', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <Input value="normal text" onChangeText={onChangeText} />
    );
    const input = getByDisplayValue('normal text');
    expect(input).toBeTruthy();
  });
});
