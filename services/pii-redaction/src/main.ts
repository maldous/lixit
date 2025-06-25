import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { cleanEnv, port, str } from 'envalid';

// Validate environment variables at startup
const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
});

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pii-redaction', timestamp: new Date().toISOString() });
});

// PII redaction endpoint
app.post('/api/redact', async (req, res) => {
  try {
    const { text, options = {} } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // TODO: Implement actual PII redaction using pii-extract-base
    const redactedText = text.replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[REDACTED_CARD]');
    
    res.json({
      original: text,
      redacted: redactedText,
      piiFound: ['credit_card'],
      confidence: 0.95,
    });
  } catch (error) {
    console.error('PII redaction error:', error);
    res.status(500).json({ error: 'Redaction failed' });
  }
});

// Consent management endpoint
app.post('/api/consent', async (req, res) => {
  try {
    const { userId, consentType, granted } = req.body;
    
    // TODO: Implement consent storage and management
    res.json({
      userId,
      consentType,
      granted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Consent management error:', error);
    res.status(500).json({ error: 'Consent management failed' });
  }
});

const server = app.listen(env.PORT, () => {
  console.log(`🔒 PII Redaction service running on port ${env.PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;