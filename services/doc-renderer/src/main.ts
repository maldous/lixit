import express from "express";
import helmet from "helmet";
import cors from "cors";

console.log("Document Renderer Service");

export class DocumentRendererService {
  async renderPDF(data: Record<string, unknown>): Promise<Buffer> {
    // TODO: Implement actual PDF generation with Puppeteer
    return Buffer.from(JSON.stringify(data));
  }

  async renderExcel(data: Record<string, unknown>): Promise<Buffer> {
    // TODO: Implement actual Excel generation with ExcelJS
    return Buffer.from(JSON.stringify(data));
  }
}

export const documentRendererService = new DocumentRendererService();

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
    service: "doc-renderer",
    timestamp: new Date().toISOString(),
  });
});

// PDF rendering endpoint
app.post("/render/pdf", async (req, res) => {
  try {
    const result = await documentRendererService.renderPDF(req.body);
    res.setHeader("Content-Type", "application/pdf");
    res.send(result);
  } catch (error) {
    console.error("PDF render error:", error);
    res.status(500).json({ error: "PDF rendering failed" });
  }
});

// Excel rendering endpoint
app.post("/render/excel", async (req, res) => {
  try {
    const result = await documentRendererService.renderExcel(req.body);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.send(result);
  } catch (error) {
    console.error("Excel render error:", error);
    res.status(500).json({ error: "Excel rendering failed" });
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
    console.log(`📄 Document Renderer Service running on port ${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Document Renderer Service terminated");
    });
  });
}

export default app;
