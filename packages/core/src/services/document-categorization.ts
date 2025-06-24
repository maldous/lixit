import { Document, DocumentCategory, CategorizedDocument, DocumentCategorizationResult } from '../types/lixi';

export interface DocumentCategorizationService {
  categorizeDocument(document: Document): Promise<DocumentCategorizationResult>;
  categorizeDocuments(documents: Document[]): Promise<DocumentCategorizationResult[]>;
  extractData(document: Document): Promise<Record<string, any>>;
}

export class DocumentCategorizationServiceImpl implements DocumentCategorizationService {
  private categoryRules: Map<string, { category: DocumentCategory; confidence: number }> = new Map([
    // File name patterns
    ['payslip', { category: 'Income', confidence: 0.9 }],
    ['pay_slip', { category: 'Income', confidence: 0.9 }],
    ['salary', { category: 'Income', confidence: 0.8 }],
    ['bank_statement', { category: 'Assets', confidence: 0.9 }],
    ['statement', { category: 'Assets', confidence: 0.7 }],
    ['tax_return', { category: 'Income', confidence: 0.95 }],
    ['tax', { category: 'Income', confidence: 0.6 }],
    ['financial_statement', { category: 'Assets', confidence: 0.9 }],
    ['balance_sheet', { category: 'Assets', confidence: 0.9 }],
    ['profit_loss', { category: 'Income', confidence: 0.8 }],
    ['p&l', { category: 'Income', confidence: 0.8 }],
    ['drivers_license', { category: 'Identity', confidence: 0.95 }],
    ['license', { category: 'Identity', confidence: 0.7 }],
    ['passport', { category: 'Identity', confidence: 0.95 }],
    ['birth_certificate', { category: 'Identity', confidence: 0.95 }],
    ['mortgage', { category: 'Liabilities', confidence: 0.8 }],
    ['loan', { category: 'Liabilities', confidence: 0.7 }],
    ['credit_card', { category: 'Liabilities', confidence: 0.8 }],
    ['property', { category: 'Property', confidence: 0.8 }],
    ['valuation', { category: 'Property', confidence: 0.9 }],
    ['contract_of_sale', { category: 'Property', confidence: 0.95 }],
  ]);

  async categorizeDocument(document: Document): Promise<DocumentCategorizationResult> {
    const startTime = Date.now();
    
    // Start with existing category if provided
    let bestCategory = document.DocumentCategory || 'Other';
    let bestConfidence = 0.5;
    let subcategory: string | undefined;

    // Analyze file name
    const fileName = document.FileName.toLowerCase();
    for (const [pattern, rule] of this.categoryRules) {
      if (fileName.includes(pattern)) {
        if (rule.confidence > bestConfidence) {
          bestCategory = rule.category;
          bestConfidence = rule.confidence;
          subcategory = pattern;
        }
      }
    }

    // Analyze MIME type for additional context
    if (document.MimeType.includes('image') && bestCategory === 'Other') {
      bestCategory = 'Identity';
      bestConfidence = 0.6;
    }

    // Extract data based on category
    const extractedData = await this.extractDataByCategory(document, bestCategory);

    const processingTime = Date.now() - startTime;

    return {
      documentId: document.DocumentID,
      category: bestCategory,
      subcategory,
      confidence: bestConfidence,
      extractedData,
      processingTime,
    };
  }

  async categorizeDocuments(documents: Document[]): Promise<DocumentCategorizationResult[]> {
    return Promise.all(documents.map(doc => this.categorizeDocument(doc)));
  }

  async extractData(document: Document): Promise<Record<string, any>> {
    // In a real implementation, this would use OCR and NLP
    // to extract structured data from documents
    return {
      fileName: document.FileName,
      fileSize: document.FileSize,
      mimeType: document.MimeType,
      extractedAt: new Date().toISOString(),
    };
  }

  private async extractDataByCategory(
    document: Document, 
    category: DocumentCategory
  ): Promise<Record<string, any>> {
    const baseData = await this.extractData(document);

    switch (category) {
      case 'Income':
        return {
          ...baseData,
          expectedFields: ['grossIncome', 'netIncome', 'payPeriod', 'employer'],
        };
      case 'Assets':
        return {
          ...baseData,
          expectedFields: ['accountBalance', 'accountNumber', 'institution'],
        };
      case 'Liabilities':
        return {
          ...baseData,
          expectedFields: ['outstandingBalance', 'monthlyPayment', 'lender'],
        };
      case 'Identity':
        return {
          ...baseData,
          expectedFields: ['fullName', 'dateOfBirth', 'address', 'documentNumber'],
        };
      case 'Property':
        return {
          ...baseData,
          expectedFields: ['propertyAddress', 'propertyValue', 'propertyType'],
        };
      default:
        return baseData;
    }
  }
}

export const documentCategorizationService = new DocumentCategorizationServiceImpl();
