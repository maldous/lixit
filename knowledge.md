# LIXI Loan Submission System

## Project Overview
This project handles digital loan submissions using the LIXI (Lending and Investment eXchange Initiative) standard - the Australian banking industry standard for loan data exchange.

## Key Components
- **LIXI Standard**: Australian banking industry format for loan data exchange
- **Submission Types**: Prospect submissions (initial inquiries) and Application submissions (full applications)
- **Output Formats**: JSON (raw LIXI), Excel (human-readable), PDF (reports), supporting documents

## LIXI Structure
- Package containing Application elements
- Comprehensive borrower, loan, and financial data
- Key sections: Application Overview, Loan Details, Borrower Information, Assets & Liabilities, Documents, Security Agreements, Declarations

## Development Notes
- Large LIXI schema file: `LIXI-CAL-2_6_86_RFC-Annotated.json` (5.14MB)
- Supports multiple lenders with customized transformers
- Both synchronous and asynchronous submission paths
- Document categorization by type (financial statements, bank statements, etc.)

## File Processing
- Data Collection → LIXI Transformation → File Generation → Document Categorization → Submission → Status Tracking

## Monorepo Structure
- **Apps**: `apps/web`, `apps/mobile`
- **Packages**: `packages/core`, `packages/ui-kit`
- **Services**: `services/ingestion-api` 
