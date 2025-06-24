import { formatCurrency, formatDate, formatPhoneNumber, validateEmail } from '../../utils/format';

describe('Format Utilities', () => {
  test('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  test('should format date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('2023-01-01');
  });

  test('should format phone number correctly', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });

  test('should validate email correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
