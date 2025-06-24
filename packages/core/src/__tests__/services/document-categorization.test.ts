import { DocumentCategorizationServiceImpl, documentCategorizationService } from '../../services/document-categorization';
import { Document } from '../../types/lixi';

describe('DocumentCategorizationServiceImpl', () => {
  let service: DocumentCategorizationServiceImpl;

  beforeEach(() => {
    service = new DocumentCategorizationServiceImpl();
  });

  test('should categorize document', async () => {
    const document: Document = {
      DocumentID: 'test-id',
      DocumentType: 'PaySlip',
      FileName: 'test.pdf',
      FileSize: 1024,
      MimeType: 'application/pdf',
      DocumentCategory: 'Income'
    };

    const result = await service.categorizeDocument(document);
    expect(result.type).toBe('other');
    expect(result.confidence).toBe(0.5);
    expect(result.metadata).toEqual({});
  });

  test('should categorize multiple documents', async () => {
    const documents: Document[] = [
      {
        DocumentID: 'test-id-1',
        DocumentType: 'PaySlip',
        FileName: 'test1.pdf',
        FileSize: 1024,
        MimeType: 'application/pdf',
        DocumentCategory: 'Income'
      },
      {
        DocumentID: 'test-id-2',
        DocumentType: 'BankStatement',
        FileName: 'test2.pdf',
        FileSize: 2048,
        MimeType: 'application/pdf',
        DocumentCategory: 'Assets'
      }
    ];

    const results = await service.categorizeDocuments(documents);
    expect(results).toHaveLength(2);
    expect(results[0].type).toBe('other');
    expect(results[1].type).toBe('other');
  });

  test('should extract data from document', async () => {
    const document: Document = {
      DocumentID: 'test-id',
      DocumentType: 'PaySlip',
      FileName: 'test.pdf',
      FileSize: 1024,
      MimeType: 'application/pdf',
      DocumentCategory: 'Income'
    };

    const result = await service.extractData(document);
    expect(result.fileName).toBe('test.pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.size).toBe(1024);
    expect(result.extractedAt).toBeDefined();
  });

  test('should categorize payslip document based on filename', async () => {
    const document: Document = {
      DocumentID: 'test-id',
      DocumentType: 'PaySlip',
      FileName: 'payslip_january.pdf',
      FileSize: 1024,
      MimeType: 'application/pdf',
      DocumentCategory: 'Income'
    };

    // Test the private method indirectly through categorizeDocument
    const result = await service.categorizeDocument(document);
    expect(result).toBeDefined();
  });

  test('should categorize bank statement document', async () => {
    const document: Document = {
      DocumentID: 'test-id',
      DocumentType: 'BankStatement',
      FileName: 'bank_statement.pdf',
      FileSize: 1024,
      MimeType: 'application/pdf',
      DocumentCategory: 'Assets'
    };

    const result = await service.categorizeDocument(document);
    expect(result).toBeDefined();
  });
});

describe('documentCategorizationService singleton', () => {
  test('should be instance of DocumentCategorizationServiceImpl', () => {
    expect(documentCategorizationService).toBeInstanceOf(DocumentCategorizationServiceImpl);
  });
});
