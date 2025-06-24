import { FileGenerationServiceImpl, fileGenerationService } from '../../services/file-generation';
import { LIXIPackage, FileGenerationRequest } from '../../types/lixi';

describe('FileGenerationServiceImpl', () => {
  let service: FileGenerationServiceImpl;

  beforeEach(() => {
    service = new FileGenerationServiceImpl();
  });

  test('should generate JSON file', async () => {
    const lixiData = {} as LIXIPackage;
    const result = await service.generateJSON(lixiData, 'test-submission');
    expect(result.type).toBe('JSON');
    expect(result.fileName).toContain('.json');
  });

  test('should generate Excel file', async () => {
    const lixiData = {} as LIXIPackage;
    const result = await service.generateExcel(lixiData, 'test-submission');
    expect(result.type).toBe('Excel');
    expect(result.fileName).toContain('.xlsx');
  });

  test('should generate PDF file', async () => {
    const lixiData = {} as LIXIPackage;
    const result = await service.generatePDF(lixiData, 'test-submission');
    expect(result.type).toBe('PDF');
    expect(result.fileName).toContain('.pdf');
  });

  test('should generate all files', async () => {
    const lixiData = {} as LIXIPackage;
    const request: FileGenerationRequest = {
      lixiData,
      submissionId: 'test-submission',
      formats: ['JSON', 'Excel', 'PDF'],
      lenderCode: 'TEST_LENDER'
    };
    const results = await service.generateAll(request);
    expect(results).toHaveLength(3);
    expect(results.map(r => r.type)).toEqual(['JSON', 'Excel', 'PDF']);
  });
});

describe('fileGenerationService singleton', () => {
  test('should be instance of FileGenerationServiceImpl', () => {
    expect(fileGenerationService).toBeInstanceOf(FileGenerationServiceImpl);
  });
});
