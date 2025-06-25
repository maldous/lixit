import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { cleanEnv, port, str, url } from 'envalid';

// Validate environment variables at startup
const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  DATABASE_URL: url(),
  S3_ENDPOINT: url(),
  S3_ACCESS_KEY: str(),
  S3_SECRET_KEY: str(),
  S3_BUCKET: str(),
  KEYCLOAK_URL: url({ default: 'http://keycloak:8080' }),
  KEYCLOAK_REALM: str({ default: 'lixit' }),
  KEYCLOAK_CLIENT_ID: str({ default: 'grapesjs-editor' }),
});

// Configure S3 client for MinIO
const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: 'us-east-1', // MinIO doesn't care about region
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and common document types
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  },
});

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // GrapesJS needs eval
      imgSrc: ["'self'", "data:", "blob:", env.S3_ENDPOINT],
      connectSrc: ["'self'", env.S3_ENDPOINT],
    },
  },
}));

app.use(cors({
  origin: env.NODE_ENV === 'development' ? true : ['https://lixit.local'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'grapesjs-server', timestamp: new Date().toISOString() });
});

// Simple OIDC middleware for production
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (env.NODE_ENV === 'development') {
    next(); // Skip auth in development
    return;
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      error: 'Authentication required',
      keycloak_url: `${env.KEYCLOAK_URL}/realms/${env.KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${env.KEYCLOAK_CLIENT_ID}&response_type=code&redirect_uri=${req.protocol}://${req.get('host')}/editor`
    });
    return;
  }
  
  // TODO: Validate JWT token with Keycloak
  // For now, just check if token exists
  next();
};

// GrapesJS editor endpoint - protected in production
app.get('/editor', requireAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>LIXIT Template Editor</title>
      <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css">
      <style>
        body, html { margin: 0; height: 100%; }
        #gjs { height: 100vh; }
        .auth-info { position: fixed; top: 10px; right: 10px; background: #333; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; z-index: 1000; }
      </style>
    </head>
    <body>
      ${env.NODE_ENV === 'production' ? '<div class="auth-info">Authenticated</div>' : ''}
      <div id="gjs"></div>
      
      <script src="https://unpkg.com/grapesjs"></script>
      <script>
        const editor = grapesjs.init({
          container: '#gjs',
          height: '100vh',
          width: 'auto',
          storageManager: {
            type: 'remote',
            stepsBeforeSave: 1,
            urlStore: '/api/templates',
            urlLoad: '/api/templates',
            params: {},
            headers: {
              'Authorization': '${req.headers.authorization || ''}'
            },
          },
          assetManager: {
            upload: '/api/assets/upload',
            uploadName: 'files',
            multiUpload: true,
            headers: {
              'Authorization': '${req.headers.authorization || ''}'
            },
          },
          plugins: ['gjs-blocks-basic'],
          pluginsOpts: {
            'gjs-blocks-basic': {}
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Template management API - also protected
app.get('/api/templates/:id?', requireAuth, async (req, res) => {
  // TODO: Implement template loading from database
  res.json({ data: { html: '', css: '', components: [], styles: [] } });
});

app.post('/api/templates', requireAuth, async (req, res) => {
  // TODO: Implement template saving to database
  const { html, css, components, styles } = req.body;
  res.json({ success: true, id: Date.now().toString() });
});

// Asset upload API - uploads to MinIO, also protected
app.post('/api/assets/upload', requireAuth, upload.array('files'), async (req, res): Promise<void> => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
      const key = `grapesjs/${Date.now()}-${file.originalname}`;
      
      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);
      
      return {
        src: `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${key}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'file',
        name: file.originalname,
        size: file.size,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    res.json({ data: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const server = app.listen(env.PORT, () => {
  console.log(`🎨 GrapesJS server running on port ${env.PORT}`);
  console.log(`📝 Editor available at http://localhost:${env.PORT}/editor`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;