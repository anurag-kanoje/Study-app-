import { createStackNavigator } from '@react-navigation/stack';
import { VideoGeneratorScreen } from '../screens/VideoGeneratorScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="VideoGenerator" 
        component={VideoGeneratorScreen}
        options={{
          title: 'AI Video Generator',
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}; 