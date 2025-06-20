# Mobile App Architecture Documentation

## 🏗️ Single App with Role-Based Experience

The Dentalization mobile app uses a unified architecture that adapts the user interface and navigation based on the user's role, providing tailored experiences while maintaining shared functionality.

## 📱 App Structure

```
apps/mobile/
├── src/
│   ├── navigation/               # Navigation layer
│   │   ├── RootNavigator.tsx    # Main router based on auth/role
│   │   ├── AuthNavigator.tsx    # Login/Register flows
│   │   ├── PatientNavigator.tsx # Patient tab navigation
│   │   ├── DentistNavigator.tsx # Dentist tab navigation
│   │   └── AdminNavigator.tsx   # Admin drawer navigation
│   ├── screens/                 # Screen components
│   │   ├── auth/               # Authentication screens
│   │   ├── patient/            # Patient-specific screens
│   │   ├── dentist/            # Dentist-specific screens
│   │   ├── admin/              # Admin-specific screens
│   │   └── shared/             # Shared screens
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── ThemeContext.tsx    # Theme & styling
│   └── theme/                  # Theme configuration
│       └── index.ts
├── app.json                    # Expo configuration
├── babel.config.js            # Babel configuration
├── package.json               # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## 🎭 Role-Based Navigation

### 👤 Patient Experience (Bottom Tabs)
- **Beranda** - Dashboard with health overview and quick actions
- **Janji Temu** - Appointment scheduling and management
- **Cek Gigi AI** - AI-powered dental symptom checker
- **Kesehatan** - Health tracking and dental records
- **Profil** - User profile and settings

### 🦷 Dentist Experience (Bottom Tabs)
- **Dashboard** - Patient overview and daily schedule
- **Pasien** - Patient management and records
- **Janji Temu** - Appointment calendar and scheduling
- **Diagnostik** - AI diagnostic tools and analysis
- **Profil** - Professional profile and settings

### 🔧 Admin Experience (Drawer Navigation)
- **Dashboard Admin** - System overview and analytics
- **Kelola Pengguna** - User management and role assignment
- **Kelola Klinik** - Clinic management and configuration
- **Analitik** - Platform analytics and reporting
- **Pengaturan Sistem** - System settings and configuration
- **Profil** - Administrator profile

## 🇮🇩 Indonesian Design Language

### Colors
- **Primary Red**: `#DC143C` (Indonesian flag red)
- **Secondary Gold**: `#FFD700` (Traditional Indonesian gold)
- **Accent Emerald**: `#50C878` (Indonesian emerald)
- **Background**: Clean white with subtle surfaces

### Language Support
- **Primary**: Bahasa Indonesia
- **Secondary**: English
- **Dynamic**: Content adapts based on user preference

## 🔒 Authentication Flow

1. **Welcome Screen** - App introduction and role selection
2. **Login** - Email/phone and password authentication
3. **Register** - Role-specific registration (Patient/Dentist)
4. **Role Detection** - Automatic navigation based on user role
5. **Persistent Session** - AsyncStorage for offline authentication

## 🛠️ Key Features by Role

### Shared Features
- ✅ Secure authentication with role-based access
- ✅ Real-time notifications
- ✅ Indonesian payment integration (GoPay, OVO, DANA)
- ✅ Telemedicine video calls
- ✅ Multi-language support
- ✅ Offline data synchronization

### Patient-Specific
- 🔍 AI symptom checker with camera integration
- 📅 Easy appointment booking with dentist search
- 📊 Personal health tracking and history
- 🎓 Educational content in Bahasa Indonesia
- 💳 Integrated payment processing

### Dentist-Specific
- 👥 Comprehensive patient management
- 🤖 AI diagnostic assistance tools
- 📈 Practice analytics and insights
- 💼 Professional profile and credentials
- 🎯 Appointment scheduling optimization

### Admin-Specific
- 🏢 Multi-clinic management
- 👤 User role and permission management
- 📊 Platform-wide analytics
- ⚙️ System configuration
- 💰 Payment processing oversight

## 📦 Dependencies

### Core Technologies
- **Expo** - React Native development platform
- **React Navigation** - Navigation library with tabs/drawer/stack
- **React Native Paper** - Material Design components
- **TypeScript** - Type safety across the app

### Indonesian-Specific
- **Shared Packages** - `@dentalization/shared-types`, `constants`, `utils`
- **Payment Integration** - Support for local payment methods
- **Localization** - Indonesian language and cultural adaptation

## 🚀 Next Development Steps

1. **Install Dependencies** - Set up the React Native environment
2. **Create Screen Components** - Build individual screens for each role
3. **API Integration** - Connect to backend services
4. **Payment Integration** - Implement Indonesian payment methods
5. **AI Features** - Integrate camera and ML capabilities
6. **Testing** - Comprehensive testing across all user roles

This architecture provides a scalable foundation that can grow with your platform while maintaining a consistent user experience across different roles! 🦷📱✨
