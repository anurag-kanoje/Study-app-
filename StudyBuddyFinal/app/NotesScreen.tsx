import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, TextInput, Button, Card, IconButton, Dialog, Portal } from 'react-native-paper';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDialog = (note?: Note) => {
    if (note) {
      setEditNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditNote(null);
      setTitle('');
      setContent('');
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditNote(null);
    setTitle('');
    setContent('');
  };

  const saveNote = () => {
    if (editNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editNote.id ? { ...n, title, content } : n
        )
      );
    } else {
      setNotes((prev) => [
        {
          id: Date.now(),
          title: title || 'Untitled Note',
          content,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }
    closeDialog();
  };

  const deleteNote = (id: number) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setNotes((prev) => prev.filter((n) => n.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Note }) => (
    <Card style={styles.card}>
      <Card.Title title={item.title} subtitle={item.createdAt.toLocaleDateString()} />
      <Card.Content>
        <Text>{item.content}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => openDialog(item)}>Edit</Button>
        <Button onPress={() => deleteNote(item.id)} color="red">Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineMedium">Notes</Text>
      <TextInput
        placeholder="Search notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />
      <Button mode="contained" onPress={() => openDialog()} style={styles.addButton}>
        New Note
      </Button>
      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes found.</Text>}
        contentContainerStyle={styles.listContent}
      />
      <Portal>
        <Dialog visible={showDialog} onDismiss={closeDialog}>
          <Dialog.Title>{editNote ? 'Edit Note' : 'New Note'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Content"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              style={{ minHeight: 80 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={saveNote}>{editNote ? 'Save' : 'Add'}</Button>
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
  search: {
    marginBottom: 8,
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