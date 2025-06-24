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
import { bootstrap } from '../main';

describe('Main Bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap the application', async () => {
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });
});
