import React from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  error?: string;
}

export function Input({ error, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});
