import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Button, Card, TextInput, ProgressBar, Chip, SegmentedButtons } from 'react-native-paper';

interface Summary {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text';
  timestamp: Date;
}

export default function SummarizeScreen() {
  const [tab, setTab] = useState<'video' | 'text'>('video');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summaries, setSummaries] = useState<Summary[]>([
    {
      id: '1',
      title: 'Introduction to Calculus',
      content: 'Key points:\n1. Limits and continuity\n2. Derivatives and their applications\n3. Integration techniques',
      type: 'video',
      timestamp: new Date(),
    },
  ]);
  const [textInput, setTextInput] = useState('');

  const handleVideoUpload = () => {
    setIsProcessing(true);
    setProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setSummaries((prev) => [
          {
            id: Date.now().toString(),
            title: 'Uploaded Video Summary',
            content: 'This is a simulated summary of your uploaded video.',
            type: 'video',
            timestamp: new Date(),
          },
          ...prev,
        ]);
      }
    }, 300);
  };

  const handleTextSummarize = () => {
    if (!textInput.trim()) return;
    setIsProcessing(true);
    setProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setSummaries((prev) => [
          {
            id: Date.now().toString(),
            title: 'Text Summary',
            content: 'This is a simulated summary of your text:\n' + textInput,
            type: 'text',
            timestamp: new Date(),
          },
          ...prev,
        ]);
        setTextInput('');
      }
    }, 300);
  };

  const renderSummary = ({ item }: { item: Summary }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={item.timestamp.toLocaleDateString()}
        right={() => <Chip>{item.type === 'video' ? 'Video' : 'Text'}</Chip>}
      />
      <Card.Content>
        <Text>{item.content}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={(value) => setTab(value as 'video' | 'text')}
        buttons={[
          { value: 'video', label: 'Video Summarization' },
          { value: 'text', label: 'Text Summarization' },
        ]}
        style={styles.tabs}
      />
      {tab === 'video' && (
        <View style={styles.tabContent}>
          <Text style={styles.title} variant="headlineMedium">Video Summarization</Text>
          <Button mode="contained" onPress={handleVideoUpload} disabled={isProcessing} style={styles.uploadButton}>
            {isProcessing ? 'Processing...' : 'Simulate Video Upload'}
          </Button>
          {isProcessing && (
            <View style={styles.progressRow}>
              <Text>Processing: {progress}%</Text>
              <ProgressBar progress={progress / 100} style={styles.progressBar} />
            </View>
          )}
        </View>
      )}
      {tab === 'text' && (
        <View style={styles.tabContent}>
          <Text style={styles.title} variant="headlineMedium">Text Summarization</Text>
          <TextInput
            label="Text Content"
            value={textInput}
            onChangeText={setTextInput}
            multiline
            numberOfLines={6}
            style={styles.textInput}
            placeholder="Paste your text here..."
            editable={!isProcessing}
          />
          <Button mode="contained" onPress={handleTextSummarize} disabled={isProcessing || !textInput.trim()} style={styles.uploadButton}>
            {isProcessing ? 'Processing...' : 'Generate Summary'}
          </Button>
          {isProcessing && (
            <View style={styles.progressRow}>
              <Text>Processing: {progress}%</Text>
              <ProgressBar progress={progress / 100} style={styles.progressBar} />
            </View>
          )}
        </View>
      )}
      <Text style={styles.subtitle} variant="titleMedium">Recent Summaries</Text>
      <FlatList
        data={summaries}
        renderItem={renderSummary}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
    marginBottom: 16,
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
  uploadButton: {
    marginBottom: 12,
  },
  progressRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    marginTop: 4,
  },
  textInput: {
    minHeight: 100,
    marginBottom: 8,
  },
  card: {
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 32,
  },
}); 