import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome to Study Buddy</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Your AI-powered study companion</Text>
      
      <View style={styles.buttonContainer}>
        <Button mode="contained" style={styles.button}>
          Start New Session
        </Button>
        
        <Button mode="outlined" style={styles.button}>
          View History
        </Button>
        
        <Button mode="outlined" onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 10,
  },
  button: {
    width: '100%',
  },
}); 