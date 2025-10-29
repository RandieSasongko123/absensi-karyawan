import React from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';
import { Colors, globalStyles } from '../styles/global';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  style,
  ...props 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [globalStyles.button, globalStyles.buttonSecondary];
      case 'danger':
        return [globalStyles.button, globalStyles.buttonDanger];
      case 'outline':
        return [globalStyles.button, globalStyles.buttonOutline];
      default:
        return globalStyles.button;
    }
  };

  const getTextStyle = () => {
    const baseStyle = globalStyles.buttonText;
    
    if (variant === 'outline') {
      return [baseStyle, globalStyles.buttonOutlineText];
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && globalStyles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? Colors.primary : Colors.white} 
        />
      ) : (
        <Text style={getTextStyle()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;