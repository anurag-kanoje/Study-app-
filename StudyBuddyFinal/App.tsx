import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

// Import screens
import HomeScreen from './app/home';
import LoginScreen from './app/login';
import RegisterScreen from './app/register';
import WelcomeScreen from './app/index';
import ChatbotScreen from './app/ChatbotScreen';
import NotesScreen from './app/NotesScreen';
import StudyGroupsScreen from './app/StudyGroupsScreen';
import FlashcardsScreen from './app/FlashcardsScreen';
import ExamPrepScreen from './app/ExamPrepScreen';
import AINotesScreen from './app/AINotesScreen';
import SummarizeScreen from './app/SummarizeScreen';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
      <StatusBar style="auto" />
            <Stack.Navigator 
              initialRouteName="Welcome"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#fff' }
              }}
            >
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Chatbot" component={ChatbotScreen} />
              <Stack.Screen name="Notes" component={NotesScreen} />
              <Stack.Screen name="StudyGroups" component={StudyGroupsScreen} />
              <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
              <Stack.Screen name="ExamPrep" component={ExamPrepScreen} />
              <Stack.Screen name="AINotes" component={AINotesScreen} />
              <Stack.Screen name="Summarize" component={SummarizeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
