// Jest setup file for UI Kit tests
import '@testing-library/jest-dom';

// Import React for the mock components
import React from 'react';

// Mock React Native components for testing
jest.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
  TouchableOpacity: ({ children, onPress, disabled, ...props }: {
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => {
    const handleClick = () => {
      if (!disabled && onPress) {
        onPress();
      }
    };
    return React.createElement('button', { onClick: handleClick, disabled, ...props }, children);
  },
  Text: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => 
    React.createElement('span', props, children),
  View: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => 
    React.createElement('div', props, children),
  TextInput: ({ value, onChangeText, placeholder, secureTextEntry, ...props }: {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    [key: string]: unknown;
  }) => {
    const handleChange = (e: { target: { value: string } }) => {
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
