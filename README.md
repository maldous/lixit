# lixit

The system should handle **two main submission types**:

1. **Prospect Submissions** - Initial inquiries to gauge lender interest
2. **Application Submissions** - Complete formal loan applications with full documentation

## Submission Format: LIXI Standard

All digital submissions use the **LIXI (Lending and Investment eXchange Initiative)** format, which is the Australian banking industry standard for loan data exchange.

### LIXI Structure

- **Package** containing **Application** elements
- Includes comprehensive borrower, loan, and financial data

### Key LIXI Components

- **Application Overview** - Basic application details
- **Loan Details** - Product information, amounts, terms
- **Borrower Information** - Personal/company details, financials
- **Assets & Liabilities** - Financial position
- **Documents** - Supporting files and attachments
- **Security Agreements** - Collateral details
- **Declarations** - Compliance and regulatory information

## File Formats Generated

The system should create multiple formats for each submission:

1. **JSON** (.json) - Raw LIXI data for machine processing
2. **Excel** (.xlsx) - Human-readable spreadsheet with linked data
3. **PDF** - Application summary reports (when configured)
4. **Supporting Documents** - Various formats (PDF, images, etc.)

## Submission Process

1. **Data Collection** - Gather deal, borrower, and document data
2. **LIXI Transformation** - Convert internal data to LIXI format using lender-specific transformers
3. **File Generation** - Create JSON, Excel, and PDF outputs
4. **Document Categorization** - Classify files by type (financial statements, bank statements, etc.)
5. **Submission** - Send to lender via their preferred integration method
6. **Status Tracking** - Monitor application progress and updates

## Lender Integration

The system should supports multiple lenders with customized transformers:

- Each lender may have specific LIXI requirements and integration methods
- Supports both synchronous and asynchronous submission paths
