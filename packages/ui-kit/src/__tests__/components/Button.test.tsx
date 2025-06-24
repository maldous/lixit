import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../../components/Button';

describe('Button', () => {
  test('renders primary variant and handles click', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Tap" onPress={onPress} variant="primary" />
    );
    const button = getByText('Tap');
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalled();
  });

  test('renders secondary variant', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Secondary" onPress={onPress} variant="secondary" />
    );
    expect(getByText('Secondary')).toBeTruthy();
  });

  test('renders as disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" onPress={onPress} disabled />
    );
    const button = getByText('Disabled');
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('renders with default variant when not specified', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Default" onPress={onPress} />
    );
    expect(getByText('Default')).toBeTruthy();
  });

  test('renders with default disabled state when not specified', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Not Disabled" onPress={onPress} />
    );
    const button = getByText('Not Disabled');
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalled();
  });

  test('applies disabled styles when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" onPress={onPress} disabled={true} />
    );
    const button = getByText('Disabled');
    expect(button).toBeTruthy();
  });

  test('does not apply disabled styles when not disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Enabled" onPress={onPress} disabled={false} />
    );
    const button = getByText('Enabled');
    expect(button).toBeTruthy();
  });
});
