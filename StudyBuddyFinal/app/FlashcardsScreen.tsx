import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Dialog, Portal } from 'react-native-paper';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export default function FlashcardsScreen() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState<{ [id: number]: boolean }>({});

  const openDialog = () => {
    setQuestion('');
    setAnswer('');
    setShowDialog(true);
  };
  const closeDialog = () => setShowDialog(false);

  const addFlashcard = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Error', 'Please enter both question and answer.');
      return;
    }
    setFlashcards((prev) => [
      { id: Date.now(), question, answer },
      ...prev,
    ]);
    closeDialog();
  };

  const toggleShowAnswer = (id: number) => {
    setShowAnswer((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteFlashcard = (id: number) => {
    setFlashcards((prev) => prev.filter((f) => f.id !== id));
  };

  const renderItem = ({ item }: { item: Flashcard }) => (
    <Card style={styles.card}>
      <Card.Title title={`Q: ${item.question}`} />
      <Card.Content>
        {showAnswer[item.id] ? <Text>A: {item.answer}</Text> : null}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => toggleShowAnswer(item.id)}>
          {showAnswer[item.id] ? 'Hide Answer' : 'Show Answer'}
        </Button>
        <Button onPress={() => deleteFlashcard(item.id)} color="red">Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineMedium">AI Flashcards</Text>
      <Button mode="contained" onPress={openDialog} style={styles.addButton}>
        Add Flashcard
      </Button>
      <FlatList
        data={flashcards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No flashcards yet. Add your first one!</Text>}
        contentContainerStyle={styles.listContent}
      />
      <Portal>
        <Dialog visible={showDialog} onDismiss={closeDialog}>
          <Dialog.Title>Add Flashcard</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Question"
              value={question}
              onChangeText={setQuestion}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Answer"
              value={answer}
              onChangeText={setAnswer}
              multiline
              numberOfLines={2}
              style={{ minHeight: 40 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={addFlashcard}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  addButton: {
    marginBottom: 12,
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
}); 