import { AppModule } from '../app.module';

// Mock NestFactory with inline definition
jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      listen: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

import { NestFactory } from '@nestjs/core';
import { bootstrap, isMainModule } from '../main';

describe('Main Bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap the application', async () => {
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('should return false when module is not main', () => {
    const mockModule = {} as typeof module;
    expect(isMainModule(mockModule)).toBe(false);
  });

  it('should return false when main module is undefined', () => {
    expect(isMainModule(undefined)).toBe(false);
  });
});
