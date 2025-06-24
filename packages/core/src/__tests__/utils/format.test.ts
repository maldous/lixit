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
    expect(formatPercentage(0)).toBe('0.00%');
    expect(formatPercentage(1)).toBe('100.00%');
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
    expect(getAnnualMultiplier('WEEKLY')).toBe(52); // Test case insensitive
  });

  test('should convert to annual correctly', () => {
    expect(convertToAnnual(1000, 'monthly')).toBe(12000);
    expect(convertToAnnual(500, 'weekly')).toBe(26000);
    expect(convertToAnnual(0, 'monthly')).toBe(0);
  });

  test('should generate unique ID', () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    expect(id1).not.toBe(id2);
    
    const prefixedId = generateUniqueId('test');
    expect(prefixedId).toContain('test-');
    
    const emptyPrefixId = generateUniqueId('');
    expect(emptyPrefixId.length).toBeGreaterThan(0);
  });

  test('should sanitize file name', () => {
    expect(sanitizeFileName('test file.pdf')).toBe('test_file.pdf');
    expect(sanitizeFileName('test__file')).toBe('test_file');
    expect(sanitizeFileName('_test_file_')).toBe('test_file');
    expect(sanitizeFileName('test@#$%file.pdf')).toBe('test_file.pdf');
  });

  test('should get file extension', () => {
    expect(getFileExtension('test.pdf')).toBe('pdf');
    expect(getFileExtension('test.DOC')).toBe('doc');
    expect(getFileExtension('test')).toBe('');
    expect(getFileExtension('test.multiple.extensions.txt')).toBe('txt');
    expect(getFileExtension('')).toBe('');
  });

  test('should get MIME type', () => {
    expect(getMimeType('test.pdf')).toBe('application/pdf');
    expect(getMimeType('test.jpg')).toBe('image/jpeg');
    expect(getMimeType('test.jpeg')).toBe('image/jpeg');
    expect(getMimeType('test.png')).toBe('image/png');
    expect(getMimeType('test.doc')).toBe('application/msword');
    expect(getMimeType('test.docx')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(getMimeType('test.xls')).toBe('application/vnd.ms-excel');
    expect(getMimeType('test.xlsx')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(getMimeType('test.txt')).toBe('text/plain');
    expect(getMimeType('test.csv')).toBe('text/csv');
    expect(getMimeType('test.gif')).toBe('image/gif');
    expect(getMimeType('test.unknown')).toBe('application/octet-stream');
    expect(getMimeType('test')).toBe('application/octet-stream');
  });

  test('should format file size', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(512)).toBe('512 Bytes');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });
});
