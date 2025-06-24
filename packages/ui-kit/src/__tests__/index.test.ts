import { Button, Card, Input } from '../index';

describe('UI Kit', () => {
  test('should export Button component', () => {
    expect(Button).toBeDefined();
  });

  test('should export Card component', () => {
    expect(Card).toBeDefined();
  });

  test('should export Input component', () => {
    expect(Input).toBeDefined();
  });
});
