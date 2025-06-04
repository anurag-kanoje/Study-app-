import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, ProgressBar } from 'react-native-paper';
import Video from 'react-native-video';
import { VideoGenerator, VideoGenerationResult } from '../services/videoGenerator';

export const VideoGeneratorScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.1, 0.9));
      }, 1000);

      const videoResult = await VideoGenerator.generateFromPrompt(prompt);
      
      clearInterval(progressInterval);
      setProgress(1);
      setResult(videoResult);

      if (videoResult.error) {
        Alert.alert('Error', videoResult.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>AI Video Generator</Text>
        <Text style={styles.subtitle}>Transform your ideas into engaging videos</Text>

        <TextInput
          label="Enter your topic or idea"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={4}
          style={styles.input}
          disabled={isGenerating}
        />

        <Button
          mode="contained"
          onPress={handleGenerate}
          loading={isGenerating}
          disabled={isGenerating}
          style={styles.button}
        >
          Generate Video
        </Button>

        {isGenerating && (
          <View style={styles.progressContainer}>
            <Text>Generating your video...</Text>
            <ProgressBar progress={progress} style={styles.progressBar} />
          </View>
        )}

        {result?.videoUrl && (
          <View style={styles.resultContainer}>
            <Text style={styles.scriptTitle}>Generated Script:</Text>
            <Text style={styles.script}>{result.script}</Text>

            <Text style={styles.videoTitle}>Generated Video:</Text>
            <Video
              source={{ uri: result.videoUrl }}
              style={styles.video}
              controls
              resizeMode="contain"
            />
          </View>
        )}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 20,
  },
  progressContainer: {
    marginVertical: 20,
  },
  progressBar: {
    marginTop: 8,
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  scriptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  script: {
    marginBottom: 16,
    lineHeight: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
}); 