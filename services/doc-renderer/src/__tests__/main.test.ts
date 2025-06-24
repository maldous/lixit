import { DocumentRendererService, documentRendererService } from '../main';

describe('DocumentRendererService', () => {
  let service: DocumentRendererService;

  beforeEach(() => {
    service = new DocumentRendererService();
  });

  test('should render PDF with data', async () => {
    const data = { test: 'data' };
    const result = await service.renderPDF(data);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toContain('test');
  });

  test('should render Excel with data', async () => {
    const data = { test: 'data' };
    const result = await service.renderExcel(data);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toContain('test');
  });

  test('should handle empty data for PDF', async () => {
    const data = {};
    const result = await service.renderPDF(data);
    expect(result).toBeInstanceOf(Buffer);
  });

  test('should handle empty data for Excel', async () => {
    const data = {};
    const result = await service.renderExcel(data);
    expect(result).toBeInstanceOf(Buffer);
  });
});

describe('documentRendererService singleton', () => {
  test('should be instance of DocumentRendererService', () => {
    expect(documentRendererService).toBeInstanceOf(DocumentRendererService);
  });

  test('should be the same instance when accessed multiple times', () => {
    const instance1 = documentRendererService;
    const instance2 = documentRendererService;
    expect(instance1).toBe(instance2);
  });
});
