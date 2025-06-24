import { SubmissionBrokerService, submissionBrokerService } from '../main';

describe('SubmissionBrokerService', () => {
  let service: SubmissionBrokerService;

  beforeEach(() => {
    service = new SubmissionBrokerService();
  });

  test('should submit to lender successfully', async () => {
    const data = { test: 'data' };
    const result = await service.submitToLender(data, 'TEST_LENDER');
    expect(result.success).toBe(true);
    expect(result.id).toContain('TEST_LENDER');
    expect(result.id).toMatch(/TEST_LENDER-\d+/);
  });

  test('should handle different lender codes', async () => {
    const data = { application: 'test' };
    const result = await service.submitToLender(data, 'ANOTHER_LENDER');
    expect(result.success).toBe(true);
    expect(result.id).toContain('ANOTHER_LENDER');
  });
});

describe('submissionBrokerService singleton', () => {
  test('should be instance of SubmissionBrokerService', () => {
    expect(submissionBrokerService).toBeInstanceOf(SubmissionBrokerService);
  });

  test('should be the same instance when accessed multiple times', () => {
    const instance1 = submissionBrokerService;
    const instance2 = submissionBrokerService;
    expect(instance1).toBe(instance2);
  });
});
