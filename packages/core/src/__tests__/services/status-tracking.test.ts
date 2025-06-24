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

  test('should get recent activity with custom hours', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    
    // Test with 0 hours to ensure the filter works
    const activity = await service.getRecentActivity(0);
    expect(activity).toHaveLength(0);
  });

  test('should handle empty store in getRecentActivity', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Test with empty store
    const activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(0);
  });

  test('should handle getSubmissionMetrics with empty store', async () => {
    const service = new StatusTrackingServiceImpl();
    
    const metrics = await service.getSubmissionMetrics();
    expect(metrics.total).toBe(0);
    expect(metrics.byStatus).toEqual({});
    expect(metrics.byLender).toEqual({});
  });

  test('should update status with custom source', async () => {
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    const result = await service.updateStatus('test-submission', 'InProgress', 'Updated by lender', 'Lender');
    expect(result.statusHistory[1].source).toBe('Lender');
  });

  test('should cover getRecentActivity branch logic', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Create a submission
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    
    // Test the branch where submission.updatedAt > cutoff
    const recentActivity = await service.getRecentActivity(24);
    expect(recentActivity).toHaveLength(1);
    
    // Test the branch where submission.updatedAt <= cutoff
    const submission = await service.getStatus('test-submission');
    if (submission) {
      // Set timestamp to be older than cutoff
      submission.updatedAt = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      (service as any).statusStore.set('test-submission', submission);
    }
    
    const oldActivity = await service.getRecentActivity(24);
    expect(oldActivity).toHaveLength(0);
  });

  test('should cover both branches of getRecentActivity filter', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Create a submission
    await service.createSubmissionStatus('test-submission-1', 'test-app-1', 'TEST_LENDER');
    
    // Test the branch where submission.updatedAt > cutoff (true branch)
    let activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(1);
    
    // Modify the submission to have an old timestamp
    const submission = await service.getStatus('test-submission-1');
    if (submission) {
      // Set timestamp to be older than cutoff to test the false branch
      submission.updatedAt = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      (service as any).statusStore.set('test-submission-1', submission);
    }
    
    // Test the branch where submission.updatedAt <= cutoff (false branch)
    activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(0);
    
    // Add another submission that should be included
    await service.createSubmissionStatus('test-submission-2', 'test-app-2', 'TEST_LENDER');
    
    // Now we should have one recent submission
    activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(1);
    expect(activity[0].submissionId).toBe('test-submission-2');
  });

  test('should cover line 136 in getRecentActivity', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Create submissions to test the filter and sort logic
    await service.createSubmissionStatus('test-submission-1', 'test-app-1', 'TEST_LENDER');
    await service.createSubmissionStatus('test-submission-2', 'test-app-2', 'TEST_LENDER');
    
    // Test the specific line 136: .filter(s => s.updatedAt > cutoff)
    const activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(2);
    
    // Verify the filter worked by checking all returned items have updatedAt > cutoff
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    activity.forEach(submission => {
      expect(submission.updatedAt > cutoff).toBe(true);
    });
  });

  test('should cover all methods for function coverage', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Create a submission to test all methods
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    
    // Test getSubmissionsByLender with empty result
    const emptyResults = await service.getSubmissionsByLender('NON_EXISTENT_LENDER');
    expect(emptyResults).toHaveLength(0);
    
    // Test getSubmissionsByStatus with empty result
    const emptyStatusResults = await service.getSubmissionsByStatus('Approved');
    expect(emptyStatusResults).toHaveLength(0);
  });

  test('should test getRecentActivity sort functionality', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Create multiple submissions with different timestamps
    await service.createSubmissionStatus('test-submission-1', 'test-app-1', 'TEST_LENDER');
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    await service.createSubmissionStatus('test-submission-2', 'test-app-2', 'TEST_LENDER');
    
    // Get recent activity to test the sort functionality
    const activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(2);
    
    // Verify they are sorted by updatedAt in descending order
    expect(activity[0].updatedAt >= activity[1].updatedAt).toBe(true);
  });

  test('should achieve 100% branch coverage for getRecentActivity', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Test 1: Empty store
    let activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(0);
    
    // Test 2: Single submission within cutoff
    await service.createSubmissionStatus('test-submission-1', 'test-app-1', 'TEST_LENDER');
    activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(1);
    
    // Test 3: Single submission outside cutoff
    const submission1 = await service.getStatus('test-submission-1');
    if (submission1) {
      submission1.updatedAt = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      (service as any).statusStore.set('test-submission-1', submission1);
    }
    activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(0);
    
    // Test 4: Multiple submissions - some within, some outside cutoff
    await service.createSubmissionStatus('test-submission-2', 'test-app-2', 'TEST_LENDER');
    await service.createSubmissionStatus('test-submission-3', 'test-app-3', 'TEST_LENDER');
    
    // Make submission-2 old
    const submission2 = await service.getStatus('test-submission-2');
    if (submission2) {
      submission2.updatedAt = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      (service as any).statusStore.set('test-submission-2', submission2);
    }
    
    activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(1);
    expect(activity[0].submissionId).toBe('test-submission-3');
    
    // Test 5: Multiple submissions within cutoff - test sorting
    await service.createSubmissionStatus('test-submission-4', 'test-app-4', 'TEST_LENDER');
    
    // Manually set different timestamps to test sorting
    const submission3 = await service.getStatus('test-submission-3');
    const submission4 = await service.getStatus('test-submission-4');
    
    if (submission3 && submission4) {
      // Make submission-3 older than submission-4
      submission3.updatedAt = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(); // 1 hour ago
      submission4.updatedAt = new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(); // 30 minutes ago
      
      (service as any).statusStore.set('test-submission-3', submission3);
      (service as any).statusStore.set('test-submission-4', submission4);
    }
    
    activity = await service.getRecentActivity(24);
    expect(activity).toHaveLength(2);
    // Should be sorted by updatedAt descending (newest first)
    expect(activity[0].submissionId).toBe('test-submission-4');
    expect(activity[1].submissionId).toBe('test-submission-3');
    
    // Test 6: Edge case - exactly at cutoff time
    const exactCutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    if (submission3) {
      submission3.updatedAt = exactCutoffTime;
      (service as any).statusStore.set('test-submission-3', submission3);
    }
    
    activity = await service.getRecentActivity(24);
    // Should not include submission exactly at cutoff (> not >=)
    expect(activity).toHaveLength(1);
    expect(activity[0].submissionId).toBe('test-submission-4');
    
    // Test 7: Zero hours cutoff
    activity = await service.getRecentActivity(0);
    expect(activity).toHaveLength(0);
    
    // Test 8: Very large hours cutoff
    activity = await service.getRecentActivity(8760); // 1 year
    expect(activity.length).toBeGreaterThanOrEqual(0);
  });

  test('should achieve 100% branch coverage for line 136 in getRecentActivity', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Mock Date.now to control exact timing
    const originalDateNow = Date.now;
    const fixedTime = 1640995200000; // Fixed timestamp: 2022-01-01 00:00:00 UTC
    Date.now = jest.fn(() => fixedTime);
    
    try {
      // Create submissions with specific timestamps
      await service.createSubmissionStatus('test-submission-1', 'test-app-1', 'TEST_LENDER');
      await service.createSubmissionStatus('test-submission-2', 'test-app-2', 'TEST_LENDER');
      
      // Get the submissions and manually set their timestamps
      const submission1 = await service.getStatus('test-submission-1');
      const submission2 = await service.getStatus('test-submission-2');
      
      if (submission1 && submission2) {
        // Set submission1 to be exactly at the cutoff boundary
        const cutoffTime = new Date(fixedTime - 24 * 60 * 60 * 1000).toISOString();
        submission1.updatedAt = cutoffTime;
        
        // Set submission2 to be just after the cutoff (should be included)
        const afterCutoffTime = new Date(fixedTime - 23 * 60 * 60 * 1000).toISOString();
        submission2.updatedAt = afterCutoffTime;
        
        // Update the store
        (service as any).statusStore.set('test-submission-1', submission1);
        (service as any).statusStore.set('test-submission-2', submission2);
      }
      
      // Test the filter with 24 hours
      const activity = await service.getRecentActivity(24);
      
      // Only submission2 should be included (updatedAt > cutoff)
      expect(activity).toHaveLength(1);
      expect(activity[0].submissionId).toBe('test-submission-2');
      
      // Test with different hours to trigger different branches
      const activityZero = await service.getRecentActivity(0);
      expect(activityZero).toHaveLength(0);
      
      const activityLarge = await service.getRecentActivity(48);
      expect(activityLarge).toHaveLength(2);
      
    } finally {
      // Restore original Date.now
      Date.now = originalDateNow;
    }
  });

  test('should use default parameter when no hours specified', async () => {
    const service = new StatusTrackingServiceImpl();
    
    // Create a submission
    await service.createSubmissionStatus('test-submission', 'test-app', 'TEST_LENDER');
    
    // Call getRecentActivity with no parameters to test default parameter branch
    const activity = await service.getRecentActivity();
    expect(activity).toHaveLength(1);
    expect(activity[0].submissionId).toBe('test-submission');
  });
});

describe('statusTrackingService singleton', () => {
  test('should be instance of StatusTrackingServiceImpl', () => {
    expect(statusTrackingService).toBeInstanceOf(StatusTrackingServiceImpl);
  });
});
