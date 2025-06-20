import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export const DentistDashboardScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Dashboard Dokter
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
          Kelola praktik dan pasien Anda
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Jadwal Hari Ini
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            5 pasien terjadwal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Pasien Terdaftar
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Kelola data pasien Anda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            AI Diagnosis
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Bantuan AI untuk diagnosis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Laporan Keuangan
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Lihat pendapatan dan transaksi
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
