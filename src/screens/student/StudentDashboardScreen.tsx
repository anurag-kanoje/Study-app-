"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Bell,
  Settings,
  ChevronRight,
  Brain,
  Search,
  FileText,
  CheckCircle,
} from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

const { width } = Dimensions.get("window")

type RootStackParamList = {
  Notifications: undefined
  Settings: undefined
  AINotes: undefined
  AISummarization: undefined
  AIProblemSolving: undefined
  AISubjectSearch: undefined
  AIQuizGenerator: undefined
}

type StudentDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>

const StudentDashboardScreen = () => {
  const navigation = useNavigation<StudentDashboardNavigationProp>()
  const { colors } = useTheme()
  const { user } = useAuth()

  const [refreshing, setRefreshing] = useState(false)
  const [studyStreak, setStudyStreak] = useState(5)
  const [studyTime, setStudyTime] = useState("2h 45m")
  const [tasksCompleted, setTasksCompleted] = useState("12/20")
  const [weeklyGoal, setWeeklyGoal] = useState(68)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, [])

  // Study streak days
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const completedDays = [0, 1, 2, 4] // Indexes of completed days

  // AI tools
  const aiTools = [
    {
      id: "notes",
      title: "AI Notes",
      description: "Convert images to text and create smart notes",
      icon: <BookOpen size={24} color={colors.primary} />,
      screen: "AINotes",
    },
    {
      id: "summarization",
      title: "AI Summarization",
      description: "Convert large study materials into concise points",
      icon: <FileText size={24} color={colors.primary} />,
      screen: "AISummarization",
    },
    {
      id: "problem-solving",
      title: "AI Problem Solving",
      description: "Step-by-step solutions for Math, Science, etc.",
      icon: <Brain size={24} color={colors.primary} />,
      screen: "AIProblemSolving",
    },
    {
      id: "subject-search",
      title: "Subject Search",
      description: "Find study materials across books, videos, and articles",
      icon: <Search size={24} color={colors.primary} />,
      screen: "AISubjectSearch",
    },
  ]

  // Upcoming tasks
  const upcomingTasks = [
    {
      id: "1",
      title: "Complete Physics Assignment",
      subject: "Physics",
      dueDate: "Today, 6:00 PM",
      isCompleted: false,
    },
    {
      id: "2",
      title: "Read Chapter 5 of History Textbook",
      subject: "History",
      dueDate: "Today, 8:00 PM",
      isCompleted: false,
    },
    {
      id: "3",
      title: "Prepare Notes for Biology Class",
      subject: "Biology",
      dueDate: "Tomorrow, 9:00 AM",
      isCompleted: true,
    },
  ]

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello, {user?.displayName?.split(" ")[0] || "Student"}
          </Text>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.secondary }]}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Bell size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.secondary }]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, { color: colors.mutedForeground }]}>Study Time Today</Text>
            <Clock size={16} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{studyTime}</Text>
          <Text style={[styles.statsSubtext, { color: colors.mutedForeground }]}>+15% from yesterday</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, { color: colors.mutedForeground }]}>Weekly Goal</Text>
            <TrendingUp size={16} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{weeklyGoal}%</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${weeklyGoal}%`,
                },
              ]}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, { color: colors.mutedForeground }]}>Tasks Completed</Text>
            <CheckCircle size={16} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{tasksCompleted}</Text>
          <Text style={[styles.statsSubtext, { color: colors.mutedForeground }]}>4 due today</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, { color: colors.mutedForeground }]}>Study Streak</Text>
            <Award size={16} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{studyStreak} days</Text>
          <View style={styles.streakContainer}>
            {days.map((day, index) => (
              <View key={index} style={styles.streakDay}>
                <View
                  style={[
                    styles.streakDot,
                    {
                      backgroundColor: completedDays.includes(index) ? colors.primary : colors.muted,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.streakDayText,
                      {
                        color: completedDays.includes(index) ? colors.primaryForeground : colors.mutedForeground,
                      },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      {/* AI Study Tools */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Study Tools</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.aiToolsContainer}>
          {aiTools.map((tool, index) => (
            <Animated.View key={tool.id} entering={FadeInDown.delay(500 + index * 100).duration(400)}>
              <TouchableOpacity
                style={[styles.aiToolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate(tool.screen as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.aiToolIconContainer, { backgroundColor: colors.primary + "15" }]}>
                  {tool.icon}
                </View>
                <Text style={[styles.aiToolTitle, { color: colors.text }]}>{tool.title}</Text>
                <Text style={[styles.aiToolDescription, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {tool.description}
                </Text>
                <View style={styles.aiToolFooter}>
                  <ChevronRight size={16} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Tasks</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tasksContainer}>
          {upcomingTasks.map((task, index) => (
            <Animated.View
              key={task.id}
              entering={FadeInDown.delay(900 + index * 100).duration(400)}
              style={[
                styles.taskCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: task.isCompleted ? 0.6 : 1,
                },
              ]}
            >
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      {
                        borderColor: task.isCompleted ? colors.primary : colors.border,
                        backgroundColor: task.isCompleted ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    {task.isCompleted && <CheckCircle size={14} color={colors.primaryForeground} />}
                  </TouchableOpacity>
                  <View>
                    <Text
                      style={[
                        styles.taskTitle,
                        {
                          color: colors.text,
                          textDecorationLine: task.isCompleted ? "line-through" : "none",
                        },
                      ]}
                    >
                      {task.title}
                    </Text>
                    <Text style={[styles.taskSubject, { color: colors.mutedForeground }]}>{task.subject}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.taskFooter}>
                <View style={styles.taskDueContainer}>
                  <Clock size={14} color={colors.mutedForeground} />
                  <Text style={[styles.taskDueText, { color: colors.mutedForeground }]}>{task.dueDate}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
  },
  date: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    width: (width - 44) / 2, // Accounting for padding and gap
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  statsValue: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  streakContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  streakDay: {
    alignItems: "center",
  },
  streakDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  streakDayText: {
    fontSize: 10,
    fontFamily: "Inter-Medium",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  aiToolsContainer: {
    paddingRight: 16,
    gap: 12,
  },
  aiToolCard: {
    width: 160,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  aiToolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  aiToolTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginBottom: 8,
  },
  aiToolDescription: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginBottom: 12,
    height: 32, // Fixed height for 2 lines
  },
  aiToolFooter: {
    alignItems: "flex-end",
  },
  tasksContainer: {
    gap: 12,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  taskTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    marginBottom: 4,
  },
  taskSubject: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskDueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  taskDueText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
})

export default StudentDashboardScreen

