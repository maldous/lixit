import { format, parseISO } from 'date-fns';

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency = 'AUD'): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format dates for LIXI
 */
export const formatLIXIDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Format dates for display
 */
export const formatDisplayDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

/**
 * Convert frequency to annual multiplier
 */
export const getAnnualMultiplier = (frequency: string): number => {
  switch (frequency.toLowerCase()) {
    case 'weekly':
      return 52;
    case 'fortnightly':
      return 26;
    case 'monthly':
      return 12;
    case 'annually':
      return 1;
    default:
      return 1;
  }
};

/**
 * Convert amount to annual equivalent
 */
export const convertToAnnual = (amount: number, frequency: string): number => {
  return amount * getAnnualMultiplier(frequency);
};

/**
 * Generate unique ID
 */
export const generateUniqueId = (prefix = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
};

/**
 * Sanitize file name
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Get file extension
 */
export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Get MIME type from file extension
 */
export const getMimeType = (fileName: string): string => {
  const ext = getFileExtension(fileName);
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain',
    csv: 'text/csv',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
