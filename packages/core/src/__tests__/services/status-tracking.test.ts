import { StatusTrackingServiceImpl, statusTrackingService } from '../../services/status-tracking';

describe('StatusTrackingServiceImpl', () => {
  let service: StatusTrackingServiceImpl;

  beforeEach(() => {
    service = new StatusTrackingServiceImpl();
  });

  test('should create submission status', async () => {
    const result = await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    expect(result.submissionId).toBe('test-submission');
    expect(result.applicationId).toBe('test-app');
    expect(result.lenderCode).toBe('TEST_LENDER');
    expect(result.status).toBe('Submitted');
  });

  test('should update submission status', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    const result = await service.updateStatus('test-submission', 'InProgress', 'Processing application');
    expect(result.status).toBe('InProgress');
    expect(result.statusHistory).toHaveLength(2);
  });

  test('should throw error when updating non-existent submission', async () => {
    await expect(service.updateStatus('non-existent', 'InProgress')).rejects.toThrow('Submission non-existent not found');
  });

  test('should get submission status', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    const result = await service.getStatus('test-submission');
    expect(result?.submissionId).toBe('test-submission');
  });

  test('should return null for non-existent submission', async () => {
    const result = await service.getStatus('non-existent');
    expect(result).toBeNull();
  });

  test('should get all submissions for lender', async () => {
    await service.createSubmissionStatus('test-submission-1', 'test-app-1', 'TEST_LENDER');
    await service.createSubmissionStatus('test-submission-2', 'test-app-2', 'TEST_LENDER');
    const results = await service.getSubmissionsByLender('TEST_LENDER');
    expect(results).toHaveLength(2);
  });

  test('should add generated file', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    const file = {
      id: 'file-1',
      type: 'JSON' as const,
      fileName: 'test.json',
      filePath: '/test.json',
      fileSize: 1024,
      mimeType: 'application/json',
      createdAt: new Date().toISOString(),
      submissionId: 'test-submission'
    };
    const result = await service.addGeneratedFile('test-submission', file);
    expect(result.files).toHaveLength(1);
  });

  test('should throw error when adding file to non-existent submission', async () => {
    const file = {
      id: 'file-1',
      type: 'JSON' as const,
      fileName: 'test.json',
      filePath: '/test.json',
      fileSize: 1024,
      mimeType: 'application/json',
      createdAt: new Date().toISOString(),
      submissionId: 'test-submission'
    };
    await expect(service.addGeneratedFile('non-existent', file)).rejects.toThrow('Submission non-existent not found');
  });

  test('should get status history', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    const history = await service.getStatusHistory('test-submission');
    expect(history).toHaveLength(1);
  });

  test('should return empty array for non-existent submission history', async () => {
    const history = await service.getStatusHistory('non-existent');
    expect(history).toEqual([]);
  });

  test('should get submissions by status', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    const results = await service.getSubmissionsByStatus('Submitted');
    expect(results).toHaveLength(1);
  });

  test('should get submission metrics', async () => {
    await service.createSubmissionStatus('test-submission-1', 'test-app-1', 'TEST_LENDER');
    await service.createSubmissionStatus('test-submission-2', 'test-app-2', 'ANOTHER_LENDER');
    
    const metrics = await service.getSubmissionMetrics();
    expect(metrics.total).toBe(2);
    expect(metrics.byStatus.Submitted).toBe(2);
    expect(metrics.byLender.TEST_LENDER).toBe(1);
    expect(metrics.byLender.ANOTHER_LENDER).toBe(1);
  });

  test('should get recent activity', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    
    const activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(1);
    expect(activity[0].submissionId).toBe('test-submission');
  });

  test('should update status with custom source', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    const result = await service.updateStatus('test-submission', 'InProgress', 'Updated by lender', 'Lender');
    expect(result.statusHistory[1].source).toBe('Lender');
  });
});

describe('statusTrackingService singleton', () => {
  test('should be instance of StatusTrackingServiceImpl', () => {
    expect(statusTrackingService).toBeInstanceOf(StatusTrackingServiceImpl);
  });
});
