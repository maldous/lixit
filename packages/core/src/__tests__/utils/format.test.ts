import { 
  formatCurrency, 
  formatPercentage, 
  formatLIXIDate, 
  formatDisplayDate,
  getAnnualMultiplier,
  convertToAnnual,
  generateUniqueId,
  sanitizeFileName,
  getFileExtension,
  getMimeType,
  formatFileSize
} from '../../utils/format';

describe('Format Utilities', () => {
  test('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1234.56, 'USD')).toContain('1,234.56');
  });

  test('should format percentage correctly', () => {
    expect(formatPercentage(0.1234)).toBe('12.34%');
    expect(formatPercentage(0.1234, 1)).toBe('12.3%');
  });

  test('should format LIXI date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatLIXIDate(date)).toBe('2023-01-01');
    expect(formatLIXIDate('2023-01-01')).toBe('2023-01-01');
  });

  test('should format display date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDisplayDate(date)).toBe('01/01/2023');
  });

  test('should get annual multiplier correctly', () => {
    expect(getAnnualMultiplier('weekly')).toBe(52);
    expect(getAnnualMultiplier('fortnightly')).toBe(26);
    expect(getAnnualMultiplier('monthly')).toBe(12);
    expect(getAnnualMultiplier('annually')).toBe(1);
    expect(getAnnualMultiplier('unknown')).toBe(1);
  });

  test('should convert to annual correctly', () => {
    expect(convertToAnnual(1000, 'monthly')).toBe(12000);
    expect(convertToAnnual(500, 'weekly')).toBe(26000);
  });

  test('should generate unique ID', () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    expect(id1).not.toBe(id2);
    
    const prefixedId = generateUniqueId('test');
    expect(prefixedId).toContain('test-');
  });

  test('should sanitize file name', () => {
    expect(sanitizeFileName('test file.pdf')).toBe('test_file.pdf');
    expect(sanitizeFileName('test__file')).toBe('test_file');
  });

  test('should get file extension', () => {
    expect(getFileExtension('test.pdf')).toBe('pdf');
    expect(getFileExtension('test.DOC')).toBe('doc');
    expect(getFileExtension('test')).toBe('');
  });

  test('should get MIME type', () => {
    expect(getMimeType('test.pdf')).toBe('application/pdf');
    expect(getMimeType('test.jpg')).toBe('image/jpeg');
    expect(getMimeType('test.unknown')).toBe('application/octet-stream');
  });

  test('should format file size', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
  });
});
