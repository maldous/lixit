console.log("Submission Broker Service");

export class SubmissionBrokerService {
  async submitToLender(
    data: Record<string, unknown>,
    lenderCode: string,
  ): Promise<{ success: boolean; id: string }> {
    return {
      success: true,
      id: `${lenderCode}-${Date.now()}`,
    };
  }
}

export const submissionBrokerService = new SubmissionBrokerService();
