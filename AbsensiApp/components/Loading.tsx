import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Colors, globalStyles } from '../styles/global';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'large' 
}) => {
  return (
    <View style={globalStyles.loadingContainer}>
      <ActivityIndicator size={size} color={Colors.primary} />
      <Text style={[globalStyles.loadingText, { marginTop: 16 }]}>
        {message}
      </Text>
    </View>
  );
};

export default Loading;