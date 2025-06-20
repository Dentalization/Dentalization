import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { PatientDashboardScreen } from '../screens/patient/PatientDashboardScreen';
import LoadingScreen from '../screens/shared/LoadingScreen';

export type PatientTabParamList = {
  Home: undefined;
  Appointments: undefined;
  AIChecker: undefined;
  Health: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<PatientTabParamList>();

const PatientNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Appointments':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'AIChecker':
              iconName = focused ? 'scan' : 'scan-outline';
              break;
            case 'Health':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
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
        name="Home" 
        component={PatientDashboardScreen}
        options={{ tabBarLabel: 'Beranda' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Janji Temu' }}
      />
      <Tab.Screen 
        name="AIChecker" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Cek Gigi AI' }}
      />
      <Tab.Screen 
        name="Health" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Kesehatan' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={LoadingScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default PatientNavigator;
