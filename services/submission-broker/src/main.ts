import express from 'express';
import helmet  from 'helmet';
import cors    from 'cors';

console.log('Submission Broker Service');

/* ────────────────────────────────────────────────────────── */
/*  Thin service object – plug real lender integration here  */
/* ────────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────── */
/*  Express app setup                                         */
/* ────────────────────────────────────────────────────────── */
const app = express();

/* Security middleware */
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development' ? true : ['https://lixit.local'],
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));

/* Health check */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'submission-broker',
    timestamp: new Date().toISOString(),
  });
});

/* Submit endpoint */
app.post('/submit', async (req, res) => {
  try {
    const { data, lenderCode } = req.body as {
      data: Record<string, unknown>;
      lenderCode?: string;
    };

    if (!lenderCode) {
      res.status(400).json({ error: 'lenderCode is required' });
      return;                                   // ← nothing is returned
    }

    const result = await submissionBrokerService.submitToLender(
      data,
      lenderCode,
    );
    res.json(result);                           // ← no “return” statement
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

/* Error-handling middleware */
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  },
);

/* Start server */
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`🚀  Submission Broker Service running on port ${port}`);
});

/* Graceful shutdown */
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Submission Broker Service terminated');
  });
});

export default app;

