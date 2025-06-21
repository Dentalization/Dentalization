import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Checkbox, ProgressBar } from 'react-native-paper';
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
  hasAllergies: boolean;
  allergies?: string;
  hasMedications: boolean;
  medications?: string;
}

interface DentistInfoData {
  licenseNumber: string;
  specializations: string[];
  yearsOfExperience: string;
  education: string;
  clinicName?: string;
  clinicAddress?: string;
  verificationDocuments: string; // In real app, this would be file uploads
}

interface TermsData {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

type StepData = BasicInfoData | PatientInfoData | DentistInfoData | TermsData;

const RegisterScreen: React.FC = () => {
  const route = useRoute<RegisterScreenRouteProp>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const userType = route.params?.userType || 'patient';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Determine total steps based on user type
  const totalSteps = userType === 'dentist' ? 4 : 3; // Basic, Role-specific, Terms (+ extra for dentist)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<any>();

  const watchPassword = watch('password', '');

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
          if (!data.dateOfBirth || !data.gender || !data.emergencyContactName || !data.emergencyContactPhone) {
            Alert.alert('Error', 'Semua field wajib diisi');
            return false;
          }
        } else {
          if (!data.licenseNumber || !data.yearsOfExperience || !data.education) {
            Alert.alert('Error', 'Field wajib harus diisi');
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
      reset();
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
          specialization: finalData.specialization,
          yearsOfExperience: parseInt(finalData.yearsOfExperience) || 0,
          clinicName: finalData.clinicName,
          clinicAddress: finalData.clinicAddress,
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
        rules={{ required: 'Nomor telefon harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nomor Telefon *"
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
          <TextInput
            label="Password *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.password}
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={errors.password ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.password ? '#E53E3E' : '#483AA0'}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
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
          <TextInput
            label="Konfirmasi Password *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            outlineColor={errors.confirmPassword ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.confirmPassword ? '#E53E3E' : '#483AA0'}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
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
          <TextInput
            label="Tanggal Lahir (DD/MM/YYYY) *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.dateOfBirth}
            placeholder="25/12/1990"
            style={styles.input}
            outlineColor={errors.dateOfBirth ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.dateOfBirth ? '#E53E3E' : '#483AA0'}
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

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              color="#483AA0"
            />
            <Text style={styles.checkboxLabel}>Saya memiliki alergi</Text>
          </View>
        )}
        name="hasAllergies"
        defaultValue={formData.hasAllergies || false}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Daftar Alergi (opsional)"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineColor="#D0D0D0"
            activeOutlineColor="#483AA0"
          />
        )}
        name="allergies"
        defaultValue={formData.allergies || ''}
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              color="#483AA0"
            />
            <Text style={styles.checkboxLabel}>Saya sedang mengonsumsi obat</Text>
          </View>
        )}
        name="hasMedications"
        defaultValue={formData.hasMedications || false}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Daftar Obat (opsional)"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineColor="#D0D0D0"
            activeOutlineColor="#483AA0"
          />
        )}
        name="medications"
        defaultValue={formData.medications || ''}
      />
    </View>
  );

  const renderDentistInfoStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Informasi profesional untuk verifikasi kredensial
      </Text>

      <Controller
        control={control}
        rules={{ required: 'Nomor lisensi harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nomor Lisensi Dokter *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.licenseNumber}
            style={styles.input}
            outlineColor={errors.licenseNumber ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.licenseNumber ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="licenseNumber"
        defaultValue={formData.licenseNumber || ''}
      />

      <Controller
        control={control}
        rules={{ required: 'Pengalaman harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Tahun Pengalaman *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.yearsOfExperience}
            keyboardType="numeric"
            style={styles.input}
            outlineColor={errors.yearsOfExperience ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.yearsOfExperience ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="yearsOfExperience"
        defaultValue={formData.yearsOfExperience || ''}
      />

      <Controller
        control={control}
        rules={{ required: 'Pendidikan harus diisi' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Pendidikan Terakhir *"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errors.education}
            multiline
            numberOfLines={3}
            placeholder="Contoh: S1 Kedokteran Gigi - Universitas Indonesia (2015)"
            style={styles.input}
            outlineColor={errors.education ? '#E53E3E' : '#D0D0D0'}
            activeOutlineColor={errors.education ? '#E53E3E' : '#483AA0'}
          />
        )}
        name="education"
        defaultValue={formData.education || ''}
      />

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

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nama Klinik/Rumah Sakit (opsional)"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={styles.input}
            outlineColor="#D0D0D0"
            activeOutlineColor="#483AA0"
          />
        )}
        name="clinicName"
        defaultValue={formData.clinicName || ''}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Alamat Praktik (opsional)"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineColor="#D0D0D0"
            activeOutlineColor="#483AA0"
          />
        )}
        name="clinicAddress"
        defaultValue={formData.clinicAddress || ''}
      />
    </View>
  );

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

      <Controller
        control={control}
        rules={{ required: 'Anda harus menyetujui syarat dan ketentuan' }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              color="#483AA0"
            />
            <Text style={styles.checkboxLabel}>
              Saya setuju dengan{' '}
              <Text style={styles.linkText}>Syarat dan Ketentuan</Text> *
            </Text>
          </View>
        )}
        name="acceptTerms"
        defaultValue={formData.acceptTerms || false}
      />

      <Controller
        control={control}
        rules={{ required: 'Anda harus menyetujui kebijakan privasi' }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              color="#483AA0"
            />
            <Text style={styles.checkboxLabel}>
              Saya setuju dengan{' '}
              <Text style={styles.linkText}>Kebijakan Privasi</Text> *
            </Text>
          </View>
        )}
        name="acceptPrivacy"
        defaultValue={formData.acceptPrivacy || false}
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              color="#483AA0"
            />
            <Text style={styles.checkboxLabel}>
              Saya setuju menerima informasi promosi dan update (opsional)
            </Text>
          </View>
        )}
        name="acceptMarketing"
        defaultValue={formData.acceptMarketing || false}
      />

      <View style={styles.finalNote}>
        <Text style={styles.finalNoteText}>
          Dengan mendaftar, Anda setuju untuk menggunakan layanan Dentalization 
          sesuai dengan syarat dan ketentuan yang berlaku.
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
  finalNote: {
    backgroundColor: '#F2F1F8',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  finalNoteText: {
    fontSize: 14,
    color: '#6E6E6E',
    textAlign: 'center',
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
});

export default RegisterScreen;
