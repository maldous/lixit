import { 
  SubmissionStatus, 
  StatusHistoryEntry, 
  ApplicationStatus, 
  GeneratedFile 
} from '../types/lixi';

export interface StatusTrackingService {
  createSubmissionStatus(submissionId: string, applicationId: string, lenderCode: string): Promise<SubmissionStatus>;
  updateStatus(submissionId: string, status: ApplicationStatus, notes?: string, source?: 'System' | 'Lender' | 'User'): Promise<SubmissionStatus>;
  getStatus(submissionId: string): Promise<SubmissionStatus | null>;
  addGeneratedFile(submissionId: string, file: GeneratedFile): Promise<SubmissionStatus>;
  getStatusHistory(submissionId: string): Promise<StatusHistoryEntry[]>;
  getSubmissionsByStatus(status: ApplicationStatus): Promise<SubmissionStatus[]>;
  getSubmissionsByLender(lenderCode: string): Promise<SubmissionStatus[]>;
}

export class StatusTrackingServiceImpl implements StatusTrackingService {
  private statusStore = new Map<string, SubmissionStatus>();

  async createSubmissionStatus(
    submissionId: string, 
    applicationId: string, 
    lenderCode: string
  ): Promise<SubmissionStatus> {
    const now = new Date().toISOString();
    
    const status: SubmissionStatus = {
      submissionId,
      applicationId,
      lenderCode,
      status: 'Submitted',
      statusHistory: [{
        status: 'Submitted',
        timestamp: now,
        notes: 'Initial submission created',
        source: 'System',
      }],
      createdAt: now,
      updatedAt: now,
      files: [],
    };

    this.statusStore.set(submissionId, status);
    return status;
  }

  async updateStatus(
    submissionId: string, 
    status: ApplicationStatus, 
    notes?: string, 
    source: 'System' | 'Lender' | 'User' = 'System'
  ): Promise<SubmissionStatus> {
    const existingStatus = this.statusStore.get(submissionId);
    if (!existingStatus) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const now = new Date().toISOString();
    const historyEntry: StatusHistoryEntry = {
      status,
      timestamp: now,
      notes,
      source,
    };

    const updatedStatus: SubmissionStatus = {
      ...existingStatus,
      status,
      statusHistory: [...existingStatus.statusHistory, historyEntry],
      updatedAt: now,
    };

    this.statusStore.set(submissionId, updatedStatus);
    return updatedStatus;
  }

  async getStatus(submissionId: string): Promise<SubmissionStatus | null> {
    return this.statusStore.get(submissionId) || null;
  }

  async addGeneratedFile(submissionId: string, file: GeneratedFile): Promise<SubmissionStatus> {
    const existingStatus = this.statusStore.get(submissionId);
    if (!existingStatus) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const updatedStatus: SubmissionStatus = {
      ...existingStatus,
      files: [...existingStatus.files, file],
      updatedAt: new Date().toISOString(),
    };

    this.statusStore.set(submissionId, updatedStatus);
    return updatedStatus;
  }

  async getStatusHistory(submissionId: string): Promise<StatusHistoryEntry[]> {
    const status = this.statusStore.get(submissionId);
    return status?.statusHistory || [];
  }

  async getSubmissionsByStatus(status: ApplicationStatus): Promise<SubmissionStatus[]> {
    return Array.from(this.statusStore.values()).filter(s => s.status === status);
  }

  async getSubmissionsByLender(lenderCode: string): Promise<SubmissionStatus[]> {
    return Array.from(this.statusStore.values()).filter(s => s.lenderCode === lenderCode);
  }

  // Utility methods for monitoring and reporting
  async getSubmissionMetrics(): Promise<{
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    byLender: Record<string, number>;
  }> {
    const allSubmissions = Array.from(this.statusStore.values());
    
    const byStatus = allSubmissions.reduce((acc, submission) => {
      acc[submission.status] = (acc[submission.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    const byLender = allSubmissions.reduce((acc, submission) => {
      acc[submission.lenderCode] = (acc[submission.lenderCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: allSubmissions.length,
      byStatus,
      byLender,
    };
  }

  async getRecentActivity(hours = 24): Promise<SubmissionStatus[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    return Array.from(this.statusStore.values())
      .filter(s => s.updatedAt > cutoff)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export const statusTrackingService = new StatusTrackingServiceImpl();
