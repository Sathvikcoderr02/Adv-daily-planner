import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert, Modal, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, gradients } from '../../theme/colors';
import CelebrationModal from '../../components/CelebrationModal';

const categories = [
  { id: 'work', label: 'Work', icon: 'briefcase', color: colors.accent.blue },
  { id: 'health', label: 'Health', icon: 'heart', color: colors.accent.coral },
  { id: 'personal', label: 'Personal', icon: 'person', color: colors.accent.teal },
  { id: 'learning', label: 'Learning', icon: 'book', color: colors.accent.blue },
  { id: 'creativity', label: 'Creativity', icon: 'color-palette', color: colors.accent.yellow },
  { id: 'finance', label: 'Finance', icon: 'trending-up', color: colors.accent.purple },
];

const energyLevels = [
  { id: 'high', label: 'High Energy', icon: 'flash', color: colors.accent.teal },
  { id: 'medium', label: 'Medium Energy', icon: 'battery-half', color: colors.accent.yellow },
  { id: 'low', label: 'Low Energy', icon: 'battery-dead', color: colors.accent.coral },
];

const priorities = [
  { id: 'high', label: 'High Priority', icon: 'arrow-up', color: colors.accent.coral },
  { id: 'medium', label: 'Medium Priority', icon: 'remove', color: colors.accent.yellow },
  { id: 'low', label: 'Low Priority', icon: 'arrow-down', color: colors.accent.teal },
];

export default function ToDoScreen() {
  const { 
    tasks, 
    addTask, 
    deleteTask, 
    toggleTask,
    showCelebration,
    celebrationMessage,
    celebrationAchievement,
    hideCelebration
  } = useApp();
  const [input, setInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTask = () => {
    if (input.trim().length === 0) return;
    
    // Combine date and time
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(selectedTime.getHours());
    combinedDateTime.setMinutes(selectedTime.getMinutes());
    
    addTask({
      title: input.trim(),
      dueDate: combinedDateTime,
      category: selectedCategory as any,
      energyLevel: selectedEnergy as any,
      priority: selectedPriority as any,
      estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
      description: description.trim() || undefined,
    });
    
    // Reset form
    setInput('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setSelectedCategory('');
    setSelectedEnergy('');
    setSelectedPriority('');
    setEstimatedDuration('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleQuickAdd = () => {
    if (input.trim().length === 0) return;
    
    // Combine date and time for quick add
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(selectedTime.getHours());
    combinedDateTime.setMinutes(selectedTime.getMinutes());
    
    addTask({
      title: input.trim(),
      dueDate: combinedDateTime,
    });
    
    setInput('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
      ]
    );
  };

  const onDateChange = (event: any, date?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const getCategoryIcon = (category?: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : 'ellipse';
  };

  const getCategoryColor = (category?: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : '#ddd';
  };

  const getEnergyColor = (energyLevel?: string) => {
    const energy = energyLevels.find(e => e.id === energyLevel);
    return energy ? energy.color : '#ddd';
  };

  const getPriorityColor = (priority?: string) => {
    const pri = priorities.find(p => p.id === priority);
    return pri ? pri.color : '#ddd';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.secondary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.title}>To-Do List</Text>
        <Text style={styles.subtitle}>Smart task management with energy-based planning</Text>
      </LinearGradient>

      {/* Quick Add Section */}
      <View style={styles.quickAddContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.quickInput}
            placeholder="What needs to be done?"
            value={input}
            onChangeText={setInput}
            multiline
          />
        </View>
        
        <View style={styles.timeRow}>
          <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#4a80f5" />
            <Text style={styles.timeButtonText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={18} color="#4a80f5" />
            <Text style={styles.timeButtonText}>
              {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.quickAddButton, !input.trim() && styles.addButtonDisabled]} 
            onPress={handleQuickAdd}
            disabled={!input.trim()}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.quickAddText}>Quick Add</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.detailedAddButton, !input.trim() && styles.addButtonDisabled]} 
            onPress={() => setShowAddModal(true)}
            disabled={!input.trim()}
          >
            <Ionicons name="settings-outline" size={20} color="#4a80f5" />
            <Text style={styles.detailedAddText}>Detailed</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="list-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Text style={styles.emptySubtext}>Add your first task to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.taskItem, item.completed && styles.completedTaskItem]}>
              <TouchableOpacity 
                style={styles.taskContent}
                onPress={() => toggleTask(item.id)}
              >
                <View style={[styles.checkbox, item.completed && styles.checkedBox]}>
                  {item.completed && <Ionicons name="star" size={16} color="#fff" />}
                </View>
                
                <View style={styles.taskInfo}>
                  <View style={styles.taskHeader}>
                    <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                      {item.title}
                    </Text>
                    <View style={styles.taskBadges}>
                      {item.category && (
                        <View style={[styles.badge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
                          <Ionicons 
                            name={getCategoryIcon(item.category) as any} 
                            size={12} 
                            color={getCategoryColor(item.category)} 
                          />
                          <Text style={[styles.badgeText, { color: getCategoryColor(item.category) }]}>
                            {item.category}
                          </Text>
                        </View>
                      )}
                      {item.energyLevel && (
                        <View style={[styles.badge, { backgroundColor: getEnergyColor(item.energyLevel) + '20' }]}>
                          <View style={[styles.energyDot, { backgroundColor: getEnergyColor(item.energyLevel) }]} />
                          <Text style={[styles.badgeText, { color: getEnergyColor(item.energyLevel) }]}>
                            {item.energyLevel}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {item.description && (
                    <Text style={styles.taskDescription}>{item.description}</Text>
                  )}
                  
                  <View style={styles.taskMeta}>
                    {item.dueDate && (
                      <Text style={styles.taskDate}>
                        {new Date(item.dueDate).toLocaleString()}
                      </Text>
                    )}
                    {item.estimatedDuration && (
                      <Text style={styles.durationText}>
                        {item.estimatedDuration} min
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detailed Add Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Detailed Task</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.modalInput}
                placeholder="Task title"
                value={input}
                onChangeText={setInput}
              />
              
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.optionsContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.optionButton,
                      selectedCategory === category.id && styles.selectedOption
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={20} 
                      color={selectedCategory === category.id ? '#fff' : category.color} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedCategory === category.id && styles.selectedOptionText
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>Energy Level</Text>
              <View style={styles.optionsContainer}>
                {energyLevels.map((energy) => (
                  <TouchableOpacity
                    key={energy.id}
                    style={[
                      styles.optionButton,
                      selectedEnergy === energy.id && styles.selectedOption
                    ]}
                    onPress={() => setSelectedEnergy(energy.id)}
                  >
                    <Ionicons 
                      name={energy.icon as any} 
                      size={20} 
                      color={selectedEnergy === energy.id ? '#fff' : energy.color} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedEnergy === energy.id && styles.selectedOptionText
                    ]}>
                      {energy.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.optionsContainer}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.id}
                    style={[
                      styles.optionButton,
                      selectedPriority === priority.id && styles.selectedOption
                    ]}
                    onPress={() => setSelectedPriority(priority.id)}
                  >
                    <Ionicons 
                      name={priority.icon as any} 
                      size={20} 
                      color={selectedPriority === priority.id ? '#fff' : priority.color} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedPriority === priority.id && styles.selectedOptionText
                    ]}>
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>Date & Time</Text>
              <View style={styles.modalTimeRow}>
                <TouchableOpacity 
                  style={styles.modalTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#4a80f5" />
                  <Text style={styles.modalTimeButtonText}>
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#4a80f5" />
                  <Text style={styles.modalTimeButtonText}>
                    {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Estimated duration (minutes)"
                value={estimatedDuration}
                onChangeText={setEstimatedDuration}
                keyboardType="numeric"
              />
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddTask}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Add Task</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickAddContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    marginBottom: 30,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quickInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    justifyContent: 'center',
  },
  timeButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: '#4a80f5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  quickAddText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  detailedAddButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailedAddText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  addButtonDisabled: {
    backgroundColor: '#e5e7eb',
    borderColor: '#e5e7eb',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  taskItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTaskItem: {
    opacity: 0.7,
  },
  taskContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  energyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    marginTop: 8,
    marginRight: 8,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#4a80f5',
    borderColor: '#4a80f5',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  selectedOptionText: {
    color: '#fff',
  },
  modalTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
  },
  modalTimeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4a80f5',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
