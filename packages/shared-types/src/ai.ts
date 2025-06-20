// AI and diagnostic types
export interface AIAnalysis {
  id: string;
  patientId: string;
  imageId?: string;
  symptoms: Symptom[];
  analysis: DiagnosticResult[];
  confidence: number; // 0-1
  recommendations: Recommendation[];
  createdAt: Date;
  reviewedBy?: string; // dentist ID
  reviewedAt?: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description?: string;
  location?: ToothLocation;
}

export interface DiagnosticResult {
  condition: string;
  confidence: number;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  icd10Code?: string;
}

export interface Recommendation {
  type: 'immediate_care' | 'appointment' | 'home_care' | 'prevention';
  priority: 'low' | 'medium' | 'high';
  description: string;
  estimatedCost?: number;
  timeframe?: string;
}

export interface ToothLocation {
  quadrant: 1 | 2 | 3 | 4;
  toothNumber: number;
  surface?: 'occlusal' | 'mesial' | 'distal' | 'buccal' | 'lingual' | 'incisal';
}

export interface DentalImage {
  id: string;
  patientId: string;
  type: 'xray' | 'photo' | 'scan';
  url: string;
  thumbnailUrl?: string;
  metadata: ImageMetadata;
  uploadedAt: Date;
  uploadedBy: string;
  analysisId?: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number; // in bytes
  camera?: string;
  location?: ToothLocation;
  view?: 'frontal' | 'lateral' | 'occlusal' | 'panoramic';
}
