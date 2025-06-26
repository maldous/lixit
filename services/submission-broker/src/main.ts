import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

console.log("Submission Broker Service");

export class SubmissionBrokerService {
  async submitToLender(
    data: Record<string, unknown>,
    lenderCode: string,
  ): Promise<{ success: boolean; id: string }> {
    // TODO: Implement actual lender submission logic
    return {
      success: true,
      id: `${lenderCode}-${Date.now()}`,
    };
  }
}

export const submissionBrokerService = new SubmissionBrokerService();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? true : ['https://lixit.local'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'submission-broker', timestamp: new Date().toISOString() });
});

// Submit endpoint
app.post('/submit', async (req, res) => {
  try {
    const { data, lenderCode } = req.body;
    
    if (!lenderCode) {
      return res.status(400).json({ error: 'lenderCode is required' });
    }
    
    const result = await submissionBrokerService.submitToLender(data, lenderCode);
    res.json(result);
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🚀 Submission Broker Service running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Submission Broker Service terminated');
  });
});

export default app;
