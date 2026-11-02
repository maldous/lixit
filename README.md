# Lixit

**An archived exploration of lending submissions and LIXI-oriented data exchange.**

Lixit explores the journey from an initial lending prospect to a structured application: collecting information, transforming it for a lender, generating submission files and tracking progress.

This repository is a prototype and design reference. The workflow below describes intended capabilities; it does not certify LIXI compliance, production lending integrations or suitability for real borrower data.

[Matthew Aldous](https://aldous.info/) · [Architecture](docs/content/architecture.md) · [Installation](docs/content/installation.md)

## Workflow and technical reference

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

The system should support multiple lenders with customized transformers:

- Each lender may have specific LIXI requirements and integration methods
- Supports both synchronous and asynchronous submission paths

## Documentation & Resources

- **[Architecture Guide](docs/content/architecture.md)** - System design and service catalog
- **[Installation Guide](docs/content/installation.md)** - Development environment setup
- **[Deployment Guide](docs/content/deployment.md)** - Production deployment procedures
- **[Operations Guide](docs/content/operations.md)** - Monitoring, backup, and maintenance

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd lixit
make setup

# Start development environment
make start

# Access web application
open http://localhost:8000
```

For detailed setup instructions, see the [Installation Guide](docs/content/installation.md).
