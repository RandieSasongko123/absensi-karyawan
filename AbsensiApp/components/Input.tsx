import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors, globalStyles } from '../styles/global';

interface InputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  containerStyle,
  secureTextEntry,
  ...props 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={globalStyles.inputLabel}>
          {label}
        </Text>
      )}
      
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[
            globalStyles.input,
            error && { borderColor: Colors.danger, borderWidth: 2 }
          ]}
          placeholderTextColor={Colors.gray}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            }}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color={Colors.gray} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={globalStyles.inputErrorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;