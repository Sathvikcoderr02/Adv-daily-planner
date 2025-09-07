export const motivationalMessages = {
  taskCompleted: [
    "🎉 Amazing! You're crushing it!",
    "✨ Fantastic work! Keep the momentum going!",
    "🚀 You're on fire today!",
    "💪 That's the spirit! One step closer to your goals!",
    "🌟 Outstanding! You're making progress!",
    "🔥 You're unstoppable!",
    "⭐ Great job! You're building great habits!",
    "🎯 Perfect! You're staying focused!",
    "💎 Excellent work! You're worth it!",
    "🌈 Wonderful! You're creating positive change!",
  ],
  
  firstTask: [
    "🎊 Congratulations! You've started your journey!",
    "🌟 First task done! You're officially productive today!",
    "🚀 Great start! The hardest part is beginning!",
    "💫 You did it! Now you're unstoppable!",
    "🎉 Welcome to productivity! You're amazing!",
  ],
  
  streakMessages: [
    "🔥 {count} day streak! You're building an empire!",
    "⚡ {count} days strong! Consistency is your superpower!",
    "💎 {count} days in a row! You're unstoppable!",
    "🌟 {count} day streak! You're creating magic!",
    "🚀 {count} days of excellence! You're a legend!",
  ],
  
  dailyGoals: [
    "🎯 Today's mission: Make progress, not perfection!",
    "💪 Your future self will thank you for today's effort!",
    "✨ Every task completed is a step toward your dreams!",
    "🌟 You have the power to make today amazing!",
    "🚀 Small steps lead to big victories!",
    "💎 You're capable of more than you know!",
    "🔥 Turn your goals into achievements today!",
    "⭐ Success is the sum of small efforts repeated!",
  ],
  
  encouragement: [
    "💪 You've got this! Believe in yourself!",
    "🌟 Every expert was once a beginner!",
    "🚀 Progress, not perfection!",
    "✨ You're stronger than you think!",
    "💎 Challenges make you grow!",
    "🔥 Your potential is limitless!",
    "⭐ Today is your day to shine!",
    "🌈 Great things take time!",
  ],
  
  achievements: {
    firstWeek: "🏆 Week Warrior! You've been consistent for 7 days!",
    firstMonth: "👑 Monthly Master! 30 days of excellence!",
    taskMaster: "🎯 Task Master! You've completed 50 tasks!",
    earlyBird: "🐦 Early Bird! You completed your first task before 9 AM!",
    nightOwl: "🦉 Night Owl! You're productive even at night!",
    weekendWarrior: "⚔️ Weekend Warrior! You work hard even on weekends!",
    streakKeeper: "🔥 Streak Keeper! You've maintained a 10-day streak!",
    goalCrusher: "💥 Goal Crusher! You've achieved your daily goal!",
  }
};

export const getRandomMessage = (category: keyof typeof motivationalMessages): string => {
  const messages = motivationalMessages[category];
  if (Array.isArray(messages)) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return messages;
};

export const getStreakMessage = (count: number): string => {
  const messages = motivationalMessages.streakMessages;
  const message = messages[Math.floor(Math.random() * messages.length)];
  return message.replace('{count}', count.toString());
};

export const getAchievementMessage = (achievement: keyof typeof motivationalMessages.achievements): string => {
  return motivationalMessages.achievements[achievement];
};