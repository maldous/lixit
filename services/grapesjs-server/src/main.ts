/**
 * GrapesJS Micro-service
 * ───────────────────────────────────────────────────────────────
 * Serves the editor UI, persists templates in a DB (TODO) and
 * uploads assets to an S3-compatible store (eg. MinIO).
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { cleanEnv, port, str, url } from "envalid";

/* ────────────────────────────────────────────────────────── */
/*  Environment (sensible defaults for dev)                  */
/* ────────────────────────────────────────────────────────── */
const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),

  DATABASE_URL: url({ default: "postgres://user:pass@localhost:5432/lixit" }),
  S3_ENDPOINT: url({ default: "http://minio:9000" }),
  S3_ACCESS_KEY: str({ default: "minioadmin" }),
  S3_SECRET_KEY: str({ default: "minioadmin" }),
  S3_BUCKET: str({ default: "lixit-assets" }),

  KEYCLOAK_URL: url({ default: "http://keycloak:8080" }),
  KEYCLOAK_REALM: str({ default: "lixit" }),
  KEYCLOAK_CLIENT_ID: str({ default: "grapesjs-editor" }),
});

/* ────────────────────────────────────────────────────────── */
/*  S3 client & multer plumbing                              */
/* ────────────────────────────────────────────────────────── */
const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: "us-east-1", // MinIO ignores region
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const okExt = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx/.test(
      file.originalname.toLowerCase(),
    );
    const okMime =
      /jpeg|jpg|png|gif|webp|svg|pdf|msword|vnd\.openxmlformats/.test(
        file.mimetype,
      );

    /* Express-5 typings split FileFilterCallback into two signatures:
       → (error: Error)            // when rejecting
       → (error: null, accept: boolean) // when continuing
       Passing (Error \| null, boolean) is no longer valid.          */
    if (okExt && okMime) {
      cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed"));
    }
  },
});

/* ────────────────────────────────────────────────────────── */
/*  Express app                                              */
/* ────────────────────────────────────────────────────────── */
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // grapesjs needs eval in dev
        imgSrc: ["'self'", "data:", "blob:", env.S3_ENDPOINT],
        connectSrc: ["'self'", env.S3_ENDPOINT],
      },
    },
  }),
);

app.use(
  cors({
    origin: env.NODE_ENV === "development" ? true : ["https://lixit.local"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ────────────────────────────────────────────────────────── */
/*  Health                                                   */
/* ────────────────────────────────────────────────────────── */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "grapesjs-server",
    timestamp: new Date().toISOString(),
  });
});

/* ────────────────────────────────────────────────────────── */
/*  Very-light OIDC guard (prod only)                        */
/* ────────────────────────────────────────────────────────── */
const requireAuth: express.RequestHandler = (req, res, next) => {
  if (env.NODE_ENV === "development") return next();

  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required",
      keycloak_url:
        `${env.KEYCLOAK_URL}/realms/${env.KEYCLOAK_REALM}/protocol/openid-connect/auth` +
        `?client_id=${env.KEYCLOAK_CLIENT_ID}&response_type=code` +
        `&redirect_uri=${req.protocol}://${req.get("host")}/editor`,
    });
    return;
  }

  // TODO: validate JWT with Keycloak
  next();
};

/* ────────────────────────────────────────────────────────── */
/*  Editor UI (static HTML)                                  */
/* ────────────────────────────────────────────────────────── */
app.get("/editor", requireAuth, (req, res) => {
  res.send(/* html */ `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>LIXIT Template Editor</title>
        <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" />
        <style>
          html,body { margin:0; height:100% }
          #gjs      { height:100vh }
          .auth-info {
            position:fixed; top:10px; right:10px; background:#333;
            color:#fff; padding:5px 10px; border-radius:3px;
            font-size:12px; z-index:1000;
          }
        </style>
      </head>
      <body>
        ${env.NODE_ENV === "production" ? '<div class="auth-info">Authenticated</div>' : ""}
        <div id="gjs"></div>

        <script src="https://unpkg.com/grapesjs"></script>
        <script>
          const editor = grapesjs.init({
            container: '#gjs',
            height: '100vh',
            storageManager: {
              type: 'remote',
              stepsBeforeSave: 1,
              urlStore: '/api/templates',
              urlLoad:  '/api/templates',
              headers: { Authorization: '${req.headers.authorization || ""}' },
            },
            assetManager: {
              upload:      '/api/assets/upload',
              uploadName:  'files',
              multiUpload: true,
              headers:     { Authorization: '${req.headers.authorization || ""}' },
            },
            plugins:     ['gjs-blocks-basic'],
            pluginsOpts: { 'gjs-blocks-basic': {} },
          });
        </script>
      </body>
    </html>
  `);
});

/* ────────────────────────────────────────────────────────── */
/*  Template management API (DB integration TODO)            */
/* ────────────────────────────────────────────────────────── */
app.get("/api/templates", requireAuth, async (_req, res) => {
  // TODO: query list from DB
  res.json({ data: [] });
});

app.get("/api/templates/:id", requireAuth, async (req, res) => {
  // TODO: fetch single template
  const { id } = req.params;
  res.json({ data: { id, html: "", css: "", components: [], styles: [] } });
});

app.post("/api/templates", requireAuth, async (req, res) => {
  const { html, css, components, styles } = req.body as {
    html: string;
    css: string;
    components: unknown[];
    styles: unknown[];
  };
  void [html, css, components, styles]; // suppress unused warning
  // TODO: persist template
  res.json({ success: true, id: Date.now().toString() });
});

/* ────────────────────────────────────────────────────────── */
/*  Asset upload → S3/MinIO                                  */
/* ────────────────────────────────────────────────────────── */
app.post(
  "/api/assets/upload",
  requireAuth,
  upload.array("files"),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files?.length) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      const uploads = files.map(async (file) => {
        const key = `grapesjs/${Date.now()}-${file.originalname}`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        return {
          src: `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${key}`,
          type: file.mimetype.startsWith("image/") ? "image" : "file",
          name: file.originalname,
          size: file.size,
        };
      });

      const data = await Promise.all(uploads);
      res.json({ data });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  },
);

/* ────────────────────────────────────────────────────────── */
/*  404 & generic error handlers                             */
/* ────────────────────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

/* ────────────────────────────────────────────────────────── */
/*  Start server & graceful shutdown                         */
/* ────────────────────────────────────────────────────────── */

// Only start server if this file is run directly (not imported in tests)
if (require.main === module) {
  const server = app.listen(env.PORT, () => {
    console.log(`🎨  GrapesJS server running on port ${env.PORT}`);
    console.log(`📝  Editor available at http://localhost:${env.PORT}/editor`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => console.log("Process terminated"));
  });
}

export default app;
