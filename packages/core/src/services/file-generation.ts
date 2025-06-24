import { LIXIPackage, GeneratedFile, FileGenerationRequest } from '../types/lixi';

export interface FileGenerationService {
  generateJSON(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile>;
  generateExcel(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile>;
  generatePDF(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile>;
  generateAll(request: FileGenerationRequest): Promise<GeneratedFile[]>;
}

export abstract class BaseFileGenerator {
  protected abstract fileType: 'JSON' | 'Excel' | 'PDF';
  protected abstract mimeType: string;
  protected abstract fileExtension: string;

  abstract generate(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile>;

  protected createFileMetadata(
    submissionId: string,
    fileName: string,
    filePath: string,
    fileSize: number
  ): GeneratedFile {
    return {
      id: `${submissionId}-${this.fileType.toLowerCase()}-${Date.now()}`,
      type: this.fileType,
      fileName,
      filePath,
      fileSize,
      mimeType: this.mimeType,
      createdAt: new Date().toISOString(),
      submissionId,
    };
  }

  protected generateFileName(submissionId: string, lenderCode?: string): string {
    const prefix = lenderCode ? `${lenderCode}-` : '';
    const timestamp = new Date().toISOString().split('T')[0];
    return `${prefix}${submissionId}-${timestamp}.${this.fileExtension}`;
  }
}

export class JSONGenerator extends BaseFileGenerator {
  protected fileType = 'JSON' as const;
  protected mimeType = 'application/json';
  protected fileExtension = 'json';

  async generate(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile> {
    const fileName = this.generateFileName(submissionId);
    const jsonContent = JSON.stringify(lixiData, null, 2);
    const fileSize = Buffer.byteLength(jsonContent, 'utf8');
    const filePath = `/generated/${submissionId}/${fileName}`;

    // In a real implementation, you would save the file to storage
    // For now, we'll just return the metadata
    return this.createFileMetadata(submissionId, fileName, filePath, fileSize);
  }
}

export class ExcelGenerator extends BaseFileGenerator {
  protected fileType = 'Excel' as const;
  protected mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  protected fileExtension = 'xlsx';

  async generate(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile> {
    const fileName = this.generateFileName(submissionId);
    const filePath = `/generated/${submissionId}/${fileName}`;

    // In a real implementation, you would use ExcelJS to create the spreadsheet
    // This would include multiple sheets for different data sections
    const estimatedSize = 50000; // Placeholder size

    return this.createFileMetadata(submissionId, fileName, filePath, estimatedSize);
  }
}

export class PDFGenerator extends BaseFileGenerator {
  protected fileType = 'PDF' as const;
  protected mimeType = 'application/pdf';
  protected fileExtension = 'pdf';

  async generate(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile> {
    const fileName = this.generateFileName(submissionId);
    const filePath = `/generated/${submissionId}/${fileName}`;

    // In a real implementation, you would use Puppeteer or PDF-Lib
    // to generate a formatted PDF report
    const estimatedSize = 100000; // Placeholder size

    return this.createFileMetadata(submissionId, fileName, filePath, estimatedSize);
  }
}

export class FileGenerationServiceImpl implements FileGenerationService {
  private jsonGenerator = new JSONGenerator();
  private excelGenerator = new ExcelGenerator();
  private pdfGenerator = new PDFGenerator();

  async generateJSON(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile> {
    return this.jsonGenerator.generate(lixiData, submissionId);
  }

  async generateExcel(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile> {
    return this.excelGenerator.generate(lixiData, submissionId);
  }

  async generatePDF(lixiData: LIXIPackage, submissionId: string): Promise<GeneratedFile> {
    return this.pdfGenerator.generate(lixiData, submissionId);
  }

  async generateAll(request: FileGenerationRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const format of request.formats) {
      switch (format) {
        case 'JSON':
          files.push(await this.generateJSON(request.lixiData, request.submissionId));
          break;
        case 'Excel':
          files.push(await this.generateExcel(request.lixiData, request.submissionId));
          break;
        case 'PDF':
          files.push(await this.generatePDF(request.lixiData, request.submissionId));
          break;
      }
    }

    return files;
  }
}

export const fileGenerationService = new FileGenerationServiceImpl();
