// Jest setup file for UI Kit tests
import '@testing-library/jest-dom';

// Mock React Native StyleSheet
jest.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
  TouchableOpacity: 'TouchableOpacity',
  Text: 'Text',
  View: 'View',
  TextInput: 'TextInput',
}));
