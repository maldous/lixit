import express from 'express';

console.log("Document Renderer Service");

export class DocumentRendererService {
  async renderPDF(data: Record<string, unknown>): Promise<Buffer> {
    return Buffer.from(JSON.stringify(data));
  }

  async renderExcel(data: Record<string, unknown>): Promise<Buffer> {
    return Buffer.from(JSON.stringify(data));
  }
}

export const documentRendererService = new DocumentRendererService();

// Add HTTP server
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'doc-renderer' });
});

app.post('/render/pdf', async (req, res) => {
  const result = await documentRendererService.renderPDF(req.body);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(result);
});

app.post('/render/excel', async (req, res) => {
  const result = await documentRendererService.renderExcel(req.body);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Document Renderer Service running on port ${port}`);
});
