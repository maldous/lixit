import express from "express";
import helmet from "helmet";
import cors from "cors";

console.log("LIXI Transform Service");

export class LIXITransformService {
  async transform(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    // TODO: Implement actual LIXI transformation logic
    return data;
  }
}

export const lixiTransformService = new LIXITransformService();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? true : ["https://lixit.local"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "lixi-transform",
    timestamp: new Date().toISOString(),
  });
});

// Transform endpoint
app.post("/transform", async (req, res) => {
  try {
    const result = await lixiTransformService.transform(req.body);
    res.json(result);
  } catch (error) {
    console.error("Transform error:", error);
    res.status(500).json({ error: "Transformation failed" });
  }
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = process.env.PORT || 3000;

// Only start server if this file is run directly (not imported in tests)
if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`🔄 LIXI Transform Service running on port ${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("LIXI Transform Service terminated");
    });
  });
}

export default app;
