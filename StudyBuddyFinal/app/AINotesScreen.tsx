import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, Chip, SegmentedButtons, Dialog, Portal } from 'react-native-paper';

const sampleNotes = [
  {
    id: '1',
    title: 'Quantum Physics Lecture',
    preview: "Notes on quantum entanglement and wave-particle duality from today's lecture...",
    date: 'Today, 2:30 PM',
    tags: ['Physics', 'Quantum', 'Lecture'],
    content:
      '# Quantum Physics Lecture Notes\n\n## Wave-Particle Duality\n- Light exhibits properties of both waves and particles\n- De Broglie wavelength: λ = h/p\n- Demonstrated by double-slit experiment\n\n## Quantum Entanglement\n- Particles become correlated, sharing quantum states\n- Einstein called it "spooky action at a distance"\n- Violates local realism\n\n## Heisenberg Uncertainty Principle\n- Cannot simultaneously know position and momentum precisely\n- ΔxΔp ≥ ħ/2\n- Fundamental limit, not measurement problem',
  },
  {
    id: '2',
    title: 'Organic Chemistry Mechanisms',
    preview: 'Summary of nucleophilic substitution and elimination reactions with examples...',
    date: 'Yesterday, 10:15 AM',
    tags: ['Chemistry', 'Organic', 'Mechanisms'],
    content:
      '# Organic Chemistry Mechanisms\n\n## Nucleophilic Substitution\n... (truncated for brevity)',
  },
  {
    id: '3',
    title: 'Data Structures: Trees & Graphs',
    preview: 'Implementation details and complexity analysis of various tree and graph algorithms...',
    date: 'Mar 22, 2023',
    tags: ['CS', 'Algorithms', 'Data Structures'],
    content:
      '# Trees & Graphs\n\n## Binary Trees\n... (truncated for brevity)',
  },
];

const outputFormats = [
  { key: 'notes', value: 'Structured Notes' },
  { key: 'summary', value: 'Summary' },
  { key: 'flashcards', value: 'Flashcards' },
  { key: 'mindmap', value: 'Mind Map' },
];

export default function AINotesScreen() {
  const [tab, setTab] = useState<'upload' | 'preview' | 'library'>('upload');
  const [selectedFormat, setSelectedFormat] = useState('notes');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setTab('preview');
    }, 1500);
  };

  const handleNoteSelect = (id: string) => {
    setSelectedNote(id);
    setTab('preview');
  };

  const getSelectedNote = () => sampleNotes.find((n) => n.id === selectedNote) || sampleNotes[0];

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: 'upload', label: 'Upload' },
          { value: 'preview', label: 'Preview/Edit' },
          { value: 'library', label: 'My Library' },
        ]}
        style={styles.tabs}
      />
      {tab === 'upload' && (
        <View style={styles.tabContent}>
          <Text style={styles.title} variant="headlineMedium">Upload Notes</Text>
          <Button mode="contained" onPress={handleUpload} loading={uploading} disabled={uploading} style={styles.uploadButton}>
            {uploading ? 'Processing...' : 'Simulate Upload'}
          </Button>
          <Text style={styles.infoText}>Convert handwritten notes to digital text, generate summaries, flashcards, and more.</Text>
        </View>
      )}
      {tab === 'preview' && (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.title} variant="headlineMedium">Preview & Edit</Text>
          <Text style={styles.infoText}>Select output format:</Text>
          <View style={styles.formatRow}>
            {outputFormats.map((f) => (
              <Chip
                key={f.key}
                selected={selectedFormat === f.key}
                onPress={() => setSelectedFormat(f.key)}
                style={styles.chip}
              >
                {f.value}
              </Chip>
            ))}
          </View>
          <Text style={styles.infoText}>Note Content:</Text>
          <TextInput
            multiline
            value={getSelectedNote().content}
            style={styles.noteInput}
            editable={false}
          />
        </ScrollView>
      )}
      {tab === 'library' && (
        <FlatList
          data={sampleNotes}
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => handleNoteSelect(item.id)}>
              <Card.Title title={item.title} subtitle={item.date} />
              <Card.Content>
                <Text>{item.preview}</Text>
                <View style={styles.tagRow}>
                  {item.tags.map((tag) => (
                    <Chip key={tag} style={styles.chip}>{tag}</Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Feature Coming Soon</Dialog.Title>
          <Dialog.Content>
            <Text>This feature will be available in a future update.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>OK</Button>
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
  tabs: {
    marginBottom: 12,
  },
  tabContent: {
    flex: 1,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  uploadButton: {
    marginBottom: 16,
  },
  formatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
  },
  noteInput: {
    minHeight: 120,
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 32,
  },
}); 