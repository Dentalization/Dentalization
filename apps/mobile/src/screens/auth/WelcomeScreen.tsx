import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useTheme } from '../../contexts/ThemeContext';

const WelcomeScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
        {/* Placeholder for logo */}
        <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.logoText}>🦷</Text>
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Selamat Datang di Dentalization
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Platform perawatan gigi pintar untuk Indonesia
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            labelStyle={{ color: 'white' }}
          >
            Masuk sebagai Pasien
          </Button>
          
          <Button
            mode="outlined"
            style={[styles.button, { borderColor: theme.colors.primary }]}
            labelStyle={{ color: theme.colors.primary }}
          >
            Masuk sebagai Dokter
          </Button>
        </View>
      </Surface>
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
  surface: {
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 4,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 4,
  },
});

export default WelcomeScreen;
