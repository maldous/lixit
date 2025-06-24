import { Document } from '../types/lixi';

export interface DocumentCategory {
  type: 'financial_statement' | 'bank_statement' | 'identity' | 'property' | 'other';
  confidence: number;
  metadata: Record<string, unknown>;
}

export interface DocumentCategorizationService {
  categorizeDocument(document: Document): Promise<DocumentCategory>;
  categorizeDocuments(documents: Document[]): Promise<DocumentCategory[]>;
  extractData(document: Document): Promise<Record<string, unknown>>;
}

export class DocumentCategorizationServiceImpl implements DocumentCategorizationService {
  private categoryRules: Map<string, { category: DocumentCategory['type']; confidence: number }> = new Map([
    // File name patterns
    ['payslip', { category: 'financial_statement', confidence: 0.9 }],
    ['pay_slip', { category: 'financial_statement', confidence: 0.9 }],
    ['salary', { category: 'financial_statement', confidence: 0.8 }],
    ['bank_statement', { category: 'bank_statement', confidence: 0.9 }],
    ['statement', { category: 'bank_statement', confidence: 0.7 }],
    ['tax_return', { category: 'financial_statement', confidence: 0.95 }],
    ['tax', { category: 'financial_statement', confidence: 0.6 }],
    ['financial_statement', { category: 'financial_statement', confidence: 0.9 }],
    ['balance_sheet', { category: 'financial_statement', confidence: 0.9 }],
    ['profit_loss', { category: 'financial_statement', confidence: 0.8 }],
    ['p&l', { category: 'financial_statement', confidence: 0.8 }],
    ['drivers_license', { category: 'identity', confidence: 0.95 }],
    ['license', { category: 'identity', confidence: 0.7 }],
    ['passport', { category: 'identity', confidence: 0.95 }],
    ['birth_certificate', { category: 'identity', confidence: 0.95 }],
    ['mortgage', { category: 'other', confidence: 0.8 }],
    ['loan', { category: 'other', confidence: 0.7 }],
    ['credit_card', { category: 'other', confidence: 0.8 }],
    ['property', { category: 'property', confidence: 0.8 }],
    ['valuation', { category: 'property', confidence: 0.9 }],
    ['contract_of_sale', { category: 'property', confidence: 0.95 }],
  ]);

  async categorizeDocument(document: Document): Promise<DocumentCategory> {
    const features = this.extractFeatures(document);
    const prediction = await this.classifyDocument(features);
    
    return {
      type: prediction.category,
      confidence: prediction.confidence,
      metadata: prediction.metadata || {}
    };
  }

  async categorizeDocuments(documents: Document[]): Promise<DocumentCategory[]> {
    return Promise.all(documents.map(doc => this.categorizeDocument(doc)));
  }

  async extractData(document: Document): Promise<Record<string, unknown>> {
    // In a real implementation, this would use OCR and NLP
    // to extract structured data from documents
    return {
      fileName: document.FileName,
      mimeType: document.MimeType,
      size: document.FileSize,
      extractedAt: new Date().toISOString(),
    };
  }

  private extractFeatures(_document: Document): Record<string, unknown> {
    // Implement feature extraction logic here
    return {};
  }

  private async classifyDocument(_features: Record<string, unknown>): Promise<{
    category: DocumentCategory['type'];
    confidence: number;
    metadata: Record<string, unknown>;
  }> {
    // Implement classification logic here
    return {
      category: 'other',
      confidence: 0.5,
      metadata: {}
    };
  }
}

export const documentCategorizationService = new DocumentCategorizationServiceImpl();
