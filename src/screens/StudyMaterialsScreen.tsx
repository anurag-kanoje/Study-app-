import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, Portal, Modal, ActivityIndicator, Chip } from 'react-native-paper';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import type { StudyMaterial } from '../lib/supabase';
import { useRoute, useNavigation } from '@react-navigation/native';

export const StudyMaterialsScreen = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialDescription, setNewMaterialDescription] = useState('');
  const [newMaterialContent, setNewMaterialContent] = useState('');
  const [newMaterialTags, setNewMaterialTags] = useState('');
  const [creatingMaterial, setCreatingMaterial] = useState(false);
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const groupId = route.params?.groupId;

  useEffect(() => {
    loadStudyMaterials();
    if (groupId) {
      const subscription = supabaseService.subscribeToStudyGroup(
        groupId,
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMaterials(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMaterials(prev =>
              prev.map(material =>
                material.id === payload.new.id ? payload.new : material
              )
            );
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [groupId]);

  const loadStudyMaterials = async () => {
    try {
      const data = await supabaseService.getStudyMaterials(groupId);
      setMaterials(data);
    } catch (error) {
      console.error('Error loading study materials:', error);
      Alert.alert('Error', 'Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    if (!newMaterialTitle.trim() || !user) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    setCreatingMaterial(true);
    try {
      const newMaterial = await supabaseService.createStudyMaterial({
        title: newMaterialTitle,
        description: newMaterialDescription,
        content: newMaterialContent,
        created_by: user.id,
        group_id: groupId,
        tags: newMaterialTags.split(',').map(tag => tag.trim()).filter(Boolean)
      });

      setMaterials(prev => [newMaterial, ...prev]);
      setModalVisible(false);
      setNewMaterialTitle('');
      setNewMaterialDescription('');
      setNewMaterialContent('');
      setNewMaterialTags('');
    } catch (error) {
      console.error('Error creating study material:', error);
      Alert.alert('Error', 'Failed to create study material');
    } finally {
      setCreatingMaterial(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Study Materials</Text>
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.createButton}
          >
            Add Material
          </Button>
        </View>

        {materials.map((material) => (
          <Card key={material.id} style={styles.materialCard}>
            <Card.Content>
              <Text style={styles.materialTitle}>{material.title}</Text>
              <Text style={styles.materialDescription}>{material.description}</Text>
              <Text style={styles.materialContent}>{material.content}</Text>
              <View style={styles.tagsContainer}>
                {material.tags.map((tag, index) => (
                  <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                    {tag}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Add Study Material</Text>
          <TextInput
            label="Title"
            value={newMaterialTitle}
            onChangeText={setNewMaterialTitle}
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={newMaterialDescription}
            onChangeText={setNewMaterialDescription}
            multiline
            numberOfLines={2}
            style={styles.input}
          />
          <TextInput
            label="Content"
            value={newMaterialContent}
            onChangeText={setNewMaterialContent}
            multiline
            numberOfLines={6}
            style={styles.input}
          />
          <TextInput
            label="Tags (comma-separated)"
            value={newMaterialTags}
            onChangeText={setNewMaterialTags}
            style={styles.input}
          />
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateMaterial}
              loading={creatingMaterial}
              disabled={creatingMaterial}
              style={styles.modalButton}
            >
              Create
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    marginLeft: 16,
  },
  materialCard: {
    margin: 8,
    elevation: 2,
  },
  materialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  materialDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  materialContent: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    margin: 4,
    backgroundColor: '#e0e0e0',
  },
  tagText: {
    fontSize: 12,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalButton: {
    marginLeft: 8,
  },
}); 