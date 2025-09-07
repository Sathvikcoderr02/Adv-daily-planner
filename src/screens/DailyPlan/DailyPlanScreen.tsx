import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Modal, TextInput, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { colors, gradients } from '../../theme/colors';
import CelebrationModal from '../../components/CelebrationModal';

export default function DailyPlanScreen() {
  const { 
    tasks, 
    toggleTask, 
    completedToday, 
    dailyStreak, 
    weeklyGoal, 
    morningKickoff, 
    setMorningKickoff,
    endOfDayReflection,
    setEndOfDayReflection,
    getSmartSuggestions,
    showCelebration,
    celebrationMessage,
    celebrationAchievement,
    hideCelebration,
    getMotivationalMessage
  } = useApp();
  
  const [showMorningModal, setShowMorningModal] = useState(false);
  const [showEveningModal, setShowEveningModal] = useState(false);
  const [morningGoal, setMorningGoal] = useState('');
  const [eveningReflection, setEveningReflection] = useState('');
  const [progressAnim] = useState(new Animated.Value(0));

  const todaysTasks = useMemo(() => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    }).sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks]);

  const completedCount = todaysTasks.filter(task => task.completed).length;
  const totalCount = todaysTasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Generate time slots for the day
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        tasks: todaysTasks.filter(task => {
          if (!task.dueDate) return false;
          return new Date(task.dueDate).getHours() === hour;
        })
      });
    }
    return slots;
  }, [todaysTasks]);

  const suggestions = getSmartSuggestions();

  const handleMorningKickoff = () => {
    if (morningGoal.trim()) {
      setMorningKickoff(morningGoal.trim());
      setShowMorningModal(false);
      setMorningGoal('');
    }
  };

  const handleEveningReflection = () => {
    if (eveningReflection.trim()) {
      setEndOfDayReflection(eveningReflection.trim());
      setShowEveningModal(false);
      setEveningReflection('');
    }
  };

  const getEnergyColor = (energyLevel?: string) => {
    switch (energyLevel) {
      case 'high': return colors.accent.teal;
      case 'medium': return colors.accent.yellow;
      case 'low': return colors.accent.coral;
      default: return colors.neutral.gray300;
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'work': return 'briefcase';
      case 'health': return 'heart';
      case 'personal': return 'person';
      case 'learning': return 'book';
      case 'creativity': return 'color-palette';
      case 'finance': return 'trending-up';
      default: return 'ellipse';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Ring */}
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Today's Plan</Text>
            <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
          </View>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={20} color="#ff6b6b" />
            <Text style={styles.streakText}>{dailyStreak}</Text>
          </View>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressRingContainer}>
          <View style={styles.progressRing}>
            <View style={[styles.progressRingFill, { 
              transform: [{ rotate: `${(progressPercentage / 100) * 360}deg` }] 
            }]} />
            <View style={styles.progressRingInner}>
              <Text style={styles.progressNumber}>{completedCount}</Text>
              <Text style={styles.progressLabel}>of {totalCount}</Text>
            </View>
          </View>
        </View>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionContainer}>
            <Ionicons name="bulb" size={16} color="#f9ca24" />
            <Text style={styles.suggestionText}>{suggestions[0]}</Text>
          </View>
        )}

        {/* Motivational Message */}
        {completedToday === 0 && (
          <View style={styles.motivationContainer}>
            <Ionicons name="heart" size={16} color="#ff6b6b" />
            <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Morning Kickoff & Evening Reflection */}
      <View style={styles.actionButtons}>
        {!morningKickoff && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowMorningModal(true)}
          >
            <Ionicons name="sunny" size={20} color="#f9ca24" />
            <Text style={styles.actionButtonText}>Morning Goal</Text>
          </TouchableOpacity>
        )}
        
        {morningKickoff && (
          <View style={styles.goalDisplay}>
            <Ionicons name="checkmark-circle" size={20} color="#4ecdc4" />
            <Text style={styles.goalText}>{morningKickoff}</Text>
          </View>
        )}

        {completedCount > 0 && !endOfDayReflection && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowEveningModal(true)}
          >
            <Ionicons name="moon" size={20} color="#6c5ce7" />
            <Text style={styles.actionButtonText}>End Reflection</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Timeline View */}
      <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
        {timeSlots.map((slot) => (
          <View key={slot.hour} style={styles.timeSlot}>
            <View style={styles.timeLabel}>
              <Text style={styles.timeText}>{slot.time}</Text>
            </View>
            <View style={styles.tasksContainer}>
              {slot.tasks.length === 0 ? (
                <View style={styles.emptySlot} />
              ) : (
                slot.tasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={[
                      styles.taskCard,
                      task.completed && styles.completedTask,
                      { borderLeftColor: getEnergyColor(task.energyLevel) }
                    ]}
                    onPress={() => toggleTask(task.id)}
                  >
                    <View style={styles.taskHeader}>
                      <View style={styles.taskCategory}>
                        <Ionicons 
                          name={getCategoryIcon(task.category) as any} 
                          size={16} 
                          color={getEnergyColor(task.energyLevel)} 
                        />
                        <Text style={styles.categoryText}>{task.category || 'general'}</Text>
                      </View>
                      <View style={[styles.energyIndicator, { backgroundColor: getEnergyColor(task.energyLevel) }]} />
                    </View>
                    <Text style={[styles.taskTitle, task.completed && styles.completedText]}>
                      {task.title}
                    </Text>
                    {task.estimatedDuration && (
                      <Text style={styles.durationText}>
                        {task.estimatedDuration} min
                      </Text>
                    )}
                    <View style={[styles.checkbox, task.completed && styles.checkedBox]}>
                      {task.completed && <Ionicons name="star" size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Morning Kickoff Modal */}
      <Modal visible={showMorningModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What's your #1 win for today?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Complete the project proposal"
              value={morningGoal}
              onChangeText={setMorningGoal}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowMorningModal(false)}
              >
                <Text style={styles.modalButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleMorningKickoff}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Set Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Evening Reflection Modal */}
      <Modal visible={showEveningModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How did your day go?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What did you accomplish? What are you grateful for?"
              value={eveningReflection}
              onChangeText={setEveningReflection}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowEveningModal(false)}
              >
                <Text style={styles.modalButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleEveningReflection}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Save Reflection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Celebration Modal */}
      <CelebrationModal
        visible={showCelebration}
        onClose={hideCelebration}
        message={celebrationMessage}
        achievement={celebrationAchievement || undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginLeft: 4,
  },
  progressRingContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  progressRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRingFill: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#4a80f5',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressRingInner: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 14,
    color: '#8b5a00',
    marginLeft: 6,
    fontWeight: '500',
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginLeft: 6,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  goalDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
  },
  goalText: {
    fontSize: 14,
    color: '#166534',
    marginLeft: 6,
    fontWeight: '500',
  },
  timelineContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeSlot: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeLabel: {
    width: 60,
    paddingTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tasksContainer: {
    flex: 1,
    marginLeft: 15,
  },
  emptySlot: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  energyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  checkbox: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonPrimary: {
    backgroundColor: '#4a80f5',
    borderColor: '#4a80f5',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  modalButtonPrimaryText: {
    color: '#fff',
  },
});
