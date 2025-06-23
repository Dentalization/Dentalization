import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, TextInput as RNTextInput } from 'react-native';
import { Text, TextInput, Button, Checkbox, IconButton } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;
type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Custom Password Input Component to avoid autofill issues
interface CustomPasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  style?: any;
  placeholder?: string;
}

const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  style,
  placeholder
}) => {
  const [isSecure, setIsSecure] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    setInternalValue(text);
    onChangeText(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={[styles.customPasswordContainer, style]}>
      <Text style={[styles.customPasswordLabel, error && styles.errorLabel]}>
        {label}
      </Text>
      <View style={[
        styles.customPasswordInputContainer, 
        error && styles.errorBorder,
        isFocused && styles.focusedBorder
      ]}>
        <RNTextInput
          style={[
            styles.customPasswordInput,
            // Force override any system styling
            {
              backgroundColor: 'transparent',
              color: '#333333',
            }
          ]}
          value={internalValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          placeholder={placeholder}
          placeholderTextColor="#666"
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          keyboardType="default"
          importantForAutofill="no"
          selectTextOnFocus={false}
          passwordRules=""
          spellCheck={false}
          clearButtonMode="never"
          enablesReturnKeyAutomatically={false}
          // Additional props to prevent autofill
          dataDetectorTypes="none"
          editable={true}
          multiline={false}
        />
        <IconButton
          icon={isSecure ? 'eye-off' : 'eye'}
          size={20}
          iconColor="#666"
          style={styles.eyeIconButton}
          onPress={() => setIsSecure(!isSecure)}
        />
      </View>
    </View>
  );
};

const LoginScreen: React.FC = () => {
  const route = useRoute<LoginScreenRouteProp>();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const userType = route.params?.userType;
  
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<LoginFormData>({
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Watch email for real-time feedback
  const emailValue = watch('email');

  // Function to get email validation status
  const getEmailValidationStatus = () => {
    if (!emailValue || emailValue.length === 0) return 'empty';
    if (errors.email) return 'invalid';
    if (emailValue.includes('@') && emailValue.includes('.') && emailValue.length > 5) return 'valid';
    return 'typing';
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'patient':
        return 'Pasien';
      case 'dentist':
        return 'Dokter';
      default:
        return 'Pengguna';
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      console.log('Login data:', {
        email: data.email,
        rememberMe: data.rememberMe
      });
      
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      
      // Navigation will be handled by RootNavigator based on user role
    } catch (error) {
      Alert.alert(
        'Login Gagal',
        error instanceof Error ? error.message : 'Email atau password tidak valid. Gunakan test@example.com dengan password "password" untuk testing.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register', { userType });
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Masuk sebagai {getUserTypeLabel()}</Text>
          <Text style={styles.subtitle}>
            Selamat datang kembali! Silakan masuk ke akun Anda.
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Email *</Text>
              {getEmailValidationStatus() === 'valid' && (
                <Text style={styles.validationIndicator}>✅</Text>
              )}
              {getEmailValidationStatus() === 'invalid' && (
                <Text style={styles.validationIndicator}>❌</Text>
              )}
              {getEmailValidationStatus() === 'typing' && emailValue.length > 0 && (
                <Text style={styles.validationIndicator}>⏳</Text>
              )}
            </View>
            <Controller
              control={control}
              rules={{
                required: 'Email harus diisi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Format email tidak valid. Contoh: nama@email.com',
                },
                validate: (value) => {
                  const trimmedValue = value.trim();
                  if (!trimmedValue) return 'Email harus diisi';
                  if (!trimmedValue.includes('@')) return 'Email harus mengandung tanda @';
                  if (!trimmedValue.includes('.')) return 'Email harus mengandung domain (contoh: .com)';
                  if (trimmedValue.indexOf('@') !== trimmedValue.lastIndexOf('@')) return 'Email hanya boleh mengandung satu tanda @';
                  if (trimmedValue.startsWith('@') || trimmedValue.endsWith('@')) return 'Tanda @ tidak boleh di awal atau akhir email';
                  if (trimmedValue.includes('..')) return 'Email tidak boleh mengandung titik berurutan';
                  
                  // Check for common typos
                  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'email.com'];
                  const parts = trimmedValue.split('@');
                  if (parts.length === 2) {
                    const domain = parts[1].toLowerCase();
                    if (domain === 'gmail' || domain === 'yahoo' || domain === 'hotmail' || domain === 'outlook') {
                      return `Apakah maksud Anda ${parts[0]}@${domain}.com?`;
                    }
                    if (domain.endsWith('.co') && !domain.endsWith('.com')) {
                      return `Apakah maksud Anda ${parts[0]}@${domain}m?`;
                    }
                  }
                  
                  return true;
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    placeholder="contoh: nama@gmail.com, user@email.com"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      // Trigger validation immediately for better UX
                      if (text.length > 0) {
                        trigger('email');
                      }
                    }}
                    error={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    style={styles.input}
                    outlineColor={
                      getEmailValidationStatus() === 'valid' ? '#22C55E' :
                      errors.email ? '#E53E3E' : '#D0D0D0'
                    }
                    activeOutlineColor={
                      getEmailValidationStatus() === 'valid' ? '#22C55E' :
                      errors.email ? '#E53E3E' : '#483AA0'
                    }
                  />
                  {/* Real-time validation hints */}
                  {emailValue.length > 0 && !errors.email && getEmailValidationStatus() !== 'valid' && (
                    <View style={styles.validationHints}>
                      <Text style={styles.hintText}>
                        {!emailValue.includes('@') && '• Tambahkan tanda @ '}
                        {emailValue.includes('@') && !emailValue.includes('.') && '• Tambahkan domain (contoh: .com, .id) '}
                        {emailValue.includes('@') && emailValue.includes('.') && emailValue.length < 6 && '• Email terlalu pendek '}
                        {emailValue.includes('@') && emailValue.endsWith('@') && '• Tambahkan domain setelah @ '}
                      </Text>
                    </View>
                  )}
                  {/* Suggestions for common email providers */}
                  {emailValue.includes('@') && !errors.email && getEmailValidationStatus() !== 'valid' && (
                    <View style={styles.emailSuggestions}>
                      <Text style={styles.suggestionText}>💡 Contoh: @gmail.com, @yahoo.com, @outlook.com</Text>
                    </View>
                  )}
                  {getEmailValidationStatus() === 'valid' && (
                    <Text style={styles.successText}>✅ Format email sudah benar</Text>
                  )}
                </View>
              )}
              name="email"
            />
            {errors.email && (
              <Text style={styles.errorText}>⚠️ {errors.email.message}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <Controller
              control={control}
              rules={{
                required: 'Password harus diisi',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomPasswordInput
                  label=""
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.password}
                  placeholder="Masukkan password"
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text style={styles.errorText}>⚠️ {errors.password.message}</Text>
            )}
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => onChange(!value)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.customCheckbox,
                    value && styles.customCheckboxChecked
                  ]}>
                    {value && (
                      <Text style={styles.checkboxCheckmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Ingat saya</Text>
                </TouchableOpacity>
              )}
              name="rememberMe"
            />

            <TouchableOpacity onPress={navigateToForgotPassword}>
              <Text style={styles.forgotPasswordText}>Lupa password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            buttonColor="#483AA0"
            contentStyle={styles.loginButtonContent}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>

          {/* Test Credentials Info */}
          <View style={styles.testInfo}>
            <Text style={styles.testInfoText}>Untuk testing:</Text>
            <Text style={styles.testCredentials}>Email: test@example.com</Text>
            <Text style={styles.testCredentials}>Password: password</Text>
            <Text style={styles.testCredentials}>Atau daftar akun baru</Text>
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Daftar sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F1F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 60,
    marginBottom: 20,
    alignSelf: 'flex-start',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#483AA0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#483AA0',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E6E',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#483AA0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  validationIndicator: {
    fontSize: 16,
    marginLeft: 8,
  },
  validationHints: {
    marginTop: 4,
    paddingHorizontal: 12,
  },
  hintText: {
    fontSize: 12,
    color: '#FFA500',
    fontStyle: 'italic',
  },
  emailSuggestions: {
    marginTop: 4,
    paddingHorizontal: 12,
  },
  suggestionText: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  },
  successText: {
    fontSize: 12,
    color: '#22C55E',
    marginTop: 4,
    paddingHorizontal: 12,
    fontWeight: '500',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#483AA0',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  customCheckboxChecked: {
    backgroundColor: '#483AA0',
    borderColor: '#483AA0',
  },
  checkboxCheckmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 0,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#483AA0',
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
    borderRadius: 12,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  testInfo: {
    backgroundColor: '#F2F1F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  testInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#483AA0',
    marginBottom: 8,
  },
  testCredentials: {
    fontSize: 12,
    color: '#6E6E6E',
    // Using default system font instead of monospace for better compatibility
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#6E6E6E',
  },
  registerLink: {
    fontSize: 14,
    color: '#483AA0',
    fontWeight: '600',
  },
  // Custom Password Input Styles
  customPasswordContainer: {
    marginBottom: 16,
  },
  customPasswordLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  errorLabel: {
    color: '#B71C1C',
  },
  customPasswordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    minHeight: 48,
  },
  errorBorder: {
    borderColor: '#B71C1C',
  },
  focusedBorder: {
    borderColor: '#483AA0',
    borderWidth: 2,
  },
  customPasswordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  eyeIconButton: {
    margin: 0,
  },
});

export default LoginScreen;
