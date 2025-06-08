import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation param list
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Chatbot: undefined;
  Notes: undefined;
  StudyGroups: undefined;
  Flashcards: undefined;
  ExamPrep: undefined;
  AINotes: undefined;
  Summarize: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to StudyBuddy
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">AI Chatbot</Text>
            <Text variant="bodyMedium">Ask study questions to the AI assistant</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Chatbot')}>Open Chatbot</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Study Sessions</Text>
            <Text variant="bodyMedium">Track your study time and progress</Text>
          </Card.Content>
          <Card.Actions>
            <Button>Start Session</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Notes</Text>
            <Text variant="bodyMedium">Access and manage your study notes</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Notes')}>View Notes</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Study Groups</Text>
            <Text variant="bodyMedium">Join or create study groups and chat with members</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('StudyGroups')}>Open Study Groups</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">AI Flashcards</Text>
            <Text variant="bodyMedium">Create and study with AI-powered flashcards</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Flashcards')}>Open Flashcards</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Exam Preparation</Text>
            <Text variant="bodyMedium">Generate and track your personalized study plans</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('ExamPrep')}>Open Exam Prep</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">AI Notes</Text>
            <Text variant="bodyMedium">Convert handwritten notes to digital, generate summaries, and more</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('AINotes')}>Open AI Notes</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Summarization</Text>
            <Text variant="bodyMedium">Summarize videos or text content with AI</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Summarize')}>Open Summarization</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Progress</Text>
            <Text variant="bodyMedium">View your study statistics</Text>
          </Card.Content>
          <Card.Actions>
            <Button>View Progress</Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  logoutButton: {
    margin: 20,
  },
}); 