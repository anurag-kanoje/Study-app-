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

type NavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

export default function Welcome() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>Welcome to Study Buddy</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Your AI-powered study companion</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        >
          Login
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
        >
          Register
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