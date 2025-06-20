import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { DentistDashboardScreen } from '../screens/dentist/DentistDashboardScreen';
import LoadingScreen from '../screens/shared/LoadingScreen';

export type DentistTabParamList = {
  Dashboard: undefined;
  Patients: undefined;
  Appointments: undefined;
  Diagnostics: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DentistTabParamList>();

const DentistNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Patients':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Appointments':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Diagnostics':
              iconName = focused ? 'medical' : 'medical-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'grid-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#DC143C',
        tabBarInactiveTintColor: '#757575',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DentistDashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Patients" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Pasien' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Janji Temu' }}
      />
      <Tab.Screen 
        name="Diagnostics" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Diagnostik' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default DentistNavigator;
