// Re-export all functions from receipt.action.tsx
export * from '../receipt.action';

// Export types from interfaces
import type { IReceipt, IStudentBalance } from '../(components)/receipt.interface';
export type { IReceipt, IStudentBalance };

// Import and re-export ReceiptSchema from the correct location
import { ReceiptSchema } from '@/lib/schema';
export type { ReceiptSchema };
