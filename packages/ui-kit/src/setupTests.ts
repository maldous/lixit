// Jest setup file for UI Kit tests
import '@testing-library/jest-dom';

// Mock React Native components for testing
jest.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
  TouchableOpacity: ({ children, onPress, disabled, ...props }: any) => {
    const handleClick = () => {
      if (!disabled && onPress) {
        onPress();
      }
    };
    return React.createElement('button', { onClick: handleClick, disabled, ...props }, children);
  },
  Text: ({ children, ...props }: any) => React.createElement('span', props, children),
  View: ({ children, ...props }: any) => React.createElement('div', props, children),
  TextInput: ({ value, onChangeText, placeholder, secureTextEntry, ...props }: any) => {
    const handleChange = (e: any) => {
      if (onChangeText) {
        onChangeText(e.target.value);
      }
    };
    return React.createElement('input', {
      value,
      onChange: handleChange,
      placeholder,
      type: secureTextEntry ? 'password' : 'text',
      ...props
    });
  },
}));

// Import React for the mock components
const React = require('react');
