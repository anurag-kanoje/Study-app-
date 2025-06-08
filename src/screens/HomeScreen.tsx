import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../types/navigation';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.email?.split('@')[0]}!
        </Text>

        <View style={styles.grid}>
          <Card style={styles.card} onPress={() => navigation.navigate('StudyGroups')}>
            <Card.Content>
              <Text style={styles.cardTitle}>Study Groups</Text>
              <Text style={styles.cardDescription}>
                Join or create study groups to collaborate with others
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card} onPress={() => navigation.navigate('StudyMaterials', { groupId: '' })}>
            <Card.Content>
              <Text style={styles.cardTitle}>Study Materials</Text>
              <Text style={styles.cardDescription}>
                Access and share study materials with your groups
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card} onPress={() => navigation.navigate('VideoGenerator')}>
            <Card.Content>
              <Text style={styles.cardTitle}>AI Video Generator</Text>
              <Text style={styles.cardDescription}>
                Create educational videos using AI
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card} onPress={() => navigation.navigate('Profile')}>
            <Card.Content>
              <Text style={styles.cardTitle}>Profile</Text>
              <Text style={styles.cardDescription}>
                Manage your account and preferences
              </Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('StudyGroups')}
              style={styles.actionButton}
            >
              Create Study Group
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('VideoGenerator')}
              style={styles.actionButton}
            >
              Generate Video
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    margin: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 