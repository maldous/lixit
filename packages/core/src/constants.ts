// LIXI System Constants

export const LIXI_SCHEMA_VERSION = '2.6.86';

export const SUBMISSION_TYPES = {
  PROSPECT: 'Prospect',
  APPLICATION: 'Application',
} as const;

export const APPLICATION_STATUSES = {
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'InProgress',
  APPROVED: 'Approved',
  DECLINED: 'Declined',
  WITHDRAWN: 'Withdrawn',
} as const;

export const LOAN_PURPOSES = {
  PURCHASE: 'Purchase',
  REFINANCE: 'Refinance',
  INVESTMENT: 'Investment',
  CONSTRUCTION: 'Construction',
  OTHER: 'Other',
} as const;

export const REPAYMENT_TYPES = {
  PRINCIPAL_AND_INTEREST: 'PrincipalAndInterest',
  INTEREST_ONLY: 'InterestOnly',
} as const;

export const DOCUMENT_TYPES = {
  PAY_SLIP: 'PaySlip',
  BANK_STATEMENT: 'BankStatement',
  TAX_RETURN: 'TaxReturn',
  FINANCIAL_STATEMENT: 'FinancialStatement',
  OTHER: 'Other',
} as const;

export const DOCUMENT_CATEGORIES = {
  INCOME: 'Income',
  ASSETS: 'Assets',
  LIABILITIES: 'Liabilities',
  IDENTITY: 'Identity',
  PROPERTY: 'Property',
  OTHER: 'Other',
} as const;

export const PERSON_TYPES = {
  INDIVIDUAL: 'Individual',
  COMPANY: 'Company',
} as const;

export const FREQUENCIES = {
  WEEKLY: 'Weekly',
  FORTNIGHTLY: 'Fortnightly',
  MONTHLY: 'Monthly',
  ANNUALLY: 'Annually',
} as const;

export const AUSTRALIAN_STATES = {
  NSW: 'NSW',
  VIC: 'VIC',
  QLD: 'QLD',
  WA: 'WA',
  SA: 'SA',
  TAS: 'TAS',
  ACT: 'ACT',
  NT: 'NT',
} as const;

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'text/csv',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const API_ENDPOINTS = {
  SUBMIT_PROSPECT: '/api/submissions/prospect',
  SUBMIT_APPLICATION: '/api/submissions/application',
  GET_STATUS: '/api/submissions/:id/status',
  UPLOAD_DOCUMENT: '/api/documents/upload',
  GENERATE_EXCEL: '/api/generate/excel',
  GENERATE_PDF: '/api/generate/pdf',
} as const;

export const LENDER_CODES = {
  // Common Australian lenders
  CBA: 'CBA',
  ANZ: 'ANZ',
  WESTPAC: 'WBC',
  NAB: 'NAB',
  MACQUARIE: 'MBL',
  SUNCORP: 'SUN',
  BENDIGO: 'BEN',
  // Add more as needed
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TRANSFORMATION_ERROR: 'TRANSFORMATION_ERROR',
  SUBMISSION_ERROR: 'SUBMISSION_ERROR',
  LENDER_ERROR: 'LENDER_ERROR',
  FILE_ERROR: 'FILE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export const SUCCESS_MESSAGES = {
  PROSPECT_SUBMITTED: 'Prospect submission successful',
  APPLICATION_SUBMITTED: 'Application submission successful',
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  FILE_GENERATED: 'File generated successfully',
} as const;
