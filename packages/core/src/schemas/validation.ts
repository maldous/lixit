import { z } from "zod";

// Zod schemas for LIXI validation
export const AddressSchema = z.object({
  StreetAddress: z.string().min(1),
  Suburb: z.string().min(1),
  State: z.string().min(1),
  Postcode: z.string().min(1),
  Country: z.string().default("Australia"),
});

export const ContactDetailsSchema = z.object({
  Email: z.string().email(),
  Phone: z.string().min(1),
  Address: AddressSchema,
});

export const IncomeDetailsSchema = z.object({
  IncomeType: z.string().min(1),
  Amount: z.number().positive(),
  Frequency: z.enum(["Weekly", "Fortnightly", "Monthly", "Annually"]),
});

export const ExpenseDetailsSchema = z.object({
  ExpenseType: z.string().min(1),
  Amount: z.number().positive(),
  Frequency: z.enum(["Weekly", "Fortnightly", "Monthly", "Annually"]),
});

export const AssetSchema = z.object({
  AssetType: z.string().min(1),
  Value: z.number().positive(),
  Description: z.string().min(1),
});

export const LiabilitySchema = z.object({
  LiabilityType: z.string().min(1),
  Balance: z.number().positive(),
  MonthlyPayment: z.number().positive(),
  Description: z.string().min(1),
});

export const FinancialPositionSchema = z.object({
  Income: z.array(IncomeDetailsSchema),
  Expenses: z.array(ExpenseDetailsSchema),
  Assets: z.array(AssetSchema),
  Liabilities: z.array(LiabilitySchema),
});

export const BorrowerSchema = z.object({
  PersonID: z.string().min(1),
  PersonType: z.enum(["Individual", "Company"]),
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  CompanyName: z.string().optional(),
  DateOfBirth: z.string().optional(),
  ContactDetails: ContactDetailsSchema,
  FinancialPosition: FinancialPositionSchema,
});

export const LoanDetailsSchema = z.object({
  LoanAmount: z.number().positive(),
  LoanPurpose: z.enum([
    "Purchase",
    "Refinance",
    "Investment",
    "Construction",
    "Other",
  ]),
  LoanTerm: z.number().positive(),
  InterestRate: z.number().positive().optional(),
  RepaymentType: z.enum(["PrincipalAndInterest", "InterestOnly"]),
  TaxDeductible: z.boolean().optional(),
});

export const ApplicationDetailsSchema = z.object({
  ApplicationID: z.string().min(1),
  ApplicationType: z.enum(["Prospect", "Application"]),
  LenderCode: z.string().min(1),
  SubmissionDate: z.string(),
  Status: z
    .enum(["Submitted", "InProgress", "Approved", "Declined", "Withdrawn"])
    .optional(),
});

export const DocumentSchema = z.object({
  DocumentID: z.string().min(1),
  DocumentType: z.enum([
    "PaySlip",
    "BankStatement",
    "TaxReturn",
    "FinancialStatement",
    "Other",
  ]),
  FileName: z.string().min(1),
  FileSize: z.number().positive(),
  MimeType: z.string().min(1),
  Base64Content: z.string().optional(),
  DocumentCategory: z.enum([
    "Income",
    "Assets",
    "Liabilities",
    "Identity",
    "Property",
    "Other",
  ]),
});

export const LIXIApplicationSchema = z.object({
  ApplicationDetails: ApplicationDetailsSchema,
  Loan: LoanDetailsSchema,
  Borrowers: z.array(BorrowerSchema).min(1),
  Assets: z.array(AssetSchema).optional(),
  Liabilities: z.array(LiabilitySchema).optional(),
  Documents: z.array(DocumentSchema).optional(),
  SecurityAgreements: z
    .array(
      z.object({
        SecurityType: z.string().min(1),
        Value: z.number().positive(),
        Description: z.string().min(1),
      }),
    )
    .optional(),
  Declarations: z
    .array(
      z.object({
        DeclarationType: z.string().min(1),
        Response: z.boolean(),
        Details: z.string().optional(),
      }),
    )
    .optional(),
});

export const LIXIPackageSchema = z.object({
  Application: z.array(LIXIApplicationSchema).min(1),
  SchemaVersion: z.string().default("2.6.86"),
  UniqueID: z.string().min(1),
});

// Validation functions
export const validateLIXIPackage = (data: unknown) => {
  return LIXIPackageSchema.parse(data);
};

export const validateLIXIApplication = (data: unknown) => {
  return LIXIApplicationSchema.parse(data);
};
