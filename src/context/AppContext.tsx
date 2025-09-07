import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomMessage, getStreakMessage, getAchievementMessage } from '../utils/motivationalMessages';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  category?: 'work' | 'health' | 'personal' | 'learning' | 'creativity' | 'finance';
  energyLevel?: 'high' | 'medium' | 'low';
  estimatedDuration?: number; // in minutes
  priority?: 'high' | 'medium' | 'low';
  description?: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
  icon: string;
};

type AppContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  isLoading: boolean;
  // New features
  dailyStreak: number;
  weeklyGoal: number;
  completedToday: number;
  morningKickoff: string | null;
  setMorningKickoff: (goal: string) => void;
  endOfDayReflection: string | null;
  setEndOfDayReflection: (reflection: string) => void;
  getSmartSuggestions: () => string[];
  // Motivational features
  achievements: Achievement[];
  totalTasksCompleted: number;
  showCelebration: boolean;
  celebrationMessage: string;
  celebrationAchievement: string | null;
  triggerCelebration: (message?: string, achievement?: string) => void;
  hideCelebration: () => void;
  getMotivationalMessage: () => string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = '@EasinDailyPlanner_tasks';
const ONBOARDING_STORAGE_KEY = '@EasinDailyPlanner_onboarding';
const STREAK_STORAGE_KEY = '@EasinDailyPlanner_streak';
const MORNING_KICKOFF_KEY = '@EasinDailyPlanner_morningKickoff';
const REFLECTION_KEY = '@EasinDailyPlanner_reflection';
const ACHIEVEMENTS_KEY = '@EasinDailyPlanner_achievements';
const TOTAL_TASKS_KEY = '@EasinDailyPlanner_totalTasks';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [morningKickoff, setMorningKickoffState] = useState<string | null>(null);
  const [endOfDayReflection, setEndOfDayReflectionState] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [celebrationAchievement, setCelebrationAchievement] = useState<string | null>(null);

  // Load tasks and onboarding status from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, onboardingData] = await Promise.all([
          AsyncStorage.getItem(TASKS_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
        ]);

        if (tasksData) {
          const parsedTasks = JSON.parse(tasksData).map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
          setTasks(parsedTasks);
        }

        if (onboardingData) {
          setHasCompletedOnboarding(JSON.parse(onboardingData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
          console.error('Error saving tasks:', error);
        }
      }
    };

    saveTasks();
  }, [tasks, isLoading]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === id) {
          const wasCompleted = task.completed;
          const newCompleted = !wasCompleted;
          
          // If task is being completed, trigger celebration
          if (!wasCompleted && newCompleted) {
            setTotalTasksCompleted(prev => prev + 1);
            
            // Check for achievements
            const newTotal = totalTasksCompleted + 1;
            if (newTotal === 1) {
              triggerCelebration(getRandomMessage('firstTask'), getAchievementMessage('firstWeek'));
            } else if (newTotal === 50) {
              triggerCelebration(getRandomMessage('taskCompleted'), getAchievementMessage('taskMaster'));
            } else {
              triggerCelebration(getRandomMessage('taskCompleted'));
            }
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return updatedTasks;
    });
  }, [totalTasksCompleted]);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, []);

  const setMorningKickoff = useCallback(async (goal: string) => {
    try {
      await AsyncStorage.setItem(MORNING_KICKOFF_KEY, goal);
      setMorningKickoffState(goal);
    } catch (error) {
      console.error('Error saving morning kickoff:', error);
    }
  }, []);

  const setEndOfDayReflection = useCallback(async (reflection: string) => {
    try {
      await AsyncStorage.setItem(REFLECTION_KEY, reflection);
      setEndOfDayReflectionState(reflection);
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
  }, []);

  const getSmartSuggestions = useCallback(() => {
    const today = new Date();
    const todaysTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    });

    const suggestions: string[] = [];
    
    if (todaysTasks.length === 0) {
      suggestions.push("Add your first task to get started with your day!");
    } else if (todaysTasks.filter(t => t.completed).length === 0) {
      suggestions.push("Start with your highest priority task to build momentum!");
    } else if (todaysTasks.filter(t => t.energyLevel === 'high').length > 0) {
      suggestions.push("Perfect time for high-energy tasks! Tackle them now.");
    } else if (todaysTasks.length > 5) {
      suggestions.push("You have a lot on your plate. Consider moving some tasks to tomorrow.");
    }

    return suggestions;
  }, [tasks]);

  const completedToday = useMemo(() => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.dueDate || !task.completed) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [tasks]);

  const triggerCelebration = useCallback((message?: string, achievement?: string) => {
    setCelebrationMessage(message || getRandomMessage('taskCompleted'));
    setCelebrationAchievement(achievement || null);
    setShowCelebration(true);
  }, []);

  const hideCelebration = useCallback(() => {
    setShowCelebration(false);
    setCelebrationMessage('');
    setCelebrationAchievement(null);
  }, []);

  const getMotivationalMessage = useCallback(() => {
    return getRandomMessage('encouragement');
  }, []);

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    hasCompletedOnboarding,
    completeOnboarding,
    isLoading,
    dailyStreak,
    weeklyGoal,
    completedToday,
    morningKickoff,
    setMorningKickoff,
    endOfDayReflection,
    setEndOfDayReflection,
    getSmartSuggestions,
    achievements,
    totalTasksCompleted,
    showCelebration,
    celebrationMessage,
    celebrationAchievement,
    triggerCelebration,
    hideCelebration,
    getMotivationalMessage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
