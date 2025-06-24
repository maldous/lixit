import { GenericLIXITransformer, TransformerRegistry, transformerRegistry, BaseLIXITransformer } from '../../transformers/base';
import { LIXIPackage } from '../../types/lixi';

// Create a test transformer to test protected methods
class TestTransformer extends BaseLIXITransformer {
  constructor() {
    super('TEST_LENDER', '2.6.86');
  }

  async transform(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    if (!this.validateInput(data)) {
      throw new Error('Invalid input');
    }
    return data;
  }

  transformToLIXI(internalData: Record<string, unknown>): LIXIPackage {
    const borrower = this.mapBorrowerData({ name: 'John Doe' });
    const loan = this.mapLoanData({ amount: 500000 });
    const structure = this.generateLIXIStructure({ borrower, loan, ...internalData });
    return structure as unknown as LIXIPackage;
  }

  transformFromLIXI(lixiData: LIXIPackage): Record<string, unknown> {
    return { lixiData };
  }

  validateLIXI(lixiData: LIXIPackage): boolean {
    return !!lixiData;
  }

  async submitToLender(lixiData: LIXIPackage, submissionType: 'prospect' | 'application') {
    return {
      id: `${this.lenderCode}-${submissionType}`,
      status: 'submitted',
      data: { lixiData }
    };
  }

  // Expose protected methods for testing
  public testValidateInput(data: Record<string, unknown>): boolean {
    return this.validateInput(data);
  }

  public testMapBorrowerData(borrower: Record<string, unknown>): Record<string, unknown> {
    return this.mapBorrowerData(borrower);
  }

  public testMapLoanData(loan: Record<string, unknown>): Record<string, unknown> {
    return this.mapLoanData(loan);
  }

  public testGenerateLIXIStructure(data: Record<string, unknown>): Record<string, unknown> {
    return this.generateLIXIStructure(data);
  }
}

describe('GenericLIXITransformer', () => {
  let transformer: GenericLIXITransformer;

  beforeEach(() => {
    transformer = new GenericLIXITransformer('TEST_LENDER');
  });

  test('should initialize with lender code', () => {
    expect(transformer.lenderCode).toBe('TEST_LENDER');
  });

  test('should transform data', async () => {
    const data = { test: 'data' };
    const result = await transformer.transform(data);
    expect(result).toEqual(data);
  });

  test('should transform to LIXI format', () => {
    const data = { test: 'data' };
    const result = transformer.transformToLIXI(data);
    expect(result).toEqual({});
  });

  test('should transform from LIXI format', () => {
    const lixiData = {} as LIXIPackage;
    const result = transformer.transformFromLIXI(lixiData);
    expect(result).toEqual({});
  });

  test('should validate LIXI data', () => {
    const lixiData = {} as LIXIPackage;
    const result = transformer.validateLIXI(lixiData);
    expect(result).toBe(true);
  });

  test('should submit to lender', async () => {
    const lixiData = {} as LIXIPackage;
    const result = await transformer.submitToLender(lixiData, 'prospect');
    expect(result).toEqual({
      id: 'default',
      status: 'submitted',
      data: {}
    });
  });

  test('should create submission', () => {
    const lixiData = {} as LIXIPackage;
    const result = transformer.createSubmission(lixiData, 'Prospect');
    expect(result.status).toBe('created');
    expect(result.data.lenderCode).toBe('TEST_LENDER');
    expect(result.data.type).toBe('Prospect');
  });
});

describe('TestTransformer (BaseLIXITransformer)', () => {
  let transformer: TestTransformer;

  beforeEach(() => {
    transformer = new TestTransformer();
  });

  test('should validate input', () => {
    const result = transformer.testValidateInput({ test: 'data' });
    expect(result).toBe(true);
  });

  test('should map borrower data', () => {
    const borrower = { name: 'John Doe' };
    const result = transformer.testMapBorrowerData(borrower);
    expect(result).toEqual(borrower);
  });

  test('should map loan data', () => {
    const loan = { amount: 500000 };
    const result = transformer.testMapLoanData(loan);
    expect(result).toEqual(loan);
  });

  test('should generate LIXI structure', () => {
    const data = { test: 'data' };
    const result = transformer.testGenerateLIXIStructure(data);
    expect(result).toEqual(data);
  });

  test('should transform to LIXI', () => {
    const data = { test: 'data' };
    const result = transformer.transformToLIXI(data);
    expect(result).toBeDefined();
  });

  test('should submit to lender with application type', async () => {
    const lixiData = {} as LIXIPackage;
    const result = await transformer.submitToLender(lixiData, 'application');
    expect(result.id).toBe('TEST_LENDER-application');
  });
});

describe('TransformerRegistry', () => {
  let registry: TransformerRegistry;
  let transformer: GenericLIXITransformer;

  beforeEach(() => {
    registry = new TransformerRegistry();
    transformer = new GenericLIXITransformer('TEST_LENDER');
  });

  test('should register transformer', () => {
    registry.register('TEST_LENDER', transformer);
    expect(registry.get('TEST_LENDER')).toBe(transformer);
  });

  test('should return undefined for unknown lender', () => {
    expect(registry.get('UNKNOWN')).toBeUndefined();
  });

  test('should return all transformers', () => {
    registry.register('TEST_LENDER', transformer);
    const all = registry.getAll();
    expect(all.get('TEST_LENDER')).toBe(transformer);
  });

  test('should create submission', () => {
    registry.register('TEST_LENDER', transformer);
    const result = registry.createSubmission('TEST_LENDER', {}, 'Prospect');
    expect(result).not.toBeNull();
    expect(result?.status).toBe('created');
  });

  test('should return null for unknown lender in createSubmission', () => {
    const result = registry.createSubmission('UNKNOWN', {}, 'Prospect');
    expect(result).toBeNull();
  });

  test('should get transformer', () => {
    registry.register('TEST_LENDER', transformer);
    expect(registry.getTransformer('TEST_LENDER')).toBe(transformer);
  });

  test('should create submission with Application type', () => {
    registry.register('TEST_LENDER', transformer);
    const result = registry.createSubmission('TEST_LENDER', {}, 'Application');
    expect(result?.data.type).toBe('Application');
  });
});

describe('transformerRegistry singleton', () => {
  test('should be instance of TransformerRegistry', () => {
    expect(transformerRegistry).toBeInstanceOf(TransformerRegistry);
  });
});
