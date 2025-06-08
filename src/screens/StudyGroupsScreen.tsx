import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import type { StudyGroup } from '../lib/supabase';

export const StudyGroupsScreen = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadStudyGroups();
  }, []);

  const loadStudyGroups = async () => {
    try {
      const data = await supabaseService.getStudyGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error loading study groups:', error);
      Alert.alert('Error', 'Failed to load study groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !user) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setCreatingGroup(true);
    try {
      const newGroup = await supabaseService.createStudyGroup({
        name: newGroupName,
        description: newGroupDescription,
        created_by: user.id,
        members: [user.id]
      });

      setGroups(prev => [newGroup, ...prev]);
      setModalVisible(false);
      setNewGroupName('');
      setNewGroupDescription('');
    } catch (error) {
      console.error('Error creating study group:', error);
      Alert.alert('Error', 'Failed to create study group');
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      await supabaseService.joinStudyGroup(groupId, user.id);
      Alert.alert('Success', 'You have joined the study group');
      // Refresh groups to show updated member count
      loadStudyGroups();
    } catch (error) {
      console.error('Error joining study group:', error);
      Alert.alert('Error', 'Failed to join study group');
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
          <Text style={styles.title}>Study Groups</Text>
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.createButton}
          >
            Create Group
          </Button>
        </View>

        {groups.map((group) => (
          <Card key={group.id} style={styles.groupCard}>
            <Card.Content>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupDescription}>{group.description}</Text>
              <Text style={styles.memberCount}>
                {group.members.length} member{group.members.length !== 1 ? 's' : ''}
              </Text>
            </Card.Content>
            <Card.Actions>
              {!group.members.includes(user?.id || '') && (
                <Button
                  mode="contained"
                  onPress={() => handleJoinGroup(group.id)}
                >
                  Join Group
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Create New Study Group</Text>
          <TextInput
            label="Group Name"
            value={newGroupName}
            onChangeText={setNewGroupName}
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={newGroupDescription}
            onChangeText={setNewGroupDescription}
            multiline
            numberOfLines={3}
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
              onPress={handleCreateGroup}
              loading={creatingGroup}
              disabled={creatingGroup}
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
  groupCard: {
    margin: 8,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 12,
    color: '#888',
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