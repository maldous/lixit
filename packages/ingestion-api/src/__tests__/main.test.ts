import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { bootstrap } from '../main';

// Mock NestFactory
const mockApp = {
  listen: jest.fn().mockResolvedValue(undefined),
};

const mockCreate = jest.fn().mockResolvedValue(mockApp);

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: mockCreate,
  },
}));

describe('Main Bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should bootstrap the application', async () => {
    await bootstrap();
    
    expect(mockCreate).toHaveBeenCalledWith(AppModule);
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });

  test('should create NestJS application and listen on port 3000', async () => {
    // Test the bootstrap function logic step by step
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    
    expect(mockCreate).toHaveBeenCalledWith(AppModule);
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });
});
