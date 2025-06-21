// Dentalization Brand Colors - Design System
// Last updated: June 21, 2025

export const DentalizationColors = {
  // === PRIMARY COLORS ===
  primary: '#483AA0',           // Blue-violet (72, 58, 160) - Trust, professionalism
  accent: '#A08A48',            // Muted gold (160, 138, 72) - Complementary contrast
  
  // === TERTIARY COLORS (Analogous) ===
  lightViolet: '#6854C0',       // (104, 84, 192) - Hover states
  softBlue: '#4848C0',          // (72, 72, 192) - Subtle UI elements
  
  // === NEUTRAL SHADES ===
  lightBackground: '#F2F1F8',   // (242, 241, 248) - Main background
  midGrey: '#6E6E6E',          // (110, 110, 110) - Secondary text
  darkGrey: '#333333',         // (51, 51, 51) - Main text
  white: '#FFFFFF',            // Pure white
  
  // === FUNCTIONAL COLORS ===
  success: '#4CAF50',          // (76, 175, 80) - Success states
  warning: '#FFB300',          // (255, 179, 0) - Warning states
  error: '#E53935',            // (229, 57, 53) - Error states
  info: '#2196F3',             // (33, 150, 243) - Info states
  
  // === TRANSPARENCY VARIATIONS ===
  primaryLight: '#483AA020',    // Primary with 20% opacity
  primaryMedium: '#483AA050',   // Primary with 50% opacity
  accentLight: '#A08A4820',     // Accent with 20% opacity
  
  // === GRADIENTS ===
  primaryGradient: ['#483AA0', '#6854C0'],
  accentGradient: ['#A08A48', '#C0A868'],
} as const;

// Usage examples for components:
export const ComponentColors = {
  // === BUTTONS ===
  primaryButton: {
    background: DentalizationColors.primary,
    text: DentalizationColors.white,
    disabled: '#CCCCCC',
  },
  
  secondaryButton: {
    background: 'transparent',
    border: DentalizationColors.primary,
    text: DentalizationColors.primary,
  },
  
  accentButton: {
    background: DentalizationColors.accent,
    text: DentalizationColors.white,
  },
  
  // === CARDS & SURFACES ===
  card: {
    background: DentalizationColors.white,
    border: DentalizationColors.lightBackground,
    shadow: DentalizationColors.primaryLight,
  },
  
  surface: {
    background: DentalizationColors.lightBackground,
    elevated: DentalizationColors.white,
  },
  
  // === TEXT ===
  text: {
    primary: DentalizationColors.darkGrey,
    secondary: DentalizationColors.midGrey,
    onPrimary: DentalizationColors.white,
    onAccent: DentalizationColors.white,
    link: DentalizationColors.primary,
  },
  
  // === NAVIGATION ===
  navigation: {
    activeTab: DentalizationColors.primary,
    inactiveTab: DentalizationColors.midGrey,
    background: DentalizationColors.white,
    border: DentalizationColors.lightBackground,
  },
  
  // === FORM ELEMENTS ===
  input: {
    background: DentalizationColors.white,
    border: DentalizationColors.lightBackground,
    borderFocused: DentalizationColors.primary,
    placeholder: DentalizationColors.midGrey,
    text: DentalizationColors.darkGrey,
  },
  
  // === STATUS INDICATORS ===
  status: {
    success: DentalizationColors.success,
    warning: DentalizationColors.warning,
    error: DentalizationColors.error,
    info: DentalizationColors.info,
    neutral: DentalizationColors.midGrey,
  },
} as const;

// Accessibility-compliant color combinations
export const AccessibleCombinations = {
  // High contrast combinations (WCAG AAA compliant)
  primaryOnWhite: {
    background: DentalizationColors.white,
    text: DentalizationColors.primary,
    contrast: '8.5:1', // AAA compliant
  },
  
  darkTextOnLight: {
    background: DentalizationColors.lightBackground,
    text: DentalizationColors.darkGrey,
    contrast: '12.6:1', // AAA compliant
  },
  
  whiteOnPrimary: {
    background: DentalizationColors.primary,
    text: DentalizationColors.white,
    contrast: '8.5:1', // AAA compliant
  },
} as const;

// Role-specific color themes
export const RoleColors = {
  patient: {
    primary: DentalizationColors.primary,
    accent: DentalizationColors.softBlue,
    background: DentalizationColors.lightBackground,
  },
  
  dentist: {
    primary: DentalizationColors.primary,
    accent: DentalizationColors.accent,
    background: DentalizationColors.white,
  },
  
  admin: {
    primary: DentalizationColors.darkGrey,
    accent: DentalizationColors.primary,
    background: DentalizationColors.lightBackground,
  },
} as const;

export default DentalizationColors;
