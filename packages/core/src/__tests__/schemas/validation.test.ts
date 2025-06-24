import { LIXIPackageSchema, LIXIApplicationSchema, validateLIXIPackage, validateLIXIApplication } from '../../schemas/validation';

describe('Validation Schemas', () => {
  test('should export LIXIPackageSchema', () => {
    expect(LIXIPackageSchema).toBeDefined();
  });

  test('should export LIXIApplicationSchema', () => {
    expect(LIXIApplicationSchema).toBeDefined();
  });

  test('should validate valid LIXI package', () => {
    const validPackage = {
      Application: [{
        ApplicationDetails: {
          ApplicationID: 'test-app-id',
          ApplicationType: 'Prospect' as const,
          LenderCode: 'TEST',
          SubmissionDate: '2023-01-01'
        },
        Loan: {
          LoanAmount: 500000,
          LoanPurpose: 'Purchase' as const,
          LoanTerm: 30,
          RepaymentType: 'PrincipalAndInterest' as const
        },
        Borrowers: [{
          PersonID: 'test-person-id',
          PersonType: 'Individual' as const,
          FirstName: 'John',
          LastName: 'Doe',
          ContactDetails: {
            Email: 'john@example.com',
            Phone: '0400000000',
            Address: {
              StreetAddress: '123 Test St',
              Suburb: 'Test Suburb',
              State: 'NSW',
              Postcode: '2000',
              Country: 'Australia'
            }
          },
          FinancialPosition: {
            Income: [],
            Expenses: [],
            Assets: [],
            Liabilities: []
          }
        }]
      }],
      SchemaVersion: '2.6.86',
      UniqueID: 'test-id'
    };
    
    const result = LIXIPackageSchema.safeParse(validPackage);
    expect(result.success).toBe(true);
  });

  test('should validate LIXI package using validation function', () => {
    const validPackage = {
      Application: [{
        ApplicationDetails: {
          ApplicationID: 'test-app-id',
          ApplicationType: 'Prospect' as const,
          LenderCode: 'TEST',
          SubmissionDate: '2023-01-01'
        },
        Loan: {
          LoanAmount: 500000,
          LoanPurpose: 'Purchase' as const,
          LoanTerm: 30,
          RepaymentType: 'PrincipalAndInterest' as const
        },
        Borrowers: [{
          PersonID: 'test-person-id',
          PersonType: 'Individual' as const,
          ContactDetails: {
            Email: 'john@example.com',
            Phone: '0400000000',
            Address: {
              StreetAddress: '123 Test St',
              Suburb: 'Test Suburb',
              State: 'NSW',
              Postcode: '2000',
              Country: 'Australia'
            }
          },
          FinancialPosition: {
            Income: [],
            Expenses: [],
            Assets: [],
            Liabilities: []
          }
        }]
      }],
      SchemaVersion: '2.6.86',
      UniqueID: 'test-id'
    };
    
    expect(() => validateLIXIPackage(validPackage)).not.toThrow();
  });

  test('should validate LIXI application using validation function', () => {
    const validApplication = {
      ApplicationDetails: {
        ApplicationID: 'test-app-id',
        ApplicationType: 'Prospect' as const,
        LenderCode: 'TEST',
        SubmissionDate: '2023-01-01'
      },
      Loan: {
        LoanAmount: 500000,
        LoanPurpose: 'Purchase' as const,
        LoanTerm: 30,
        RepaymentType: 'PrincipalAndInterest' as const
      },
      Borrowers: [{
        PersonID: 'test-person-id',
        PersonType: 'Individual' as const,
        ContactDetails: {
          Email: 'john@example.com',
          Phone: '0400000000',
          Address: {
            StreetAddress: '123 Test St',
            Suburb: 'Test Suburb',
            State: 'NSW',
            Postcode: '2000',
            Country: 'Australia'
          }
        },
        FinancialPosition: {
          Income: [],
          Expenses: [],
          Assets: [],
          Liabilities: []
        }
      }]
    };
    
    expect(() => validateLIXIApplication(validApplication)).not.toThrow();
  });
});
