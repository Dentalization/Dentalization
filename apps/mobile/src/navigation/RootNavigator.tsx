import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import DentistNavigator from './DentistNavigator';
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
    case UserRole.PATIENT:
      return <PatientNavigator />;
    case UserRole.DENTIST:
      return <DentistNavigator />;
    case UserRole.ADMIN:
      return <DentistNavigator />; // Admin uses dentist interface for now
    default:
      return <AuthNavigator />; // Redirect to auth for unknown roles
  }
};

export default RootNavigator;
