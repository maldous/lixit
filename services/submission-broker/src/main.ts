import express from 'express';

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

// Add HTTP server
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'submission-broker' });
});

app.post('/submit', async (req, res) => {
  const { data, lenderCode } = req.body;
  const result = await submissionBrokerService.submitToLender(data, lenderCode);
  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Submission Broker Service running on port ${port}`);
});
