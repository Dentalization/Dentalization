import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import LoadingScreen from '../screens/shared/LoadingScreen';

export type AdminDrawerParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  ClinicManagement: undefined;
  Analytics: undefined;
  SystemSettings: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

const AdminNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#DC143C',
        drawerInactiveTintColor: '#757575',
        headerStyle: {
          backgroundColor: '#DC143C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard Admin',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="UserManagement" 
        component={LoadingScreen}
        options={{
          title: 'Kelola Pengguna',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ClinicManagement" 
        component={LoadingScreen}
        options={{
          title: 'Kelola Klinik',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Analytics" 
        component={LoadingScreen}
        options={{
          title: 'Analitik',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="SystemSettings" 
        component={LoadingScreen}
        options={{
          title: 'Pengaturan Sistem',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={LoadingScreen}
        options={{
          title: 'Profil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;
