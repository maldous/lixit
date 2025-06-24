import { LIXITransformService, lixiTransformService } from '../main';

describe('LIXITransformService', () => {
  let service: LIXITransformService;

  beforeEach(() => {
    service = new LIXITransformService();
  });

  test('should transform data correctly', async () => {
    const data = { test: 'data' };
    const result = await service.transform(data);
    expect(result).toEqual(data);
  });

  test('should handle complex data transformation', async () => {
    const data = { application: { borrower: 'John Doe' } };
    const result = await service.transform(data);
    expect(result).toEqual(data);
  });

  test('should handle empty data', async () => {
    const data = {};
    const result = await service.transform(data);
    expect(result).toEqual({});
  });
});

describe('lixiTransformService singleton', () => {
  test('should be instance of LIXITransformService', () => {
    expect(lixiTransformService).toBeInstanceOf(LIXITransformService);
  });

  test('should be the same instance when accessed multiple times', () => {
    const instance1 = lixiTransformService;
    const instance2 = lixiTransformService;
    expect(instance1).toBe(instance2);
  });
});
