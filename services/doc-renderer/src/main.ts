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
