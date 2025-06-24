import React from 'react';
import { render } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  test('should render card with children', () => {
    const { getByText } = render(<Card><div>Test Content</div></Card>);
    expect(getByText('Test Content')).toBeTruthy();
  });
});
