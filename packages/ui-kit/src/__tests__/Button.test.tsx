import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  test('should render button with text', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('should handle onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPress} />);
    getByText('Test').click();
    expect(onPress).toHaveBeenCalled();
  });
});
