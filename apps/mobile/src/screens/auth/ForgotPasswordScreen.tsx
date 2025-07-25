import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const ForgotPasswordScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Forgot Password Screen</Text>
      <Text>Coming Soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ForgotPasswordScreen;
