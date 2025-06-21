import mongoose from 'mongoose';

// =====================================
// DENTAL RECORD SCHEMAS (MongoDB)
// =====================================

// Main dental record schema
const DentalRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  dentistId: {
    type: String,
    required: true,
    index: true
  },
  appointmentId: {
    type: String,
    required: true,
    index: true
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Chief complaint
  chiefComplaint: {
    type: String,
    required: true
  },
  
  // Clinical examination
  clinicalExamination: {
    extraOral: {
      type: String
    },
    intraOral: {
      type: String
    },
    periodontal: {
      type: String
    }
  },
  
  // Tooth chart - using FDI notation (11-48)
  toothChart: {
    type: Map,
    of: {
      condition: {
        type: String,
        enum: ['healthy', 'caries', 'filled', 'crown', 'missing', 'impacted', 'fractured']
      },
      surfaces: [{
        surface: {
          type: String,
          enum: ['mesial', 'distal', 'occlusal', 'buccal', 'lingual', 'incisal']
        },
        condition: {
          type: String,
          enum: ['healthy', 'caries', 'filled', 'crown', 'fractured']
        }
      }],
      notes: String
    }
  },
  
  // Radiographic findings
  radiographicFindings: {
    type: String
  },
  
  // Diagnosis
  diagnosis: {
    primary: {
      type: String,
      required: true
    },
    differential: [{
      type: String
    }],
    icdCode: String
  },
  
  // Treatment plan
  treatmentPlan: [{
    procedure: {
      type: String,
      required: true
    },
    tooth: String, // FDI notation
    priority: {
      type: String,
      enum: ['urgent', 'high', 'medium', 'low'],
      default: 'medium'
    },
    estimatedCost: Number,
    estimatedDuration: Number, // in minutes
    notes: String
  }],
  
  // Treatment performed
  treatmentPerformed: [{
    procedure: {
      type: String,
      required: true
    },
    tooth: String,
    materials: [{
      name: String,
      brand: String,
      lotNumber: String
    }],
    duration: Number, // actual duration in minutes
    complications: String,
    notes: String,
    performedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Medications prescribed
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  
  // Follow-up
  followUp: {
    required: Boolean,
    date: Date,
    notes: String
  },
  
  // Images and attachments (references to Vector DB and file storage)
  attachments: [{
    type: {
      type: String,
      enum: ['xray', 'photo', 'scan', 'document'],
      required: true
    },
    url: String,
    vectorId: String, // Reference to vector database
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  collection: 'dental_records'
});

// Medical history schema
const MedicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // General medical history
  allergies: [{
    allergen: String,
    reaction: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  }],
  
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: String
  }],
  
  // Medical conditions
  conditions: [{
    name: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic']
    },
    notes: String
  }],
  
  // Surgical history
  surgeries: [{
    procedure: String,
    date: Date,
    hospital: String,
    surgeon: String,
    complications: String
  }],
  
  // Family history
  familyHistory: [{
    relation: String,
    condition: String,
    ageOfOnset: Number
  }],
  
  // Social history
  socialHistory: {
    smoking: {
      status: {
        type: String,
        enum: ['never', 'former', 'current']
      },
      packsPerDay: Number,
      quitDate: Date
    },
    alcohol: {
      frequency: String,
      amount: String
    },
    drugs: {
      use: Boolean,
      substances: [String],
      notes: String
    }
  },
  
  // Dental history
  dentalHistory: {
    lastDentalVisit: Date,
    brushingFrequency: {
      type: String,
      enum: ['daily', 'twice-daily', 'rarely', 'never']
    },
    flossingFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'rarely', 'never']
    },
    previousTreatments: [String],
    dentalAnxiety: {
      level: {
        type: String,
        enum: ['none', 'mild', 'moderate', 'severe']
      },
      triggers: [String]
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'medical_histories'
});

// Treatment template schema (for standardized procedures)
const TreatmentTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['preventive', 'restorative', 'endodontic', 'periodontal', 'surgical', 'orthodontic', 'prosthodontic']
  },
  description: String,
  
  // Standard procedure details
  estimatedDuration: Number, // in minutes
  estimatedCost: {
    min: Number,
    max: Number,
    average: Number
  },
  
  // Required materials
  materials: [{
    name: String,
    category: String,
    optional: Boolean
  }],
  
  // Procedure steps
  steps: [{
    order: Number,
    description: String,
    duration: Number,
    notes: String
  }],
  
  // Post-treatment care
  postCare: [{
    instruction: String,
    duration: String // e.g., "24 hours", "1 week"
  }],
  
  // Associated ICD codes
  icdCodes: [String],
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'treatment_templates'
});

// Indexes for performance
DentalRecordSchema.index({ patientId: 1, visitDate: -1 });
DentalRecordSchema.index({ dentistId: 1, visitDate: -1 });
DentalRecordSchema.index({ appointmentId: 1 });
DentalRecordSchema.index({ 'diagnosis.primary': 1 });

MedicalHistorySchema.index({ patientId: 1 });

TreatmentTemplateSchema.index({ category: 1, name: 1 });
TreatmentTemplateSchema.index({ isActive: 1 });

export const DentalRecord = mongoose.model('DentalRecord', DentalRecordSchema);
export const MedicalHistory = mongoose.model('MedicalHistory', MedicalHistorySchema);
export const TreatmentTemplate = mongoose.model('TreatmentTemplate', TreatmentTemplateSchema);

// Connection helper
export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dentalization_records';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
  }
};
