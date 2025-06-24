import { GenericLIXITransformer, TransformerRegistry, transformerRegistry } from '../../transformers/base';
import { LIXIPackage } from '../../types/lixi';

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
});

describe('transformerRegistry singleton', () => {
  test('should be instance of TransformerRegistry', () => {
    expect(transformerRegistry).toBeInstanceOf(TransformerRegistry);
  });
});
