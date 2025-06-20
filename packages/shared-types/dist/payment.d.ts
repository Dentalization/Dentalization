export interface Payment {
  id: string;
  appointmentId?: string;
  patientId: string;
  amount: number;
  currency: 'IDR';
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  externalId?: string;
  description: string;
}
export type PaymentMethod =
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'insurance';
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';
export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  number: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: 'IDR';
  status: InvoiceStatus;
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
  notes?: string;
}
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'consultation' | 'treatment' | 'medication' | 'lab_work' | 'other';
}
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export interface Insurance {
  id: string;
  provider: string;
  planName: string;
  coverage: InsuranceCoverage;
  isActive: boolean;
}
export interface InsuranceCoverage {
  consultationPercentage: number;
  treatmentPercentage: number;
  annualLimit: number;
  deductible: number;
  copay: number;
}
//# sourceMappingURL=payment.d.ts.map
