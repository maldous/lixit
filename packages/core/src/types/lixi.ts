// LIXI TypeScript Types
// Generated from LIXI-CAL-2_6_86_RFC-Annotated.json

export interface LIXIPackage {
  Application: LIXIApplication[];
  SchemaVersion: string;
  UniqueID: string;
}

export interface LIXIApplication {
  ApplicationDetails: ApplicationDetails;
  Loan: LoanDetails;
  Borrowers: Borrower[];
  Assets?: Asset[];
  Liabilities?: Liability[];
  Documents?: Document[];
  SecurityAgreements?: SecurityAgreement[];
  Declarations?: Declaration[];
}

export interface ApplicationDetails {
  ApplicationID: string;
  ApplicationType: 'Prospect' | 'Application';
  LenderCode: string;
  SubmissionDate: string;
  Status?: ApplicationStatus;
}

export interface LoanDetails {
  LoanAmount: number;
  LoanPurpose: LoanPurpose;
  LoanTerm: number;
  InterestRate?: number;
  RepaymentType: RepaymentType;
  TaxDeductible?: boolean;
}

export interface Borrower {
  PersonID: string;
  PersonType: 'Individual' | 'Company';
  FirstName?: string;
  LastName?: string;
  CompanyName?: string;
  DateOfBirth?: string;
  ContactDetails: ContactDetails;
  FinancialPosition: FinancialPosition;
}

export interface ContactDetails {
  Email: string;
  Phone: string;
  Address: Address;
}

export interface Address {
  StreetAddress: string;
  Suburb: string;
  State: string;
  Postcode: string;
  Country: string;
}

export interface FinancialPosition {
  Income: IncomeDetails[];
  Expenses: ExpenseDetails[];
  Assets: Asset[];
  Liabilities: Liability[];
}

export interface IncomeDetails {
  IncomeType: string;
  Amount: number;
  Frequency: 'Weekly' | 'Fortnightly' | 'Monthly' | 'Annually';
}

export interface ExpenseDetails {
  ExpenseType: string;
  Amount: number;
  Frequency: 'Weekly' | 'Fortnightly' | 'Monthly' | 'Annually';
}

export interface Asset {
  AssetType: string;
  Value: number;
  Description: string;
}

export interface Liability {
  LiabilityType: string;
  Balance: number;
  MonthlyPayment: number;
  Description: string;
}

export interface Document {
  DocumentID: string;
  DocumentType: DocumentType;
  FileName: string;
  FileSize: number;
  MimeType: string;
  Base64Content?: string;
  DocumentCategory: DocumentCategory;
}

export interface SecurityAgreement {
  SecurityType: string;
  Value: number;
  Description: string;
}

export interface Declaration {
  DeclarationType: string;
  Response: boolean;
  Details?: string;
}

// Enums and Union Types
export type ApplicationStatus = 'Submitted' | 'InProgress' | 'Approved' | 'Declined' | 'Withdrawn';
export type LoanPurpose = 'Purchase' | 'Refinance' | 'Investment' | 'Construction' | 'Other';
export type RepaymentType = 'PrincipalAndInterest' | 'InterestOnly';
export type DocumentType = 'PaySlip' | 'BankStatement' | 'TaxReturn' | 'FinancialStatement' | 'Other';
export type DocumentCategory = 'Income' | 'Assets' | 'Liabilities' | 'Identity' | 'Property' | 'Other';

// Submission Types
export interface ProspectSubmission {
  type: 'Prospect';
  package: LIXIPackage;
  lenderCode: string;
}

export interface ApplicationSubmission {
  type: 'Application';
  package: LIXIPackage;
  lenderCode: string;
  documents: Document[];
}

export type Submission = ProspectSubmission | ApplicationSubmission;

// File Generation Types (from README requirements)
export interface GeneratedFile {
  id: string;
  type: 'JSON' | 'Excel' | 'PDF';
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  submissionId: string;
}

export interface FileGenerationRequest {
  submissionId: string;
  lixiData: LIXIPackage;
  formats: ('JSON' | 'Excel' | 'PDF')[];
  lenderCode: string;
}

// Status Tracking Types (from README requirements)
export interface SubmissionStatus {
  submissionId: string;
  applicationId: string;
  lenderCode: string;
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  files: GeneratedFile[];
}

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  timestamp: string;
  notes?: string;
  source: 'System' | 'Lender' | 'User';
}

// Document Categorization Types (from README requirements)
export interface CategorizedDocument extends Document {
  category: DocumentCategory;
  subcategory?: string;
  confidence: number;
  extractedData?: Record<string, any>;
}

export interface DocumentCategorizationResult {
  documentId: string;
  category: DocumentCategory;
  subcategory?: string;
  confidence: number;
  extractedData?: Record<string, any>;
  processingTime: number;
}

// Lender Integration Types (from README requirements)
export interface LenderIntegration {
  lenderCode: string;
  name: string;
  integrationMethod: 'REST' | 'SOAP' | 'SFTP' | 'GraphQL';
  endpoint?: string;
  isAsync: boolean;
  requiresAuth: boolean;
  supportedSubmissionTypes: ('Prospect' | 'Application')[];
  customFields?: Record<string, any>;
}

export interface LenderSubmissionRequest {
  submissionId: string;
  lenderCode: string;
  submissionType: 'Prospect' | 'Application';
  lixiData: LIXIPackage;
  transformedData: any;
  files?: GeneratedFile[];
}

export interface LenderSubmissionResponse {
  success: boolean;
  lenderReferenceId?: string;
  status: ApplicationStatus;
  message?: string;
  errors?: string[];
  estimatedProcessingTime?: number;
}
