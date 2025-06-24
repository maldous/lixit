import { LIXI_SCHEMA_VERSION, DOCUMENT_TYPES, LOAN_PURPOSES, APPLICATION_STATUSES } from '../constants';

describe('Constants', () => {
  test('should export LIXI_SCHEMA_VERSION', () => {
    expect(LIXI_SCHEMA_VERSION).toBeDefined();
    expect(typeof LIXI_SCHEMA_VERSION).toBe('string');
  });

  test('should export DOCUMENT_TYPES', () => {
    expect(DOCUMENT_TYPES).toBeDefined();
    expect(Array.isArray(DOCUMENT_TYPES)).toBe(true);
  });

  test('should export LOAN_PURPOSES', () => {
    expect(LOAN_PURPOSES).toBeDefined();
    expect(Array.isArray(LOAN_PURPOSES)).toBe(true);
  });

  test('should export APPLICATION_STATUSES', () => {
    expect(APPLICATION_STATUSES).toBeDefined();
    expect(Array.isArray(APPLICATION_STATUSES)).toBe(true);
  });
});
