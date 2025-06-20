# Dentalization - Smart Dental Care Ecosystem

A comprehensive AI-powered dental platform designed specifically for Indonesia, providing accessible dental care through telemedicine, AI diagnostics, and smart scheduling.

## 🏗️ Architecture

This is a monorepo managed with Turborepo that includes:

### Apps

- **Web**: Next.js web application for dental professionals and admin
- **Mobile**: React Native mobile app with role-based experience (patients, dentists, admin)

### Services

- **API**: Main backend API service
- **AI Service**: Machine learning and AI diagnostic service
- **File Storage**: Document and image storage service
- **Notification**: Push notification and communication service

### Packages

- **Shared Types**: TypeScript type definitions shared across all apps
- **UI Components**: Reusable React components
- **Utils**: Common utility functions
- **Config**: Shared configuration
- **Constants**: Application constants

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Dentalization/Dentalization.git
cd Dentalization
```

2. Install dependencies:

```bash
npm run setup
```

3. Start development:

```bash
npm run dev
```

## 📜 Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications and packages
- `npm run lint` - Run ESLint across all packages
- `npm run test` - Run tests across all packages
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean all build artifacts

## 🏢 Project Structure

```
dentalization/
├── apps/
│   ├── web/           # Next.js web application for professionals/admin
│   └── mobile/        # React Native app (role-based: patient/dentist/admin)
├── services/
│   ├── api/           # Main backend API
│   ├── ai-service/    # AI/ML service
│   ├── file-storage/  # File storage service
│   └── notification/  # Notification service
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   ├── ui-components/ # Shared React components
│   ├── utils/         # Utility functions
│   ├── config/        # Configuration
│   └── constants/     # Constants
├── docs/              # Documentation
├── tests/             # Test utilities and fixtures
└── infrastructure/    # Docker and deployment configs
```

## 🛠️ Technology Stack

- **Frontend**: Next.js, React Native, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **AI/ML**: Python, TensorFlow/PyTorch
- **Database**: PostgreSQL, Redis
- **Infrastructure**: Docker, AWS/GCP
- **Monitoring**: Sentry, DataDog

## 🇮🇩 Indonesia-Specific Features

- **Multi-language Support**: Bahasa Indonesia and English
- **Local Payment Integration**: GoPay, OVO, DANA, Bank Transfer
- **Telemedicine Compliance**: Adheres to Indonesian healthcare regulations
- **Cultural Adaptation**: UI/UX designed for Indonesian users

## 📱 Features

### For Patients

- AI-powered dental symptom checker
- Virtual dental consultations
- Appointment scheduling
- Dental health tracking
- Educational content in Bahasa Indonesia

### For Dental Professionals

- Patient management dashboard
- AI diagnostic assistance
- Telemedicine platform
- Practice analytics
- Continuing education modules

### For Administrators

- Multi-clinic management
- User role management
- System analytics and reporting
- Content management
- Payment processing oversight

## 🤝 Contributing

Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@dentalization.com or join our Slack channel.

---

Made with ❤️ for Indonesian dental care
