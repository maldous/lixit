// Jest setup file for UI Kit tests
import 'jest-environment-jsdom';

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
    select: jest.fn((obj) => obj.web || obj.default),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
}));
