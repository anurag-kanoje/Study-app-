"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Home, BookOpen, Calendar, User, Users, Settings, Search } from "lucide-react-native"

// Student Screens
import StudentDashboardScreen from "../screens/student/StudentDashboardScreen"
import AIToolsScreen from "../screens/student/AIToolsScreen"
import ClassroomScreen from "../screens/student/ClassroomScreen"
import QuizScreen from "../screens/student/QuizScreen"
import ProfileScreen from "../screens/student/ProfileScreen"

// Teacher Screens
import TeacherDashboardScreen from "../screens/teacher/TeacherDashboardScreen"
import TeacherClassroomScreen from "../screens/teacher/TeacherClassroomScreen"
import TeacherStudentsScreen from "../screens/teacher/TeacherStudentsScreen"
import TeacherAssignmentsScreen from "../screens/teacher/TeacherAssignmentsScreen"

// Parent Screens
import ParentDashboardScreen from "../screens/parent/ParentDashboardScreen"
import ParentControlScreen from "../screens/parent/ParentControlScreen"
import ParentReportsScreen from "../screens/parent/ParentReportsScreen"

// Common Screens
import SettingsScreen from "../screens/common/SettingsScreen"
import NotificationsScreen from "../screens/common/NotificationsScreen"

// AI Tool Screens
import AINotesScreen from "../screens/ai/AINotesScreen"
import AISummarizationScreen from "../screens/ai/AISummarizationScreen"
import AIProblemSolvingScreen from "../screens/ai/AIProblemSolvingScreen"
import AISubjectSearchScreen from "../screens/ai/AISubjectSearchScreen"
import AIQuizGeneratorScreen from "../screens/ai/AIQuizGeneratorScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack navigators for each tab
const HomeStack = () => {
  const { user } = useAuth()
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      {user?.role === "student" && (
        <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} options={{ title: "Dashboard" }} />
      )}
      {user?.role === "teacher" && (
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} options={{ title: "Dashboard" }} />
      )}
      {user?.role === "parent" && (
        <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} options={{ title: "Dashboard" }} />
      )}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}

const AIToolsStack = () => {
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="AITools" component={AIToolsScreen} options={{ title: "AI Study Tools" }} />
      <Stack.Screen name="AINotes" component={AINotesScreen} options={{ title: "AI Notes" }} />
      <Stack.Screen name="AISummarization" component={AISummarizationScreen} options={{ title: "AI Summarization" }} />
      <Stack.Screen
        name="AIProblemSolving"
        component={AIProblemSolvingScreen}
        options={{ title: "AI Problem Solving" }}
      />
      <Stack.Screen name="AISubjectSearch" component={AISubjectSearchScreen} options={{ title: "Subject Search" }} />
      <Stack.Screen name="AIQuizGenerator" component={AIQuizGeneratorScreen} options={{ title: "Quiz Generator" }} />
    </Stack.Navigator>
  )
}

const ClassroomStack = () => {
  const { user } = useAuth()
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      {user?.role === "student" && (
        <Stack.Screen name="Classroom" component={ClassroomScreen} options={{ title: "Google Classroom" }} />
      )}
      {user?.role === "teacher" && (
        <>
          <Stack.Screen name="TeacherClassroom" component={TeacherClassroomScreen} options={{ title: "Classroom" }} />
          <Stack.Screen
            name="TeacherAssignments"
            component={TeacherAssignmentsScreen}
            options={{ title: "Assignments" }}
          />
          <Stack.Screen name="TeacherStudents" component={TeacherStudentsScreen} options={{ title: "Students" }} />
        </>
      )}
      {user?.role === "parent" && (
        <Stack.Screen name="ParentControl" component={ParentControlScreen} options={{ title: "Parental Controls" }} />
      )}
    </Stack.Navigator>
  )
}

const QuizStack = () => {
  const { user } = useAuth()
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      {user?.role === "student" && (
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Quizzes & Assessments" }} />
      )}
      {user?.role === "teacher" && (
        <Stack.Screen name="TeacherStudents" component={TeacherStudentsScreen} options={{ title: "Students" }} />
      )}
      {user?.role === "parent" && (
        <Stack.Screen name="ParentReports" component={ParentReportsScreen} options={{ title: "Progress Reports" }} />
      )}
    </Stack.Navigator>
  )
}

const ProfileStack = () => {
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}

const RootNavigator = () => {
  const { user } = useAuth()
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter-Medium",
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="AIToolsTab"
        component={AIToolsStack}
        options={{
          tabBarLabel: "AI Tools",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="ClassroomTab"
        component={ClassroomStack}
        options={{
          tabBarLabel: user?.role === "parent" ? "Controls" : "Classroom",
          tabBarIcon: ({ color, size }) =>
            user?.role === "parent" ? <Settings size={size} color={color} /> : <Calendar size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="QuizTab"
        component={QuizStack}
        options={{
          tabBarLabel: user?.role === "teacher" ? "Students" : user?.role === "parent" ? "Reports" : "Quizzes",
          tabBarIcon: ({ color, size }) =>
            user?.role === "teacher" || user?.role === "parent" ? (
              <Users size={size} color={color} />
            ) : (
              <Search size={size} color={color} />
            ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default RootNavigator

