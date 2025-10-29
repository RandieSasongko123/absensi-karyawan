import { StyleSheet } from 'react-native';
import { Fonts } from './Fonts';

export const GlobalStyles = StyleSheet.create({
  // Text Styles
  textLight: {
    fontFamily: Fonts.light,
    fontSize: Fonts.size.base,
    color: '#000',
  },
  textRegular: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.base,
    color: '#000',
  },
  textMedium: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.base,
    color: '#000',
  },
  textSemiBold: {
    fontFamily: Fonts.semiBold,
    fontSize: Fonts.size.base,
    color: '#000',
  },
  textBold: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.base,
    color: '#000',
  },

  // Heading Styles
  heading1: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size['3xl'],
    color: '#000',
    lineHeight: Fonts.size['3xl'] * Fonts.lineHeight.tight,
  },
  heading2: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size['2xl'],
    color: '#000',
    lineHeight: Fonts.size['2xl'] * Fonts.lineHeight.tight,
  },
  heading3: {
    fontFamily: Fonts.semiBold,
    fontSize: Fonts.size.xl,
    color: '#000',
    lineHeight: Fonts.size.xl * Fonts.lineHeight.tight,
  },

  // Body Text Styles
  bodyLarge: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.lg,
    color: '#000',
    lineHeight: Fonts.size.lg * Fonts.lineHeight.normal,
  },
  bodyBase: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.base,
    color: '#000',
    lineHeight: Fonts.size.base * Fonts.lineHeight.normal,
  },
  bodySmall: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.sm,
    color: '#666',
    lineHeight: Fonts.size.sm * Fonts.lineHeight.normal,
  },
  bodyXSmall: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.xs,
    color: '#666',
    lineHeight: Fonts.size.xs * Fonts.lineHeight.normal,
  },
});