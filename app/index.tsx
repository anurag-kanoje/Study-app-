import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { session, loading, error } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to StudyBuddy</Text>
      {session ? (
        <Text style={styles.subtitle}>Hi, {session.user.email}</Text>
      ) : (
        <Text style={styles.subtitle}>Please login to continue</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
