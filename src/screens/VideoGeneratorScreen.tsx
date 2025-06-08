import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, ProgressBar, Card } from 'react-native-paper';
import Video from 'react-native-video';
import { VideoGenerator } from '../services/videoGenerator';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

export const VideoGeneratorScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generations, setGenerations] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadVideoGenerations();
      // Subscribe to real-time updates
      const subscription = supabaseService.subscribeToVideoGenerations(
        user.id,
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setGenerations(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setGenerations(prev =>
              prev.map(gen =>
                gen.id === payload.new.id ? payload.new : gen
              )
            );
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const loadVideoGenerations = async () => {
    if (!user) return;
    try {
      const data = await supabaseService.getVideoGenerations(user.id);
      setGenerations(data);
    } catch (error) {
      console.error('Error loading video generations:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Create video generation record
      const generation = await supabaseService.createVideoGeneration({
        user_id: user.id,
        prompt: prompt,
        script: '',
        video_url: '',
        status: 'pending'
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.1, 0.9));
      }, 1000);

      // Generate video
      const videoResult = await VideoGenerator.generateFromPrompt(prompt);
      
      clearInterval(progressInterval);
      setProgress(1);

      // Update video generation record
      await supabaseService.updateVideoGeneration(generation.id, {
        script: videoResult.script,
        video_url: videoResult.videoUrl,
        status: videoResult.error ? 'failed' : 'completed'
      });

      if (videoResult.error) {
        Alert.alert('Error', videoResult.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate video');
    } finally {
      setIsGenerating(false);
      setPrompt('');
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

        <Text style={styles.historyTitle}>Generation History</Text>
        {generations.map((generation) => (
          <Card key={generation.id} style={styles.generationCard}>
            <Card.Content>
              <Text style={styles.promptText}>Prompt: {generation.prompt}</Text>
              <Text style={styles.statusText}>Status: {generation.status}</Text>
              
              {generation.status === 'completed' && (
                <>
                  <Text style={styles.scriptTitle}>Generated Script:</Text>
                  <Text style={styles.script}>{generation.script}</Text>

                  <Text style={styles.videoTitle}>Generated Video:</Text>
                  <Video
                    source={{ uri: generation.video_url }}
                    style={styles.video}
                    controls
                    resizeMode="contain"
                  />
                </>
              )}
            </Card.Content>
          </Card>
        ))}
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
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  generationCard: {
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  scriptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  script: {
    marginBottom: 16,
    lineHeight: 20,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
}); 