import { DOCUMENT_TYPES, LOAN_PURPOSES, APPLICATION_STATUSES } from '../constants';

describe('Constants', () => {
  test('should export DOCUMENT_TYPES', () => {
    expect(DOCUMENT_TYPES).toBeDefined();
    expect(typeof DOCUMENT_TYPES).toBe('object');
  });

  test('should export LOAN_PURPOSES', () => {
    expect(LOAN_PURPOSES).toBeDefined();
    expect(typeof LOAN_PURPOSES).toBe('object');
  });

  test('should export APPLICATION_STATUSES', () => {
    expect(APPLICATION_STATUSES).toBeDefined();
    expect(typeof APPLICATION_STATUSES).toBe('object');
  });
});
