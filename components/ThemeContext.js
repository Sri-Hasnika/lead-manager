import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

const lightTheme = {
  primary: '#3b82f6',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  headerBg: '#ffffff',
  sidebarBg: '#ffffff',
  inputBg: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  buttonPrimary: '#3b82f6',
  buttonSecondary: '#f1f5f9',
  buttonText: '#ffffff',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
};

const darkTheme = {
  primary: '#60a5fa',
  secondary: '#94a3b8',
  background: '#0f172a',
  surface: '#1e293b',
  headerBg: '#1e293b',
  sidebarBg: '#1e293b',
  inputBg: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  buttonPrimary: '#60a5fa',
  buttonSecondary: '#334155',
  buttonText: '#ffffff',
  error: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 