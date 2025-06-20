export declare const DENTAL: {
  readonly TOOTH_QUADRANTS: readonly [1, 2, 3, 4];
  readonly ADULT_TEETH_COUNT: 32;
  readonly CHILD_TEETH_COUNT: 20;
};
export declare const PROCEDURES: {
  readonly consultation: {
    readonly duration: 30;
    readonly category: 'diagnostic';
  };
  readonly cleaning: {
    readonly duration: 60;
    readonly category: 'preventive';
  };
  readonly filling: {
    readonly duration: 45;
    readonly category: 'restorative';
  };
  readonly extraction: {
    readonly duration: 30;
    readonly category: 'surgical';
  };
  readonly root_canal: {
    readonly duration: 90;
    readonly category: 'endodontic';
  };
  readonly crown: {
    readonly duration: 120;
    readonly category: 'restorative';
  };
  readonly bridge: {
    readonly duration: 150;
    readonly category: 'restorative';
  };
  readonly implant: {
    readonly duration: 180;
    readonly category: 'surgical';
  };
  readonly orthodontics: {
    readonly duration: 45;
    readonly category: 'orthodontic';
  };
  readonly emergency: {
    readonly duration: 30;
    readonly category: 'emergency';
  };
  readonly follow_up: {
    readonly duration: 20;
    readonly category: 'follow_up';
  };
  readonly virtual_consultation: {
    readonly duration: 20;
    readonly category: 'virtual';
  };
};
export declare const SPECIALIZATIONS: readonly [
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
export declare const CONDITIONS: readonly [
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
export declare const URGENCY_LEVELS: {
  readonly emergency: {
    readonly priority: 1;
    readonly description: 'Immediate attention required';
    readonly color: '#DC2626';
  };
  readonly high: {
    readonly priority: 2;
    readonly description: 'Schedule within 24-48 hours';
    readonly color: '#EA580C';
  };
  readonly medium: {
    readonly priority: 3;
    readonly description: 'Schedule within 1-2 weeks';
    readonly color: '#D97706';
  };
  readonly low: {
    readonly priority: 4;
    readonly description: 'Routine care, can wait';
    readonly color: '#16A34A';
  };
};
//# sourceMappingURL=dental.d.ts.map
