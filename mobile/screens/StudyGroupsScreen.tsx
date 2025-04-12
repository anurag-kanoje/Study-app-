import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export function StudyGroupsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Study Groups</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
}); 