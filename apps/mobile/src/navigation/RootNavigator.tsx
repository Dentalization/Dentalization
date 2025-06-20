import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import DentistNavigator from './DentistNavigator';
import AdminNavigator from './AdminNavigator';
import LoadingScreen from '../screens/shared/LoadingScreen';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  // Role-based navigation
  switch (userRole) {
    case 'patient':
      return <PatientNavigator />;
    case 'dentist':
      return <DentistNavigator />;
    case 'admin':
      return <AdminNavigator />;
    case 'clinic_staff':
      return <DentistNavigator />; // Clinic staff uses dentist interface
    default:
      return <AuthNavigator />;
  }
};

export default RootNavigator;
