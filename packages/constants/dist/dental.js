// Dental-specific constants
export const DENTAL = {
    TOOTH_QUADRANTS: [1, 2, 3, 4],
    ADULT_TEETH_COUNT: 32,
    CHILD_TEETH_COUNT: 20,
};
// Common dental procedures and their typical durations (in minutes)
export const PROCEDURES = {
    consultation: { duration: 30, category: 'diagnostic' },
    cleaning: { duration: 60, category: 'preventive' },
    filling: { duration: 45, category: 'restorative' },
    extraction: { duration: 30, category: 'surgical' },
    root_canal: { duration: 90, category: 'endodontic' },
    crown: { duration: 120, category: 'restorative' },
    bridge: { duration: 150, category: 'restorative' },
    implant: { duration: 180, category: 'surgical' },
    orthodontics: { duration: 45, category: 'orthodontic' },
    emergency: { duration: 30, category: 'emergency' },
    follow_up: { duration: 20, category: 'follow_up' },
    virtual_consultation: { duration: 20, category: 'virtual' },
};
// Dental specializations recognized in Indonesia
export const SPECIALIZATIONS = [
    'General Dentistry',
    'Oral Surgery',
    'Orthodontics',
    'Endodontics',
    'Periodontics',
    'Prosthodontics',
    'Pediatric Dentistry',
    'Oral Medicine',
    'Oral Pathology',
    'Oral Radiology',
    'Public Health Dentistry',
];
// Common dental conditions for AI diagnosis
export const CONDITIONS = [
    'Tooth Decay',
    'Gingivitis',
    'Periodontitis',
    'Tooth Abscess',
    'Cracked Tooth',
    'Tooth Sensitivity',
    'Wisdom Tooth Problems',
    'TMJ Disorder',
    'Oral Thrush',
    'Dry Mouth',
    'Bad Breath',
    'Tooth Erosion',
];
// Urgency levels for AI recommendations
export const URGENCY_LEVELS = {
    emergency: {
        priority: 1,
        description: 'Immediate attention required',
        color: '#DC2626', // red-600
    },
    high: {
        priority: 2,
        description: 'Schedule within 24-48 hours',
        color: '#EA580C', // orange-600
    },
    medium: {
        priority: 3,
        description: 'Schedule within 1-2 weeks',
        color: '#D97706', // amber-600
    },
    low: {
        priority: 4,
        description: 'Routine care, can wait',
        color: '#16A34A', // green-600
    },
};
//# sourceMappingURL=dental.js.map