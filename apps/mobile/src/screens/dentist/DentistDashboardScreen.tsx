import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export const DentistDashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar dari akun?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Gagal keluar dari akun');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Dashboard Dokter
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
              Selamat datang, Dr. {user?.firstName}!
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Keluar</Text>
          </TouchableOpacity>
        </View>
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

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Pencarian Pasien
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
            Cari dan kelola data pasien
          </Text>
        </TouchableOpacity>

        {/* Development Helper - Remove in production */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#FEF3C7', borderColor: '#D97706', borderWidth: 1 }]}
          onPress={() => {
            Alert.alert(
              'Development Helper',
              'Pilih aksi untuk testing:',
              [
                { text: 'Batal', style: 'cancel' },
                { 
                  text: 'Reset & Test Login', 
                  onPress: async () => {
                    await logout();
                    Alert.alert('Info', 'Kembali ke halaman login untuk testing');
                  }
                },
                { 
                  text: 'Reset & Test Registration', 
                  onPress: async () => {
                    await logout();
                    Alert.alert('Info', 'Sekarang Anda bisa test flow registrasi');
                  }
                },
              ]
            );
          }}
        >
          <Text style={[styles.cardTitle, { color: '#D97706' }]}>
            🛠️ Development Helper
          </Text>
          <Text style={[styles.cardSubtitle, { color: '#92400E' }]}>
            Reset app untuk test login/registrasi (Remove in production)
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
