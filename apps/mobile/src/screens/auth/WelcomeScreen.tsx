import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleRoleSelection = (role: 'patient' | 'dentist') => {
    // Navigate to Login screen with role parameter
    navigation.navigate('Login', { userType: role });
  };

  return (
    <View style={[{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20, 
      backgroundColor: '#F2F1F8' // lightBackground from DentalizationColors
    }]}>
      <View style={[{ 
        padding: 32, 
        borderRadius: 20, 
        alignItems: 'center', 
        width: '100%', 
        maxWidth: 350, 
        elevation: 8,
        shadowColor: '#483AA020',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        backgroundColor: '#FFFFFF' // white surface
      }]}>
        {/* Logo */}
        <View style={[{ 
          width: 100, 
          height: 100, 
          borderRadius: 50, 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: 32,
          backgroundColor: '#F2F1F8',
          padding: 8
        }]}>
          <Image 
            source={require('../../../assets/logo.png')}
            style={{ width: 84, height: 84 }}
            resizeMode="contain"
          />
        </View>
        
        <Text 
          style={[{ 
            fontSize: 28, 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: 12, 
            color: '#333333', // darkGrey from DentalizationColors
            lineHeight: 34
          }]}
        >
          Selamat Datang di Dentalization
        </Text>
        
        <Text 
          style={[{ 
            fontSize: 16, 
            textAlign: 'center', 
            marginBottom: 40, 
            color: '#6E6E6E', // midGrey from DentalizationColors
            lineHeight: 24,
            paddingHorizontal: 8
          }]}
        >
          Platform perawatan gigi pintar untuk Indonesia
        </Text>
        
        <View style={[{ width: '100%', gap: 16 }]}>
          <TouchableOpacity 
            style={[{ 
              backgroundColor: '#483AA0', // primary from DentalizationColors
              paddingVertical: 18, 
              paddingHorizontal: 32, 
              borderRadius: 12, 
              alignItems: 'center',
              elevation: 3,
              shadowColor: '#483AA0',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4
            }]}
            onPress={() => handleRoleSelection('patient')}
          >
            <Text style={[{ 
              color: '#FFFFFF', 
              fontWeight: '600', 
              fontSize: 16,
              letterSpacing: 0.5
            }]}>
              Masuk sebagai Pasien
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[{ 
              backgroundColor: 'transparent', 
              paddingVertical: 18, 
              paddingHorizontal: 32, 
              borderRadius: 12, 
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#483AA0' // primary from DentalizationColors
            }]}
            onPress={() => handleRoleSelection('dentist')}
          >
            <Text style={[{ 
              color: '#483AA0', // primary from DentalizationColors
              fontWeight: '600', 
              fontSize: 16,
              letterSpacing: 0.5
            }]}>
              Masuk sebagai Dokter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
