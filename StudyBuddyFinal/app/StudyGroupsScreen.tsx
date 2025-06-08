import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput as RNTextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, Card, Button, Dialog, Portal, TextInput, Chip, Avatar } from 'react-native-paper';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  description: string;
  createdBy: string;
}

interface GroupMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export default function StudyGroupsScreen() {
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Advanced Mathematics',
      subject: 'Mathematics',
      members: 5,
      description: 'Study group for advanced mathematics topics',
      createdBy: 'John Doe',
    },
    {
      id: '2',
      name: 'Physics Lab',
      subject: 'Physics',
      members: 3,
      description: 'Collaborative physics lab study group',
      createdBy: 'Jane Smith',
    },
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', subject: '', description: '' });
  const [messages, setMessages] = useState<GroupMessage[]>([
    {
      id: '1',
      content: 'Hello everyone! Welcome to the study group.',
      sender: 'John Doe',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => {
    setShowDialog(false);
    setNewGroup({ name: '', subject: '', description: '' });
  };

  const handleCreateGroup = () => {
    if (!newGroup.name.trim() || !newGroup.subject.trim()) {
      Alert.alert('Error', 'Please enter group name and subject.');
      return;
    }
    setGroups((prev) => [
      {
        id: Date.now().toString(),
        name: newGroup.name,
        subject: newGroup.subject,
        members: 1,
        description: newGroup.description,
        createdBy: 'Current User',
      },
      ...prev,
    ]);
    closeDialog();
    Alert.alert('Group Created', 'Your study group has been created successfully.');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: GroupMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'Current User',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const renderGroup = ({ item }: { item: StudyGroup }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.description} left={() => <Chip>{item.subject}</Chip>} />
      <Card.Content>
        <Text>{item.members} members</Text>
      </Card.Content>
      <Card.Actions>
        <Button>Join Group</Button>
      </Card.Actions>
    </Card>
  );

  const renderMessage = ({ item }: { item: GroupMessage }) => (
    <View style={styles.messageRow}>
      <Avatar.Text size={32} label={item.sender.charAt(0)} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text>{item.content}</Text>
        <Text style={styles.timestamp}>{item.timestamp.toLocaleTimeString()}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title} variant="headlineMedium">Study Groups</Text>
      <Button mode="contained" onPress={openDialog} style={styles.addButton}>Create New Group</Button>
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No groups found.</Text>}
        contentContainerStyle={styles.listContent}
      />
      <Text style={styles.subtitle} variant="titleMedium">Group Chat</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        style={styles.chatList}
      />
      <View style={styles.inputRow}>
        <RNTextInput
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        <Button mode="contained" onPress={handleSendMessage} style={styles.sendButton}>Send</Button>
      </View>
      <Portal>
        <Dialog visible={showDialog} onDismiss={closeDialog}>
          <Dialog.Title>Create New Group</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Group Name"
              value={newGroup.name}
              onChangeText={(text) => setNewGroup((g) => ({ ...g, name: text }))}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Subject"
              value={newGroup.subject}
              onChangeText={(text) => setNewGroup((g) => ({ ...g, subject: text }))}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Description"
              value={newGroup.description}
              onChangeText={(text) => setNewGroup((g) => ({ ...g, description: text }))}
              multiline
              numberOfLines={2}
              style={{ minHeight: 40 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleCreateGroup}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
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
    paddingBottom: 16,
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  chatList: {
    maxHeight: 200,
    marginBottom: 8,
  },
  chatContent: {
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#1976d2',
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
  },
  sendButton: {
    height: 40,
    justifyContent: 'center',
  },
}); 