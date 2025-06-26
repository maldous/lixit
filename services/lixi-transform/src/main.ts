import express from 'express';

console.log("LIXI Transform Service");

export class LIXITransformService {
  async transform(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return data;
  }
}

export const lixiTransformService = new LIXITransformService();

// Add HTTP server
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'lixi-transform' });
});

app.post('/transform', async (req, res) => {
  const result = await lixiTransformService.transform(req.body);
  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LIXI Transform Service running on port ${port}`);
});
