import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color palette
export const Colors = {
  // Primary colors
  primary: '#3498db',
  primaryDark: '#2980b9',
  primaryLight: '#5dade2',

  // Secondary colors
  secondary: '#2ecc71',
  secondaryDark: '#27ae60',
  secondaryLight: '#58d68d',

  // Status colors
  success: '#28a745',
  successDark: '#218838',
  successLight: '#71dd8a',

  fail: '#dc3545',
  failDark: '#b02a37',
  failLight: '#f28b94',

  danger: '#e74c3c',
  warning: '#f39c12',
  warningDark: '#d68910',
  warningLight: '#f8c471',

  info: '#17a2b8',
  infoDark: '#117a8b',
  infoLight: '#63cdda',

  // Neutral colors
  dark: '#2c3e50',
  light: '#ecf0f1',

  gray: '#95a5a6',
  grayDark: '#7f8c8d',
  grayLight: '#bdc3c7',

  neutral: '#adb5bd',
  neutralDark: '#6c757d',
  neutralLight: '#dee2e6',

  // Base colors
  white: '#ffffff',
  black: '#000000',

  // Background & border
  background: '#f8f9fa',
  backgroundDark: '#e9ecef',
  border: '#e9ecef',

  // Accent / Highlight
  highlight: '#ffe066',
  highlightDark: '#e6b800',
  highlightLight: '#fff3bf',
};


// Global Styles yang lebih sederhana
export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },

  containerFluid: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    // Shadow untuk iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow untuk Android
    elevation: 3,
  },

  // Buttons
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    // Shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonDanger: {
    backgroundColor: Colors.danger,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonOutlineText: {
    color: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.grayLight,
  },

  // Inputs
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    fontSize: 16,
    color: Colors.dark,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  inputErrorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },

  // Text
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.dark,
    marginVertical: 4,
  },
  textSmall: {
    fontSize: 14,
    color: Colors.grayDark,
  },
  textCenter: {
    textAlign: 'center',
  },

  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});