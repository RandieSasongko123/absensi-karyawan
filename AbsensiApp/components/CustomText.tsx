import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { Fonts } from '../constants/Fonts';

interface CustomTextProps extends TextProps {
  variant?: 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
}

export default function CustomText({
  variant = 'regular',
  size = 'base',
  style,
  children,
  ...props
}: CustomTextProps) {
  return (
    <Text
      style={[
        styles.text,
        {
          fontFamily: Fonts[variant],
          fontSize: Fonts.size[size],
          lineHeight: Fonts.size[size] * Fonts.lineHeight.normal,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
});