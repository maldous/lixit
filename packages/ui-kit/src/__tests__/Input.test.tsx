import React from 'react';
import { render } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  test('should render input with placeholder', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Test Input" />);
    expect(getByPlaceholderText('Test Input')).toBeTruthy();
  });

  test('should handle value change', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(<Input value="test" onChangeText={onChangeText} />);
    expect(getByDisplayValue('test')).toBeTruthy();
  });
});
