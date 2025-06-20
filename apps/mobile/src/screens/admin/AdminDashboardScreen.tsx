import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export const AdminDashboardScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Dashboard Admin
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
          Kelola sistem Dentalization
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Kelola Pengguna
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Dokter gigi dan pasien terdaftar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Statistik Platform
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Analitik penggunaan sistem
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Konfigurasi AI
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Pengaturan model AI dan dataset
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Sistem Pembayaran
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Kelola gateway dan transaksi
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
});
