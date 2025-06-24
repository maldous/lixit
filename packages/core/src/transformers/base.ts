import { LIXIPackage } from "../types/lixi";

export interface Submission {
  id: string;
  status: string;
  data: Record<string, unknown>;
}

export abstract class BaseLIXITransformer {
  protected lenderCode: string;
  protected version: string;

  constructor(lenderCode: string, version: string = "2.6.86") {
    this.lenderCode = lenderCode;
    this.version = version;
  }

  abstract transform(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  protected validateInput(_data: Record<string, unknown>): boolean {
    // Basic validation - can be overridden
    return true;
  }

  protected mapBorrowerData(
    borrower: Record<string, unknown>,
  ): Record<string, unknown> {
    // Default implementation - can be overridden
    return borrower;
  }

  protected mapLoanData(
    loan: Record<string, unknown>,
  ): Record<string, unknown> {
    // Default implementation - can be overridden
    return loan;
  }

  protected generateLIXIStructure(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    // Default implementation - can be overridden
    return data;
  }

  /**
   * Transform internal data to LIXI format
   */
  abstract transformToLIXI(_internalData: Record<string, unknown>): LIXIPackage;

  /**
   * Transform LIXI data back to internal format
   */
  abstract transformFromLIXI(_lixiData: LIXIPackage): Record<string, unknown>;

  /**
   * Validate LIXI data against schema
   */
  abstract validateLIXI(_lixiData: LIXIPackage): boolean;

  /**
   * Submit to lender
   */
  abstract submitToLender(
    _lixiData: LIXIPackage,
    _submissionType: "prospect" | "application",
  ): Promise<Submission>;

  /**
   * Create submission package
   */
  createSubmission(
    lixiData: LIXIPackage,
    type: "Prospect" | "Application",
  ): Submission {
    return {
      id: `${this.lenderCode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "created",
      data: {
        package: lixiData,
        lenderCode: this.lenderCode,
        type,
      },
    };
  }
}

/**
 * Generic LIXI transformer for standard implementations
 */
export class GenericLIXITransformer extends BaseLIXITransformer {
  constructor(public lenderCode: string) {
    super(lenderCode);
  }

  transformToLIXI(_internalData: Record<string, unknown>): LIXIPackage {
    // Default implementation - can be overridden
    return {} as LIXIPackage;
  }

  transformFromLIXI(_lixiData: LIXIPackage): Record<string, unknown> {
    // Default implementation - can be overridden
    return {};
  }

  validateLIXI(_lixiData: LIXIPackage): boolean {
    // Default implementation - can be overridden
    return true;
  }

  async submitToLender(
    _lixiData: LIXIPackage,
    _submissionType: "prospect" | "application",
  ): Promise<Submission> {
    // Default implementation - can be overridden
    return {
      id: "default",
      status: "submitted",
      data: {},
    };
  }

  async transform(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return data;
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

  createSubmission(
    lenderCode: string,
    internalData: Record<string, unknown>,
    type: "Prospect" | "Application",
  ): Submission | null {
    const transformer = this.get(lenderCode);
    if (!transformer) {
      return null;
    }

    const lixiData = transformer.transformToLIXI(internalData);
    return transformer.createSubmission(lixiData, type);
  }

  getTransformer(lenderCode: string): BaseLIXITransformer | undefined {
    return this.transformers.get(lenderCode);
  }
}

// Export singleton instance
export const transformerRegistry = new TransformerRegistry();
