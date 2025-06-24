import { LIXIPackage, LIXIApplication, Submission } from '../types/lixi';

export abstract class BaseLIXITransformer {
  abstract lenderCode: string;
  
  /**
   * Transform internal data to LIXI format
   */
  abstract transformToLIXI(internalData: any): LIXIPackage;
  
  /**
   * Transform LIXI data to lender-specific format
   */
  abstract transformFromLIXI(lixiData: LIXIPackage): any;
  
  /**
   * Validate lender-specific requirements
   */
  abstract validateLenderRequirements(lixiData: LIXIPackage): boolean;
  
  /**
   * Generate unique submission ID
   */
  protected generateSubmissionId(): string {
    return `${this.lenderCode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Create submission package
   */
  createSubmission(lixiData: LIXIPackage, type: 'Prospect' | 'Application'): Submission {
    const baseSubmission = {
      package: lixiData,
      lenderCode: this.lenderCode,
    };
    
    if (type === 'Prospect') {
      return {
        type: 'Prospect',
        ...baseSubmission,
      };
    } else {
      return {
        type: 'Application',
        ...baseSubmission,
        documents: lixiData.Application[0]?.Documents || [],
      };
    }
  }
}

/**
 * Generic LIXI transformer for standard implementations
 */
export class GenericLIXITransformer extends BaseLIXITransformer {
  constructor(public lenderCode: string) {
    super();
  }
  
  transformToLIXI(internalData: any): LIXIPackage {
    // Default implementation - can be overridden
    return {
      Application: [internalData],
      SchemaVersion: '2.6.86',
      UniqueID: this.generateSubmissionId(),
    };
  }
  
  transformFromLIXI(lixiData: LIXIPackage): any {
    // Default implementation - return as-is
    return lixiData;
  }
  
  validateLenderRequirements(lixiData: LIXIPackage): boolean {
    // Basic validation - can be overridden
    return lixiData.Application.length > 0;
  }
}

/**
 * Transformer registry for managing multiple lenders
 */
export class TransformerRegistry {
  private transformers = new Map<string, BaseLIXITransformer>();
  
  register(lenderCode: string, transformer: BaseLIXITransformer): void {
    this.transformers.set(lenderCode, transformer);
  }
  
  get(lenderCode: string): BaseLIXITransformer | undefined {
    return this.transformers.get(lenderCode);
  }
  
  getAll(): Map<string, BaseLIXITransformer> {
    return new Map(this.transformers);
  }
  
  createSubmission(lenderCode: string, internalData: any, type: 'Prospect' | 'Application'): Submission | null {
    const transformer = this.get(lenderCode);
    if (!transformer) {
      return null;
    }
    
    const lixiData = transformer.transformToLIXI(internalData);
    return transformer.createSubmission(lixiData, type);
  }
}

// Export singleton instance
export const transformerRegistry = new TransformerRegistry();
