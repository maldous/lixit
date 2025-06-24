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

  test('should test require.main branch', () => {
    // Mock require.main to test the conditional execution
    const originalMain = require.main;
    require.main = module;
    
    // Import main.ts to trigger the conditional
    jest.isolateModules(() => {
      require('../main');
    });
    
    // Restore original
    require.main = originalMain;
    
    expect(mockCreate).toHaveBeenCalled();
  });
});
