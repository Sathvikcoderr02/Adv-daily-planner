import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '../../theme/colors';

const { width } = Dimensions.get('window');

const priorities = [
  { id: 'career', label: 'Career Growth', icon: 'briefcase-outline', color: colors.accent.blue },
  { id: 'health', label: 'Health & Fitness', icon: 'heart-outline', color: colors.accent.coral },
  { id: 'relationships', label: 'Relationships', icon: 'people-outline', color: colors.accent.teal },
  { id: 'learning', label: 'Learning', icon: 'book-outline', color: colors.accent.blue },
  { id: 'creativity', label: 'Creativity', icon: 'color-palette-outline', color: colors.accent.yellow },
  { id: 'finance', label: 'Financial Goals', icon: 'trending-up-outline', color: colors.accent.purple },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handlePriorityToggle = (priorityId: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priorityId) 
        ? prev.filter(id => id !== priorityId)
        : [...prev, priorityId]
    );
  };

  const handleNext = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
    setCurrentStep(1);
  };

  const handleGetStarted = () => {
    completeOnboarding();
  };

  const renderWelcomeStep = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="sparkles" size={80} color="#fff" />
      </View>
      <Text style={styles.title}>Reclaim 2 Hours Every Day</Text>
      <Text style={styles.subtitle}>
        End your day with clarity, not chaos. Easin helps you design your perfect day with smart planning that actually works.
      </Text>
      <View style={styles.benefitsContainer}>
        <View style={styles.benefit}>
          <Ionicons name="checkmark-circle" size={20} color="#4ecdc4" />
          <Text style={styles.benefitText}>Smart time blocking</Text>
        </View>
        <View style={styles.benefit}>
          <Ionicons name="checkmark-circle" size={20} color="#4ecdc4" />
          <Text style={styles.benefitText}>Energy-based planning</Text>
        </View>
        <View style={styles.benefit}>
          <Ionicons name="checkmark-circle" size={20} color="#4ecdc4" />
          <Text style={styles.benefitText}>Progress tracking</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Let's Personalize Your Plan</Text>
        <Ionicons name="arrow-forward" size={20} color="#4a80f5" style={styles.buttonIcon} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPrioritiesStep = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>What matters most to you?</Text>
      <Text style={styles.stepSubtitle}>Select your top 3 priorities to personalize your daily planning</Text>
      
      <ScrollView style={styles.prioritiesContainer} showsVerticalScrollIndicator={false}>
        {priorities.map((priority) => (
          <TouchableOpacity
            key={priority.id}
            style={[
              styles.priorityCard,
              selectedPriorities.includes(priority.id) && styles.selectedPriorityCard
            ]}
            onPress={() => handlePriorityToggle(priority.id)}
          >
            <View style={[styles.priorityIcon, { backgroundColor: priority.color }]}>
              <Ionicons name={priority.icon as any} size={24} color="#fff" />
            </View>
            <Text style={[
              styles.priorityLabel,
              selectedPriorities.includes(priority.id) && styles.selectedPriorityLabel
            ]}>
              {priority.label}
            </Text>
            {selectedPriorities.includes(priority.id) && (
              <Ionicons name="checkmark-circle" size={24} color="#4ecdc4" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.button, 
          selectedPriorities.length === 0 && styles.buttonDisabled
        ]} 
        onPress={handleGetStarted}
        disabled={selectedPriorities.length === 0}
      >
        <Text style={styles.buttonText}>Start My Perfect Day</Text>
        <Ionicons name="rocket" size={20} color="#4a80f5" style={styles.buttonIcon} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={gradients.calm}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep + 1) * 50}%` }]} />
      </View>
      {currentStep === 0 ? renderWelcomeStep() : renderPrioritiesStep()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  benefitsContainer: {
    marginBottom: 50,
    width: '100%',
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  benefitText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    fontWeight: '500',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  prioritiesContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 30,
  },
  priorityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPriorityCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#4ecdc4',
  },
  priorityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  priorityLabel: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  selectedPriorityLabel: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  buttonText: {
    fontSize: 18,
    color: '#4a80f5',
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
