import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TODOProps {
  message?: string;
}

const TODO: React.FC<TODOProps> = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.text}>🚧 TODO: {message || 'This feature is not yet implemented.'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  text: {
    color: '#856404',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TODO; 