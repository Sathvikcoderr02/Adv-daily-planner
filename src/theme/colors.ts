export const colors = {
  // Primary gradient colors
  primary: {
    light: '#667eea',
    main: '#4a80f5',
    dark: '#3b6ce8',
    gradient: ['#667eea', '#764ba2'],
  },
  
  // Secondary gradient colors
  secondary: {
    light: '#f093fb',
    main: '#e879f9',
    dark: '#d946ef',
    gradient: ['#f093fb', '#f5576c'],
  },
  
  // Accent colors
  accent: {
    teal: '#4ecdc4',
    coral: '#ff6b6b',
    yellow: '#f9ca24',
    purple: '#6c5ce7',
    blue: '#45b7d1',
    pink: '#fd79a8',
  },
  
  // Neutral colors
  neutral: {
    white: '#ffffff',
    gray50: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
  },
  
  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Background gradients
  backgrounds: {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    success: ['#4facfe', '#00f2fe'],
    warning: ['#43e97b', '#38f9d7'],
    sunset: ['#fa709a', '#fee140'],
    ocean: ['#4facfe', '#00f2fe'],
    forest: ['#43e97b', '#38f9d7'],
    purple: ['#a8edea', '#fed6e3'],
  },
  
  // Text colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
    accent: '#4a80f5',
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
  },
};

export const gradients = {
  primary: ['#667eea', '#764ba2'] as const,
  secondary: ['#f093fb', '#f5576c'] as const,
  success: ['#4facfe', '#00f2fe'] as const,
  warning: ['#43e97b', '#38f9d7'] as const,
  sunset: ['#fa709a', '#fee140'] as const,
  ocean: ['#4facfe', '#00f2fe'] as const,
  forest: ['#43e97b', '#38f9d7'] as const,
  purple: ['#a8edea', '#fed6e3'] as const,
  calm: ['#667eea', '#764ba2', '#f093fb'] as const,
  energy: ['#ff6b6b', '#f9ca24', '#4ecdc4'] as const,
};