import { LIXIPackageSchema, LIXIApplicationSchema } from '../../schemas/validation';

describe('Validation Schemas', () => {
  test('should export LIXIPackageSchema', () => {
    expect(LIXIPackageSchema).toBeDefined();
  });

  test('should export LIXIApplicationSchema', () => {
    expect(LIXIApplicationSchema).toBeDefined();
  });

  test('should validate valid LIXI package', () => {
    const validPackage = {
      Application: [],
      SchemaVersion: '2.6.86',
      UniqueID: 'test-id'
    };
    
    const result = LIXIPackageSchema.safeParse(validPackage);
    expect(result.success).toBe(true);
  });
});
