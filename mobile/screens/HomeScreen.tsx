import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const features = [
  {
    title: 'Study Groups',
    icon: 'people',
    description: 'Join or create study groups to learn together',
    route: 'Study Groups'
  },
  {
    title: 'Smart Notes',
    icon: 'book',
    description: 'AI-powered note-taking and organization',
    route: 'Notes'
  },
  {
    title: 'AI Chatbot',
    icon: 'chatbubbles',
    description: 'Get instant help with your studies',
    route: 'Chatbot'
  },
  {
    title: 'Exam Prep',
    icon: 'school',
    description: 'Prepare for exams with AI assistance',
    route: 'ExamPrep'
  }
];

export function HomeScreen({ navigation }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
          Welcome to Study Buddy
        </Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              style={{
                width: '47%',
                marginBottom: 16
              }}
              onPress={() => navigation.navigate(feature.route)}
            >
              <Card.Content>
                <Ionicons
                  name={feature.icon}
                  size={32}
                  color={theme.colors.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text variant="titleMedium">{feature.title}</Text>
                <Text variant="bodySmall" style={{ marginTop: 4, color: theme.colors.secondary }}>
                  {feature.description}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text variant="titleLarge">Today's Progress</Text>
            <View style={{ marginTop: 16 }}>
              <Text variant="bodyMedium">Study Time: 2h 30m</Text>
              <Text variant="bodyMedium">Notes Created: 3</Text>
              <Text variant="bodyMedium">Questions Answered: 15</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Progress')}>View Details</Button>
          </Card.Actions>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text variant="titleLarge">Upcoming Sessions</Text>
            <View style={{ marginTop: 16 }}>
              <Text variant="bodyMedium">Physics Study Group - 2:00 PM</Text>
              <Text variant="bodyMedium">Math Tutoring - 4:30 PM</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Calendar')}>View Schedule</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
} 