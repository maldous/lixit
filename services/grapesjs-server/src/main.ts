import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { cleanEnv, port, str, url } from 'envalid';

/**
 * Relaxed defaults so the service boots in dev without env-vars.
 * Production still overrides via real secrets-/config-maps.
 */
const env = cleanEnv(process.env, {
  PORT:               port({ default: 3000 }),
  NODE_ENV:           str({ choices: ['development', 'test', 'production'], default: 'development' }),

  DATABASE_URL:       url({ default: 'postgres://user:pass@localhost:5432/lixit' }),
  S3_ENDPOINT:        url({ default: 'http://minio:9000' }),
  S3_ACCESS_KEY:      str({ default: 'minioadmin' }),
  S3_SECRET_KEY:      str({ default: 'minioadmin' }),
  S3_BUCKET:          str({ default: 'lixit-assets' }),

  KEYCLOAK_URL:       url({ default: 'http://keycloak:8080' }),
  KEYCLOAK_REALM:     str({ default: 'lixit' }),
  KEYCLOAK_CLIENT_ID: str({ default: 'grapesjs-editor' })
});

// ──────────────────────────────────────────────────────────────
// S3 + upload plumbing
// ──────────────────────────────────────────────────────────────
const s3Client = new S3Client({
  endpoint:   env.S3_ENDPOINT,
  region:     'us-east-1',
  credentials: {
    accessKeyId:     env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY
  },
  forcePathStyle: true
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx/.test(file.originalname.toLowerCase()) &&
               /jpeg|jpg|png|gif|webp|svg|pdf|msword|vnd.openxmlformats/.test(file.mimetype);
    cb(ok ? null : new Error('Only images and documents are allowed'), ok);
  }
});

// ──────────────────────────────────────────────────────────────
// Express app
// ──────────────────────────────────────────────────────────────
const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc:     ["'self'", 'data:', 'blob:', env.S3_ENDPOINT],
      connectSrc: ["'self'", env.S3_ENDPOINT]
    }
  }
}));

app.use(cors({
  origin: env.NODE_ENV === 'development' ? true : ['https://lixit.local'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health
app.get('/health', (_, res) =>
  res.json({ status: 'ok', service: 'grapesjs-server', timestamp: new Date().toISOString() })
);

// Very-light OIDC guard (dev env bypasses)
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (env.NODE_ENV === 'development') return next();
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Authentication required',
      keycloak_url: `${env.KEYCLOAK_URL}/realms/${env.KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${env.KEYCLOAK_CLIENT_ID}&response_type=code&redirect_uri=${req.protocol}://${req.get('host')}/editor`
    });
    return;
  }
  next();
};

// …(rest of original routes are unchanged)…

// 404 + error handlers
app.use((_, res) => res.status(404).json({ error: 'Not found' }));
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ──────────────────────────────────────────────────────────────
const server = app.listen(env.PORT, () => {
  console.log(`🎨 GrapesJS server running on port ${env.PORT}`);
  console.log(`📝 Editor available at http://localhost:${env.PORT}/editor`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => console.log('Process terminated'));
});

export default app;

