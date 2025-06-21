import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, TextInput as RNTextInput, Modal } from 'react-native';
import { Text, TextInput, Button, Checkbox, ProgressBar, IconButton } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterScreenRouteProp = RouteProp<AuthStackParamList, 'Register'>;
type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

// Form data interfaces for different steps
interface BasicInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface PatientInfoData {
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface DentistInfoData {
  licenseNumber: string;
  specializations: string[];
  yearsOfExperience: string;
  education: string;
  university: string;
  graduationYear: string;
  clinicName: string;
  clinicAddress: string;
  verificationDocuments: string; // In real app, this would be file uploads
}

interface TermsData {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

type StepData = BasicInfoData | PatientInfoData | DentistInfoData | TermsData;

// Custom Password Input Component to avoid autofill issues
interface CustomPasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  style?: any;
  placeholder?: string;
}

// Custom Date Input Component to format DD/MM/YYYY
interface CustomDateInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  style?: any;
  placeholder?: string;
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  style,
  placeholder
}) => {
  const [internalValue, setInternalValue] = useState(value);
  
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const formatDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 8 digits (DDMMYYYY)
    const limited = cleaned.slice(0, 8);
    
    // Apply formatting
    let formatted = limited;
    if (limited.length >= 3) {
      formatted = limited.slice(0, 2) + '/' + limited.slice(2);
    }
    if (limited.length >= 5) {
      formatted = limited.slice(0, 2) + '/' + limited.slice(2, 4) + '/' + limited.slice(4);
    }
    
    return formatted;
  };

  const handleTextChange = (text: string) => {
    // Handle backspace and deletion
    if (text.length < internalValue.length) {
      // User is deleting, handle more naturally
      const newValue = formatDate(text);
      setInternalValue(newValue);
      onChangeText(newValue);
      return;
    }
    
    const formatted = formatDate(text);
    if (formatted.length <= 10) { // DD/MM/YYYY = 10 characters max
      setInternalValue(formatted);
      onChangeText(formatted);
    }
  };

  return (
    <View style={[styles.customPasswordContainer, style]}>
      <Text style={[styles.customPasswordLabel, error && styles.errorLabel]}>
        {label}
      </Text>
      <View style={[styles.customPasswordInputContainer, error && styles.errorBorder]}>
        <RNTextInput
          style={styles.customPasswordInput}
          value={internalValue}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={10}
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="off"
          textContentType="none"
          selectTextOnFocus={true}
        />
      </View>
    </View>
  );
};

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

const RegisterScreen: React.FC = () => {
  const route = useRoute<RegisterScreenRouteProp>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const userType = route.params?.userType || 'patient';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // Terms modal state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  
  // University modal state
  const [showUniversityModal, setShowUniversityModal] = useState(false);

  // Determine total steps based on user type
  const totalSteps = userType === 'dentist' ? 4 : 3; // Basic, Role-specific, Terms (+ extra for dentist)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>();

  const watchPassword = watch('password', '');

  // Populate form with existing data when step changes
  React.useEffect(() => {
    if (currentStep === 2 && userType === 'patient') {
      // Populate patient info step
      if (formData.dateOfBirth) setValue('dateOfBirth', formData.dateOfBirth);
      if (formData.gender) setValue('gender', formData.gender);
      if (formData.emergencyContactName) setValue('emergencyContactName', formData.emergencyContactName);
      if (formData.emergencyContactPhone) setValue('emergencyContactPhone', formData.emergencyContactPhone);
    }
  }, [currentStep, formData, setValue, userType]);

  const getUserTypeLabel = () => {
    return userType === 'patient' ? 'Pasien' : 'Dokter';
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Informasi Dasar';
      case 2:
        if (userType === 'patient') return 'Informasi Medis';
        return 'Informasi Profesional';
      case 3:
        if (userType === 'dentist') return 'Verifikasi Dokumen';
        return 'Syarat & Ketentuan';
      case 4:
        return 'Syarat & Ketentuan';
      default:
        return 'Registrasi';
    }
  };

  const validateStep = (data: any): boolean => {
    switch (currentStep) {
      case 1: // Basic Info
        if (!data.firstName || !data.lastName || !data.email || !data.password) {
          Alert.alert('Error', 'Semua field wajib diisi');
          return false;
        }
        if (data.password !== data.confirmPassword) {
          Alert.alert('Error', 'Password dan konfirmasi password tidak cocok');
          return false;
        }
        if (data.password.length < 6) {
          Alert.alert('Error', 'Password minimal 6 karakter');
          return false;
        }
        return true;
      
      case 2: // Role-specific info
        if (userType === 'patient') {
          const missingFields = [];
          if (!data.dateOfBirth) missingFields.push('Tanggal lahir');
          if (!data.gender) missingFields.push('Jenis kelamin');
          if (!data.emergencyContactName) missingFields.push('Nama kontak darurat');
          if (!data.emergencyContactPhone) missingFields.push('Nomor kontak darurat');
          
          if (missingFields.length > 0) {
            Alert.alert('Error', `Field berikut harus diisi: ${missingFields.join(', ')}`);
            return false;
          }
        } else {
          const missingFields = [];
          if (!data.licenseNumber) missingFields.push('Nomor lisensi');
          if (!data.yearsOfExperience) missingFields.push('Tahun pengalaman');
          if (!data.university) missingFields.push('Universitas asal');
          if (!data.graduationYear) missingFields.push('Tahun lulus');
          if (!data.clinicName) missingFields.push('Nama klinik/rumah sakit');
          if (!data.clinicAddress) missingFields.push('Alamat praktik');
          
          if (missingFields.length > 0) {
            Alert.alert('Error', `Field berikut harus diisi: ${missingFields.join(', ')}`);
            return false;
          }
        }
        return true;

      case 3: // Dentist verification or Terms
        if (userType === 'dentist') {
          if (!data.verificationDocuments) {
            Alert.alert('Error', 'Dokumen verifikasi harus dilengkapi');
            return false;
          }
        } else {
          if (!data.acceptTerms || !data.acceptPrivacy) {
            Alert.alert('Error', 'Anda harus menyetujui syarat dan ketentuan serta kebijakan privasi');
            return false;
          }
        }
        return true;

      case 4: // Terms for dentist
        if (!data.acceptTerms || !data.acceptPrivacy) {
          Alert.alert('Error', 'Anda harus menyetujui syarat dan ketentuan serta kebijakan privasi');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const onNextStep = async (data: any) => {
    if (!validateStep(data)) return;

    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (currentStep === totalSteps) {
      // Final step - submit registration
      await handleRegistration(updatedFormData);
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
      // Reset form but preserve the data for next step
      reset({});
    }
  };

  const handleRegistration = async (finalData: any) => {
    setIsLoading(true);
    
    try {
      console.log('📝 Starting registration process...');
      
      // Prepare registration data for API
      const registrationData = {
        email: finalData.email,
        password: finalData.password,
        firstName: finalData.firstName,
        lastName: finalData.lastName,
        role: userType as 'patient' | 'dentist',
        phone: finalData.phoneNumber,
        // Patient-specific fields
        ...(userType === 'patient' && {
          emergencyContactName: finalData.emergencyContactName,
          emergencyContactPhone: finalData.emergencyContactPhone,
          allergies: finalData.allergies,
          medicalHistory: finalData.medicalHistory,
        }),
        // Dentist-specific fields
        ...(userType === 'dentist' && {
          licenseNumber: finalData.licenseNumber,
          specializations: finalData.specializations || [],
          yearsOfExperience: parseInt(finalData.yearsOfExperience) || 0,
          university: finalData.university,
          graduationYear: parseInt(finalData.graduationYear) || new Date().getFullYear(),
          clinicName: finalData.clinicName,
          clinicAddress: finalData.clinicAddress,
          verificationDocuments: finalData.verificationDocuments,
        }),
      };

      // Use AuthContext register method (handles API call and auto-login)
      await register(registrationData);
      
      Alert.alert(
        'Registrasi Berhasil!',
        userType === 'dentist' 
          ? 'Akun dokter Anda telah dibuat. Tim kami akan memverifikasi dokumen Anda dalam 1-2 hari kerja.'
          : 'Selamat datang di Dentalization! Akun Anda telah berhasil dibuat.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will be handled by RootNavigator due to auth state change
              console.log('✅ Registration completed, navigating to dashboard...');
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi';
      
      Alert.alert(
        'Error Registrasi',
        errorMessage.includes('already exists') 
          ? 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
          : 'Terjadi kesalahan saat registrasi. Silakan coba lagi.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Reset form and populate with existing data for the previous step
      reset({});
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return userType === 'patient' ? renderPatientInfoStep() : renderDentistInfoStep();
      case 3:
        return userType === 'dentist' ? renderDentistVerificationStep() : renderTermsStep();
      case 4:
        return renderTermsStep();
      default:
        return null;
    }
  };

  const renderBasicInfoStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Silakan lengkapi informasi dasar Anda
      </Text>

      <Controller
        control={control}
        rules={{ required: 'Nama depan harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nama Depan *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.firstName}
            style={styles.input}
            outlineColor={errors.firstName ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.firstName ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="firstName"
        defaultValue={formData.firstName || ''}
      />
      {errors.firstName && (
        <Text style={styles.errorText}>{String(errors.firstName.message)}</Text>
      )}

      <Controller
        control={control}
        rules={{ required: 'Nama belakang harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nama Belakang *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.lastName}
            style={styles.input}
            outlineColor={errors.lastName ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.lastName ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="lastName"
        defaultValue={formData.lastName || ''}
      />
      {errors.lastName && (
        <Text style={styles.errorText}>{String(errors.lastName.message)}</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: 'Email harus diisi',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Format email tidak valid',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={errors.email ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.email ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="email"
        defaultValue={formData.email || ''}
      />
      {errors.email && (
        <Text style={styles.errorText}>{String(errors.email.message)}</Text>
      )}

      <Controller
        control={control}
        rules={{ required: 'Nomor telephone harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nomor Telephone *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.phoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor={errors.phoneNumber ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.phoneNumber ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="phoneNumber"
        defaultValue={formData.phoneNumber || ''}
      />
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{String(errors.phoneNumber.message)}</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: 'Password harus diisi',
          minLength: {
            value: 6,
            message: 'Password minimal 6 karakter',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomPasswordInput
            label="Password *"
            value={value}
            onChangeText={onChange}
            error={!!errors.password}
            placeholder="Masukkan password minimal 6 karakter"
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && (
        <Text style={styles.errorText}>{String(errors.password.message)}</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: 'Konfirmasi password harus diisi',
          validate: (value) => value === watchPassword || 'Password tidak cocok',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomPasswordInput
            label="Konfirmasi Password *"
            value={value}
            onChangeText={onChange}
            error={!!errors.confirmPassword}
            placeholder="Masukkan ulang password"
          />
        )}
        name="confirmPassword"
        defaultValue=""
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{String(errors.confirmPassword.message)}</Text>
      )}
    </View>
  );

  const renderPatientInfoStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Informasi medis untuk memberikan perawatan terbaik
      </Text>

      <Controller
        control={control}
        rules={{ required: 'Tanggal lahir harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomDateInput
            label="Tanggal Lahir (DD/MM/YYYY) *"
            value={value}
            onChangeText={onChange}
            error={!!errors.dateOfBirth}
            placeholder="25/12/1990"
          />
        )}
        name="dateOfBirth"
        defaultValue={formData.dateOfBirth || ''}
      />
      {errors.dateOfBirth && (
        <Text style={styles.errorText}>{String(errors.dateOfBirth.message)}</Text>
      )}

      <Text style={styles.sectionLabel}>Jenis Kelamin *</Text>
      <View style={styles.radioGroup}>
        {['male', 'female', 'other'].map((gender) => (
          <Controller
            key={gender}
            control={control}
            rules={{ required: 'Jenis kelamin harus dipilih' }}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => onChange(gender)}
              >
                <View style={[
                  styles.radioCircle,
                  value === gender && styles.radioSelected
                ]} />
                <Text style={styles.radioLabel}>
                  {gender === 'male' ? 'Laki-laki' : gender === 'female' ? 'Perempuan' : 'Lainnya'}
                </Text>
              </TouchableOpacity>
            )}
            name="gender"
            defaultValue={formData.gender || ''}
          />
        ))}
      </View>

      <Controller
        control={control}
        rules={{ required: 'Nama kontak darurat harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nama Kontak Darurat *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.emergencyContactName}
            style={styles.input}
            outlineColor={errors.emergencyContactName ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.emergencyContactName ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="emergencyContactName"
        defaultValue={formData.emergencyContactName || ''}
      />
      {errors.emergencyContactName && (
        <Text style={styles.errorText}>{String(errors.emergencyContactName.message)}</Text>
      )}

      <Controller
        control={control}
        rules={{ required: 'Nomor kontak darurat harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nomor Kontak Darurat *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.emergencyContactPhone}
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor={errors.emergencyContactPhone ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.emergencyContactPhone ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="emergencyContactPhone"
        defaultValue={formData.emergencyContactPhone || ''}
      />
      {errors.emergencyContactPhone && (
        <Text style={styles.errorText}>{String(errors.emergencyContactPhone.message)}</Text>
      )}
    </View>
  );

  const renderDentistInfoStep = () => {
    const indonesianUniversities = [
      'Universitas Indonesia (UI)',
      'Universitas Gadjah Mada (UGM)', 
      'Institut Teknologi Bandung (ITB)',
      'Universitas Airlangga (UNAIR)',
      'Universitas Padjadjaran (UNPAD)',
      'Universitas Diponegoro (UNDIP)',
      'Universitas Hasanuddin (UNHAS)',
      'Universitas Brawijaya (UB)',
      'Universitas Sebelas Maret (UNS)',
      'Universitas Sumatera Utara (USU)',
      'Universitas Andalas (UNAND)',
      'Universitas Sriwijaya (UNSRI)',
      'Universitas Lampung (UNILA)',
      'Universitas Jember (UNEJ)',
      'Universitas Udayana (UNUD)',
      'Universitas Sam Ratulangi (UNSRAT)',
      'Universitas Mulawarman (UNMUL)',
      'Universitas Riau (UNRI)',
      'Universitas Jambi (UNJA)',
      'Universitas Bengkulu (UNIB)',
      'Universitas Tanjungpura (UNTAN)',
      'Universitas Palangka Raya (UPR)',
      'Universitas Lambung Mangkurat (ULM)',
      'Universitas Tadulako (UNTAD)',
      'Universitas Halu Oleo (UHO)',
      'Universitas Cenderawasih (UNCEN)',
      'Universitas Papua (UNIPA)',
      'Universitas Trisakti',
      'Universitas Kristen Indonesia (UKI)',
      'Universitas Katolik Indonesia Atma Jaya',
      'Universitas Pelita Harapan (UPH)',
      'Universitas Bina Nusantara (BINUS)',
      'Universitas Tarumanagara (UNTAR)',
      'Lainnya'
    ];

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepDescription}>
          Informasi profesional untuk verifikasi kredensial
        </Text>

        {/* License Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nomor Lisensi Dokter *</Text>
          <Controller
            control={control}
            rules={{ required: 'Nomor lisensi harus diisi' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.licenseNumber}
                placeholder="Masukkan nomor lisensi dokter"
                style={styles.input}
                outlineColor={errors.licenseNumber ? '#E53E3E' : '#D0D0D0'}
                activeOutlineColor={errors.licenseNumber ? '#E53E3E' : '#483AA0'}
              />
            )}
            name="licenseNumber"
            defaultValue={formData.licenseNumber || ''}
          />
          {errors.licenseNumber && (
            <Text style={styles.errorText}>{String(errors.licenseNumber.message)}</Text>
          )}
        </View>

        {/* Years of Experience */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tahun Pengalaman *</Text>
          <Controller
            control={control}
            rules={{ required: 'Pengalaman harus diisi' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.yearsOfExperience}
                keyboardType="numeric"
                placeholder="Masukkan tahun pengalaman (contoh: 5)"
                style={styles.input}
                outlineColor={errors.yearsOfExperience ? '#E53E3E' : '#D0D0D0'}
                activeOutlineColor={errors.yearsOfExperience ? '#E53E3E' : '#483AA0'}
              />
            )}
            name="yearsOfExperience"
            defaultValue={formData.yearsOfExperience || ''}
          />
          {errors.yearsOfExperience && (
            <Text style={styles.errorText}>{String(errors.yearsOfExperience.message)}</Text>
          )}
        </View>

        {/* University Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Universitas Asal *</Text>
          <Controller
            control={control}
            rules={{ required: 'Universitas harus dipilih' }}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={[
                  styles.universitySelector,
                  errors.university && styles.errorBorder
                ]}
                onPress={() => setShowUniversityModal(true)}
              >
                <Text style={[
                  styles.universitySelectorText,
                  !value && styles.placeholderText
                ]}>
                  {value || 'Pilih universitas asal Anda'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            )}
            name="university"
            defaultValue={formData.university || ''}
          />
          {errors.university && (
            <Text style={styles.errorText}>{String(errors.university.message)}</Text>
          )}
        </View>

        {/* University Modal */}
        <Modal
          visible={showUniversityModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowUniversityModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Universitas</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowUniversityModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.universityList}>
              {indonesianUniversities.map((university, index) => (
                <Controller
                  key={index}
                  control={control}
                  render={({ field: { onChange } }) => (
                    <TouchableOpacity
                      style={styles.universityOption}
                      onPress={() => {
                        onChange(university);
                        setShowUniversityModal(false);
                      }}
                    >
                      <Text style={styles.universityOptionText}>{university}</Text>
                    </TouchableOpacity>
                  )}
                  name="university"
                />
              ))}
            </ScrollView>
          </View>
        </Modal>

        {/* Graduation Year */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tahun Lulus *</Text>
          <Controller
            control={control}
            rules={{ required: 'Tahun lulus harus diisi' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.graduationYear}
                keyboardType="numeric"
                placeholder="Contoh: 2018"
                style={styles.input}
                outlineColor={errors.graduationYear ? '#E53E3E' : '#D0D0D0'}
                activeOutlineColor={errors.graduationYear ? '#E53E3E' : '#483AA0'}
              />
            )}
            name="graduationYear"
            defaultValue={formData.graduationYear || ''}
          />
          {errors.graduationYear && (
            <Text style={styles.errorText}>{String(errors.graduationYear.message)}</Text>
          )}
        </View>

        <Text style={styles.sectionLabel}>Spesialisasi (pilih yang sesuai)</Text>
        <View style={styles.specializationContainer}>
          {[
            'Umum', 'Ortodonti', 'Konservasi', 'Bedah Mulut', 
            'Endodonti', 'Periodonti', 'Prosthodonti', 'Pedodonti'
          ].map((specialization) => (
            <Controller
              key={specialization}
              control={control}
              render={({ field: { onChange, value } }) => {
                const currentSpecs = value || [];
                const isSelected = currentSpecs.includes(specialization);
                
                return (
                  <TouchableOpacity
                    style={[
                      styles.specializationChip,
                      isSelected && styles.specializationChipSelected
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        onChange(currentSpecs.filter((s: string) => s !== specialization));
                      } else {
                        onChange([...currentSpecs, specialization]);
                      }
                    }}
                  >
                    <Text style={[
                      styles.specializationText,
                      isSelected && styles.specializationTextSelected
                    ]}>
                      {specialization}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              name="specializations"
              defaultValue={formData.specializations || []}
            />
          ))}
        </View>

        {/* Clinic Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nama Klinik/Rumah Sakit *</Text>
          <Controller
            control={control}
            rules={{ required: 'Nama klinik/rumah sakit harus diisi' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.clinicName}
                placeholder="Contoh: RS Jakarta, Klinik Sehat"
                style={styles.input}
                outlineColor={errors.clinicName ? '#E53E3E' : '#D0D0D0'}
                activeOutlineColor={errors.clinicName ? '#E53E3E' : '#483AA0'}
              />
            )}
            name="clinicName"
            defaultValue={formData.clinicName || ''}
          />
          {errors.clinicName && (
            <Text style={styles.errorText}>{String(errors.clinicName.message)}</Text>
          )}
        </View>

        {/* Clinic Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Alamat Praktik *</Text>
          <Controller
            control={control}
            rules={{ required: 'Alamat praktik harus diisi' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.clinicAddress}
                multiline
                numberOfLines={3}
                placeholder="Masukkan alamat lengkap tempat praktik"
                style={styles.input}
                outlineColor={errors.clinicAddress ? '#E53E3E' : '#D0D0D0'}
                activeOutlineColor={errors.clinicAddress ? '#E53E3E' : '#483AA0'}
              />
            )}
            name="clinicAddress"
            defaultValue={formData.clinicAddress || ''}
          />
          {errors.clinicAddress && (
            <Text style={styles.errorText}>{String(errors.clinicAddress.message)}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderDentistVerificationStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Upload dokumen untuk verifikasi kredensial Anda
      </Text>

      <View style={styles.documentSection}>
        <Text style={styles.documentTitle}>Dokumen yang Diperlukan:</Text>
        <Text style={styles.documentItem}>• Sertifikat/Ijazah Kedokteran Gigi</Text>
        <Text style={styles.documentItem}>• Surat Tanda Registrasi (STR)</Text>
        <Text style={styles.documentItem}>• Surat Izin Praktik (SIP)</Text>
        <Text style={styles.documentItem}>• KTP/Identitas</Text>
      </View>

      <Controller
        control={control}
        rules={{ required: 'Dokumen verifikasi harus dilengkapi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => {
                // In real app, this would open file picker
                onChange('mock_documents_uploaded');
                Alert.alert('Info', 'Dalam aplikasi nyata, ini akan membuka file picker untuk upload dokumen.');
              }}
            >
              <Text style={styles.uploadButtonText}>
                {value ? '✓ Dokumen Telah Dipilih' : '📁 Pilih Dokumen'}
              </Text>
            </TouchableOpacity>
            
            {value && (
              <Text style={styles.uploadSuccess}>
                Dokumen berhasil dipilih. Tim kami akan memverifikasi dalam 1-2 hari kerja.
              </Text>
            )}
          </View>
        )}
        name="verificationDocuments"
        defaultValue={formData.verificationDocuments || ''}
      />
      {errors.verificationDocuments && (
        <Text style={styles.errorText}>{String(errors.verificationDocuments.message)}</Text>
      )}

      <View style={styles.verificationNote}>
        <Text style={styles.verificationNoteTitle}>Catatan Verifikasi:</Text>
        <Text style={styles.verificationNoteText}>
          • Dokumen akan diverifikasi oleh tim ahli kami{'\n'}
          • Proses verifikasi memakan waktu 1-2 hari kerja{'\n'}
          • Anda akan mendapat notifikasi via email dan aplikasi{'\n'}
          • Setelah terverifikasi, Anda dapat mulai menerima pasien
        </Text>
      </View>
    </View>
  );

  const renderTermsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Terakhir, mohon baca dan setujui syarat dan ketentuan
      </Text>

      {/* Detailed explanation section */}
      <View style={styles.termsExplanation}>
        <Text style={styles.termsExplanationTitle}>
          Perjanjian Penggunaan Layanan
        </Text>
        <Text style={styles.termsExplanationText}>
          Sebelum melanjutkan pendaftaran, Anda HARUS membaca dokumen PDF 
          Syarat & Ketentuan dan Kebijakan Privasi secara lengkap. 
          Setelah membaca hingga akhir dokumen, baru Anda dapat mencentang 
          kotak persetujuan di bawah ini.
        </Text>
      </View>

      <View style={styles.termsSection}>
        {/* Terms & Conditions PDF Section */}
        <View style={styles.pdfSection}>
          <Text style={styles.pdfSectionTitle}>
            Syarat dan Ketentuan
          </Text>
          <TouchableOpacity 
            style={styles.pdfButton}
            onPress={() => setShowTermsModal(true)}
          >
            <Text style={styles.pdfButtonText}>
              Buka & Baca Syarat dan Ketentuan
            </Text>
          </TouchableOpacity>
          {hasReadTerms && (
            <View style={styles.readIndicator}>
              <Text style={styles.readIndicatorText}>
                Dokumen telah dibaca hingga selesai
              </Text>
            </View>
          )}
        </View>

        <Controller
          control={control}
          rules={{ required: 'Anda harus menyetujui syarat dan ketentuan' }}
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity 
              style={[
                styles.customCheckboxContainer,
                !hasReadTerms && styles.disabledCheckboxContainer
              ]}
              onPress={() => hasReadTerms && onChange(!value)}
              disabled={!hasReadTerms}
              accessible={true}
              accessibilityRole="checkbox"
              accessibilityState={{ 
                checked: !!value,
                disabled: !hasReadTerms 
              }}
              accessibilityLabel="Menyetujui syarat dan ketentuan penggunaan layanan"
            >
              <View style={[
                styles.customCheckbox,
                value && styles.customCheckboxChecked,
                !hasReadTerms && styles.disabledCheckbox
              ]}>
                {value && <Text style={styles.checkmarkText}>✓</Text>}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={[
                  styles.checkboxLabel,
                  !hasReadTerms && styles.disabledText
                ]}>
                  Saya telah membaca, memahami, dan menyetujui{' '}
                  <Text style={styles.linkText}>Syarat dan Ketentuan</Text> penggunaan 
                  layanan Dentalization *
                </Text>
                <Text style={[
                  styles.checkboxDescription,
                  !hasReadTerms && styles.disabledText
                ]}>
                  {!hasReadTerms 
                    ? "Anda harus membaca dokumen PDF terlebih dahulu"
                    : "Termasuk aturan penggunaan aplikasi, hak dan kewajiban pengguna, serta ketentuan pembatalan layanan."
                  }
                </Text>
              </View>
            </TouchableOpacity>
          )}
          name="acceptTerms"
          defaultValue={formData.acceptTerms || false}
        />
        {errors.acceptTerms && (
          <Text style={styles.errorText}>{String(errors.acceptTerms.message)}</Text>
        )}
      </View>

      <View style={styles.termsSection}>
        {/* Privacy Policy PDF Section */}
        <View style={styles.pdfSection}>
          <Text style={styles.pdfSectionTitle}>
            Kebijakan Privasi
          </Text>
          <TouchableOpacity 
            style={styles.pdfButton}
            onPress={() => setShowPrivacyModal(true)}
          >
            <Text style={styles.pdfButtonText}>
              Baca Kebijakan Privasi
            </Text>
          </TouchableOpacity>
          {hasReadPrivacy && (
            <View style={styles.readIndicator}>
              <Text style={styles.readIndicatorText}>
                Dokumen telah dibaca hingga selesai
              </Text>
            </View>
          )}
        </View>

        <Controller
          control={control}
          rules={{ required: 'Anda harus menyetujui kebijakan privasi' }}
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity 
              style={[
                styles.customCheckboxContainer,
                !hasReadPrivacy && styles.disabledCheckboxContainer
              ]}
              onPress={() => hasReadPrivacy && onChange(!value)}
              disabled={!hasReadPrivacy}
              accessible={true}
              accessibilityRole="checkbox"
              accessibilityState={{ 
                checked: !!value,
                disabled: !hasReadPrivacy 
              }}
              accessibilityLabel="Menyetujui kebijakan privasi"
            >
              <View style={[
                styles.customCheckbox,
                value && styles.customCheckboxChecked,
                !hasReadPrivacy && styles.disabledCheckbox
              ]}>
                {value && <Text style={styles.checkmarkText}>✓</Text>}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={[
                  styles.checkboxLabel,
                  !hasReadPrivacy && styles.disabledText
                ]}>
                  Saya telah membaca dan menyetujui{' '}
                  <Text style={styles.linkText}>Kebijakan Privasi</Text> *
                </Text>
                <Text style={[
                  styles.checkboxDescription,
                  !hasReadPrivacy && styles.disabledText
                ]}>
                  {!hasReadPrivacy 
                    ? "Anda harus membaca dokumen PDF terlebih dahulu"
                    : "Termasuk bagaimana data pribadi Anda dikumpulkan, digunakan, disimpan, dan dilindungi oleh Dentalization."
                  }
                </Text>
              </View>
            </TouchableOpacity>
          )}
          name="acceptPrivacy"
          defaultValue={formData.acceptPrivacy || false}
        />
        {errors.acceptPrivacy && (
          <Text style={styles.errorText}>{String(errors.acceptPrivacy.message)}</Text>
        )}
      </View>

      <View style={styles.termsSection}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity 
              style={styles.customCheckboxContainer}
              onPress={() => onChange(!value)}
              accessible={true}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !!value }}
              accessibilityLabel="Menerima informasi promosi dan update"
            >
              <View style={[
                styles.customCheckbox,
                value && styles.customCheckboxChecked
              ]}>
                {value && <Text style={styles.checkmarkText}>✓</Text>}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxLabel}>
                  Saya setuju menerima informasi promosi dan update (opsional)
                </Text>
                <Text style={styles.checkboxDescription}>
                  Termasuk newsletter, informasi promo terbaru, dan update fitur 
                  aplikasi melalui email dan notifikasi push.
                </Text>
              </View>
            </TouchableOpacity>
          )}
          name="acceptMarketing"
          defaultValue={formData.acceptMarketing || false}
        />
      </View>

      <View style={styles.finalNote}>
        <Text style={styles.finalNoteTitle}>
          Keamanan Data Terjamin
        </Text>
        <Text style={styles.finalNoteText}>
          Dengan mendaftar, Anda setuju untuk menggunakan layanan Dentalization 
          sesuai dengan syarat dan ketentuan yang berlaku. Data pribadi Anda akan 
          dilindungi dengan teknologi enkripsi tingkat tinggi dan tidak akan 
          dibagikan kepada pihak ketiga tanpa persetujuan Anda.
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => currentStep === 1 ? navigation.goBack() : onPreviousStep()}
          >
            <Text style={styles.backButtonText}>← {currentStep === 1 ? 'Kembali' : 'Sebelumnya'}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Daftar sebagai {getUserTypeLabel()}</Text>
          <Text style={styles.subtitle}>
            Langkah {currentStep} dari {totalSteps}: {getStepTitle()}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={currentStep / totalSteps} 
            color="#483AA0"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.round((currentStep / totalSteps) * 100)}% selesai
          </Text>
        </View>

        {/* Form Content */}
        <View style={styles.form}>
          {renderStepContent()}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit(onNextStep)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.nextButton}
              buttonColor="#483AA0"
              contentStyle={styles.buttonContent}
            >
              {currentStep === totalSteps 
                ? (isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang')
                : 'Lanjutkan'
              }
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Terms & Privacy Modals */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Syarat dan Ketentuan - {getUserTypeLabel()}
            </Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
              const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
              if (isCloseToBottom && !hasReadTerms) {
                setHasReadTerms(true);
              }
            }}
            scrollEventThrottle={400}
          >
            <Text style={styles.modalText}>
              {userType === 'patient' ? `
SYARAT DAN KETENTUAN PENGGUNAAN DENTALIZATION - PASIEN

Terakhir diperbarui: Januari 2024

1. PENERIMAAN SYARAT
Dengan menggunakan aplikasi mobile Dentalization, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan syarat-syarat ini, mohon untuk tidak menggunakan layanan kami.

2. HAK DAN TANGGUNG JAWAB PASIEN
Sebagai pasien yang menggunakan Dentalization, Anda berhak untuk:
- Mengakses rekam medis gigi dan riwayat janji temu Anda
- Menerima notifikasi tepat waktu mengenai janji temu
- Meminta modifikasi janji temu sesuai dengan pedoman kebijakan
- Menjaga privasi dan kerahasiaan informasi kesehatan Anda

Tanggung jawab Anda meliputi:
- Memberikan informasi kesehatan yang akurat dan terkini
- Menghadiri janji temu yang telah dijadwalkan atau memberikan pemberitahuan yang memadai
- Mengikuti instruksi perawatan pasca-perawatan
- Membayar layanan sesuai yang disepakati

3. PRIVASI DAN PERLINDUNGAN DATA
Kami berkomitmen untuk melindungi informasi kesehatan pribadi Anda sesuai dengan hukum dan peraturan privasi yang berlaku. Data Anda hanya akan digunakan untuk menyediakan layanan gigi dan meningkatkan platform kami.

4. KEBIJAKAN JANJI TEMU
Kebijakan Pembatalan: Janji temu harus dibatalkan setidaknya 24 jam sebelumnya untuk menghindari biaya pembatalan.

5. PEMBATASAN TANGGUNG JAWAB
Meskipun kami berusaha memberikan informasi yang akurat dan layanan yang dapat diandalkan, kami tidak dapat menjamin akses platform yang tidak terputus.

6. PERSETUJUAN
Dengan mencentang kotak persetujuan, Anda mengkonfirmasi bahwa Anda telah membaca, memahami, dan setuju dengan Syarat dan Ketentuan ini.

7. PERUBAHAN SYARAT
Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi atau email.

8. HUKUM YANG BERLAKU
Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.

9. KONTAK
Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi tim dukungan kami melalui aplikasi.
              ` : `
SYARAT DAN KETENTUAN PENGGUNAAN DENTALIZATION - DOKTER GIGI

Terakhir diperbarui: Januari 2024

1. PENERIMAAN SYARAT
Dengan menggunakan platform Dentalization sebagai profesional gigi, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini dan semua standar serta peraturan profesional yang berlaku.

2. KEWAJIBAN PROFESIONAL
Sebagai dokter gigi yang menggunakan Dentalization, Anda setuju untuk:
- Memelihara lisensi profesional dan kredensial yang valid
- Memberikan informasi profesional dan kualifikasi yang akurat
- Mengikuti standar dan etika praktik gigi yang ditetapkan
- Menjaga kerahasiaan dan privasi pasien
- Memberikan perawatan pasien yang tepat waktu dan profesional

3. PENGGUNAAN PLATFORM
Anda dapat menggunakan platform untuk:
- Mengelola janji temu dan jadwal pasien
- Mengakses dan memperbarui rekam medis pasien
- Berkomunikasi dengan pasien mengenai perawatan
- Membuat laporan dan mengelola operasi praktik

4. KEAMANAN DATA DAN KEPATUHAN
Anda setuju untuk menjaga keamanan dan kerahasiaan data pasien yang diakses melalui platform dan mematuhi semua peraturan privasi kesehatan yang berlaku termasuk standar kerahasiaan medis.

5. TANGGUNG JAWAB PROFESIONAL
Anda mempertahankan tanggung jawab profesional penuh untuk semua layanan gigi yang diberikan dan keputusan yang dibuat dalam perawatan pasien. Platform ini adalah alat untuk membantu praktik Anda tetapi tidak menggantikan penilaian profesional.

6. BIAYA PLATFORM DAN PENAGIHAN
Biaya penggunaan platform dan syarat penagihan akan dikomunikasikan secara terpisah dan dapat bervariasi berdasarkan ukuran praktik dan penggunaan fitur.

7. VERIFIKASI KREDENSIAL
Semua dokumen dan kredensial yang Anda berikan akan diverifikasi oleh tim kami. Praktik dapat dimulai setelah verifikasi berhasil.

8. PERSETUJUAN
Dengan mencentang kotak persetujuan, Anda mengkonfirmasi bahwa Anda telah membaca, memahami, dan setuju dengan Syarat dan Ketentuan ini sebagai profesional gigi.
              `}
            </Text>
            
            {!hasReadTerms && (
              <View style={styles.scrollPrompt}>
                <Text style={styles.scrollPromptText}>
                  Scroll ke bawah untuk melanjutkan...
                </Text>
              </View>
            )}
            
            {hasReadTerms && (
              <View style={styles.readConfirmationContainer}>
                <Text style={styles.readConfirmationText}>
                  ✓ Anda telah membaca seluruh dokumen
                </Text>
                <TouchableOpacity
                  style={styles.confirmReadButton}
                  onPress={() => setShowTermsModal(false)}
                >
                  <Text style={styles.confirmReadButtonText}>
                    Saya Telah Membaca
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Kebijakan Privasi</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
              const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
              if (isCloseToBottom && !hasReadPrivacy) {
                setHasReadPrivacy(true);
              }
            }}
            scrollEventThrottle={400}
          >
            <Text style={styles.modalText}>
              {`
KEBIJAKAN PRIVASI DENTALIZATION

Terakhir diperbarui: Januari 2024

1. PENDAHULUAN
Dentalization ("kami", "kita", atau "milik kami") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda.

2. INFORMASI YANG KAMI KUMPULKAN

2.1 Informasi Pribadi
- Nama lengkap, alamat email, nomor telepon
- Tanggal lahir, jenis kelamin, informasi kontak darurat
- Informasi kesehatan gigi dan riwayat medis
- Foto profil (opsional)

2.2 Informasi Profesional (untuk Dokter Gigi)
- Nomor lisensi, spesialisasi, pengalaman
- Informasi klinik dan alamat praktik
- Dokumen verifikasi kredensial

2.3 Informasi Teknis
- Alamat IP, jenis perangkat, sistem operasi
- Data penggunaan aplikasi dan preferensi
- Log aktivitas dan interaksi platform

3. BAGAIMANA KAMI MENGGUNAKAN INFORMASI ANDA

3.1 Penyediaan Layanan
- Memfasilitasi janji temu antara pasien dan dokter gigi
- Mengelola rekam medis dan riwayat perawatan
- Mengirim notifikasi dan pengingat
- Memproses pembayaran dan administrasi

3.2 Peningkatan Layanan
- Menganalisis pola penggunaan untuk meningkatkan fitur
- Melakukan riset dan pengembangan produk
- Memberikan dukungan pelanggan yang lebih baik

3.3 Komunikasi
- Mengirim pembaruan layanan dan informasi penting
- Newsletter dan promosi (jika Anda menyetujui)
- Survei kepuasan dan feedback

4. PEMBAGIAN INFORMASI

4.1 Dengan Dokter Gigi dan Pasien
- Informasi medis dibagikan hanya untuk tujuan perawatan
- Dokter gigi dapat mengakses rekam medis pasien mereka
- Pasien dapat melihat informasi profesional dokter gigi

4.2 Dengan Pihak Ketiga
- Penyedia layanan pembayaran (untuk transaksi)
- Layanan cloud untuk penyimpanan data yang aman
- Partner teknologi untuk fungsi aplikasi

4.3 Kepatuhan Hukum
- Ketika diperlukan oleh hukum atau peraturan
- Untuk melindungi hak dan keamanan pengguna
- Dalam situasi darurat medis

5. KEAMANAN DATA

5.1 Enkripsi
- Semua data sensitif dienkripsi saat transit dan penyimpanan
- Menggunakan protokol keamanan standar industri
- Server yang aman dengan akses terbatas

5.2 Kontrol Akses
- Autentikasi multi-faktor untuk akun sensitif
- Audit akses data secara berkala
- Pelatihan keamanan untuk karyawan

6. HAK ANDA

6.1 Akses dan Koreksi
- Anda dapat mengakses informasi pribadi Anda
- Meminta koreksi data yang tidak akurat
- Memperbarui preferensi privasi

6.2 Penghapusan Data
- Meminta penghapusan akun dan data pribadi
- Data medis dapat disimpan sesuai persyaratan hukum
- Proses penghapusan dalam 30 hari kerja

6.3 Portabilitas Data
- Meminta salinan data dalam format yang dapat dibaca
- Transfer data ke penyedia layanan lain

7. PENYIMPANAN DATA
- Data disimpan di server yang berlokasi di Indonesia
- Periode penyimpanan sesuai dengan persyaratan hukum medis
- Data backup dengan enkripsi tingkat tinggi

8. PERUBAHAN KEBIJAKAN
- Kami dapat memperbarui kebijakan ini sewaktu-waktu
- Pemberitahuan perubahan melalui aplikasi atau email
- Perubahan signifikan memerlukan persetujuan ulang

9. KONTAK
Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak privasi Anda, silakan hubungi:
- Email: privacy@dentalization.com
- Telepon: +62-XXX-XXXX-XXXX
- Alamat: [Alamat Kantor]

Dengan menggunakan layanan Dentalization, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini.
              `}
            </Text>
            
            {!hasReadPrivacy && (
              <View style={styles.scrollPrompt}>
                <Text style={styles.scrollPromptText}>
                  Scroll ke bawah untuk melanjutkan...
                </Text>
              </View>
            )}
            
            {hasReadPrivacy && (
              <View style={styles.readConfirmationContainer}>
                <Text style={styles.readConfirmationText}>
                  ✓ Anda telah membaca seluruh dokumen
                </Text>
                <TouchableOpacity
                  style={styles.confirmReadButton}
                  onPress={() => setShowPrivacyModal(false)}
                >
                  <Text style={styles.confirmReadButtonText}>
                    Saya Telah Membaca
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
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
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
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
  title: {
    fontSize: 24,
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
  progressContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  progressText: {
    fontSize: 12,
    color: '#6E6E6E',
    textAlign: 'center',
    marginTop: 8,
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
  stepContent: {
    marginBottom: 24,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6E6E6E',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    // Force white background to override autofill styling
    color: '#000000',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    marginTop: 8,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#483AA0',
    backgroundColor: '#483AA0',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
    flex: 1,
  },
  linkText: {
    color: '#483AA0',
    fontWeight: '600',
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specializationChip: {
    backgroundColor: '#F2F1F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  specializationChipSelected: {
    backgroundColor: '#483AA0',
    borderColor: '#483AA0',
  },
  specializationText: {
    fontSize: 14,
    color: '#333333',
  },
  specializationTextSelected: {
    color: '#FFFFFF',
  },
  documentSection: {
    backgroundColor: '#F2F1F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  documentItem: {
    fontSize: 14,
    color: '#6E6E6E',
    marginBottom: 4,
  },
  uploadButton: {
    backgroundColor: '#483AA0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadSuccess: {
    fontSize: 14,
    color: '#22C55E',
    textAlign: 'center',
    marginBottom: 16,
  },
  verificationNote: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  verificationNoteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 8,
  },
  verificationNoteText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  // Terms & Conditions Step Styles
  termsExplanation: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#483AA0',
  },
  termsExplanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  termsExplanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  termsSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  customCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  customCheckboxChecked: {
    backgroundColor: '#483AA0',
    borderColor: '#483AA0',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  finalNote: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  finalNoteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 8,
  },
  finalNoteText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 8,
  },
  nextButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
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

  // PDF-related styles
  pdfSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#483AA0',
    marginBottom: 20,
    shadowColor: '#483AA0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  pdfButton: {
    backgroundColor: '#483AA0',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#483AA0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  readIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  readIndicatorText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  disabledCheckboxContainer: {
    opacity: 0.5,
  },
  disabledCheckbox: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  disabledText: {
    color: '#9E9E9E',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 20,
  },
  scrollPrompt: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  scrollPromptText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  readConfirmationContainer: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  readConfirmationText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 12,
  },
  confirmReadButton: {
    backgroundColor: '#483AA0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    minWidth: 150,
  },
  confirmReadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // University selector styles
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  universitySelector: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    padding: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  universitySelectorText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  placeholderText: {
    color: '#A0A0A0',
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  universityList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  universityOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  universityOptionText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default RegisterScreen;
