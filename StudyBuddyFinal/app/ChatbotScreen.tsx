import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Avatar } from 'react-native-paper';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: 'This is a mock response. The actual AI integration will be implemented here.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.role === 'user' ? styles.userRow : styles.aiRow]}>
      <Avatar.Text
        size={32}
        label={item.role === 'user' ? 'U' : 'AI'}
        style={item.role === 'user' ? styles.userAvatar : styles.aiAvatar}
      />
      <Card style={[styles.messageCard, item.role === 'user' ? styles.userCard : styles.aiCard]}>
        <Card.Content>
          <Text>{item.content}</Text>
          <Text style={styles.timestamp}>{item.timestamp.toLocaleTimeString()}</Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.title} variant="headlineMedium">AI Study Assistant</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={styles.messagesContainer}
      />
      {isLoading && (
        <Text style={styles.loadingText}>Thinking...</Text>
      )}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Type your question here..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        <Button mode="contained" onPress={handleSendMessage} disabled={isLoading || !input.trim()} style={styles.sendButton}>
          Send
        </Button>
      </View>
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
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  userAvatar: {
    backgroundColor: '#1976d2',
    marginLeft: 8,
  },
  aiAvatar: {
    backgroundColor: '#757575',
    marginRight: 8,
  },
  messageCard: {
    maxWidth: '80%',
    marginHorizontal: 8,
  },
  userCard: {
    backgroundColor: '#e3f2fd',
  },
  aiCard: {
    backgroundColor: '#f5f5f5',
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
  },
  sendButton: {
    height: 48,
    justifyContent: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 8,
  },
}); 