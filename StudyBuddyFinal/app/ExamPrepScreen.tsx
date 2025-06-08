import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, TextInput, Button, Card, ProgressBar, Chip } from 'react-native-paper';

interface StudyTopic {
  id: string;
  name: string;
  progress: number;
  estimatedHours: number;
  completedHours: number;
}

interface StudyPlan {
  id: string;
  examName: string;
  examDate: Date;
  topics: StudyTopic[];
  totalProgress: number;
}

export default function ExamPrepScreen() {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([
    {
      id: '1',
      examName: 'Mathematics Final',
      examDate: new Date('2024-05-15'),
      topics: [
        {
          id: '1',
          name: 'Calculus',
          progress: 60,
          estimatedHours: 20,
          completedHours: 12,
        },
        {
          id: '2',
          name: 'Linear Algebra',
          progress: 30,
          estimatedHours: 15,
          completedHours: 4.5,
        },
      ],
      totalProgress: 45,
    },
  ]);

  const handleCreatePlan = () => {
    if (!examName.trim() || !examDate.trim()) {
      Alert.alert('Error', 'Please enter exam name and date.');
      return;
    }
    setStudyPlans((prev) => [
      {
        id: Date.now().toString(),
        examName,
        examDate: new Date(examDate),
        topics: [],
        totalProgress: 0,
      },
      ...prev,
    ]);
    setExamName('');
    setExamDate('');
    Alert.alert('Study Plan Created', 'Your personalized study plan has been generated.');
  };

  const renderPlan = ({ item }: { item: StudyPlan }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.examName}
        subtitle={`Exam Date: ${item.examDate.toLocaleDateString()}`}
        right={() => <Chip>{`Progress: ${item.totalProgress}%`}</Chip>}
      />
      <Card.Content>
        <ProgressBar progress={item.totalProgress / 100} style={{ marginBottom: 8 }} />
        {item.topics.map((topic) => (
          <View key={topic.id} style={styles.topicRow}>
            <Text>{topic.name}</Text>
            <Text>{topic.completedHours}/{topic.estimatedHours} hrs</Text>
            <ProgressBar progress={topic.progress / 100} style={{ marginVertical: 4 }} />
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineMedium">Exam Preparation</Text>
      <Card style={styles.card}>
        <Card.Title title="Create Study Plan" />
        <Card.Content>
          <TextInput
            label="Exam Name"
            value={examName}
            onChangeText={setExamName}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Exam Date (YYYY-MM-DD)"
            value={examDate}
            onChangeText={setExamDate}
            style={{ marginBottom: 8 }}
            placeholder="2024-05-15"
          />
          <Button mode="contained" onPress={handleCreatePlan}>Generate Plan</Button>
        </Card.Content>
      </Card>
      <Text style={styles.subtitle} variant="titleMedium">Current Study Plans</Text>
      <FlatList
        data={studyPlans}
        renderItem={renderPlan}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No study plans yet.</Text>}
        contentContainerStyle={styles.listContent}
      />
      <Text style={styles.subtitle} variant="titleMedium">Study Recommendations</Text>
      <Card style={styles.card}>
        <Card.Title title="Focus Areas" />
        <Card.Content>
          <Text>• Complete Linear Algebra exercises (High Priority)</Text>
          <Text>• Review Calculus formulas (Medium Priority)</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Study Tips" />
        <Card.Content>
          <Text>• Take regular breaks every 45 minutes</Text>
          <Text>• Practice with mock tests</Text>
          <Text>• Review notes before bedtime</Text>
          <Text>• Join study groups for difficult topics</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
  },
  listContent: {
    paddingBottom: 32,
  },
  topicRow: {
    marginBottom: 8,
  },
}); 