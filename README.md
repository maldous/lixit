# lixit

The system should handle **two main submission types**:

1. **Prospect Submissions** - Initial inquiries to gauge lender interest
2. **Application Submissions** - Complete formal loan applications with full documentation

## Package Scripts

This monorepo uses standardized npm/yarn scripts across all packages. Scripts are orchestrated by Turbo for efficient parallel execution and caching.

### Common Scripts (Available in all packages)

- **`build`** - Compile TypeScript to JavaScript in `dist/` directory
- **`build:prod`** - Production build (same as build for most packages)
- **`dev`** - Development mode with file watching and auto-rebuild
- **`lint`** - Run ESLint to check code quality and style
- **`test`** - Run Jest unit tests
- **`type-check`** - TypeScript type checking without emitting files (`tsc --noEmit`)
- **`clean`** - Remove build artifacts (`rm -rf dist`)
- **`format`** - Format code using Prettier

### Root Package Scripts

Run from project root to execute across all workspaces:

- **`yarn build`** - Build all packages (via Turbo)
- **`yarn dev`** - Start all development servers in parallel
- **`yarn lint`** - Lint all packages
- **`yarn test`** - Run all tests
- **`yarn type-check`** - Type check all packages
- **`yarn clean`** - Clean all packages and remove node_modules
- **`yarn format`** - Format all files in the monorepo

### App-Specific Scripts

- **`yarn web`** - Start Next.js web app on port 8000
- **`yarn mobile`** - Start Expo mobile app
- **`yarn api`** - Start NestJS ingestion API in development mode
- **`yarn storybook`** - Start Storybook component library on port 6006
- **`yarn build-storybook`** - Build static Storybook
- **`yarn build:android`** - Build Android APK for mobile app

### Service-Specific Scripts

**NestJS API (`services/ingestion-api`):**
- **`start`** - Start production server
- **`start:debug`** - Start with debugging enabled
- **`start:prod`** - Start production build
- **`test:watch`** - Run tests in watch mode
- **`test:cov`** - Run tests with coverage report
- **`test:debug`** - Run tests with Node.js debugger

**Mobile App (`apps/mobile`):**
- **`start`** - Start Expo development server
- **`android`** - Run on Android device/emulator
- **`web`** - Run Expo app in web browser

**Web App (`apps/web`):**
- **`start`** - Start Next.js production server
- **`storybook`** - Start Storybook development server
- **`build-storybook`** - Build static Storybook files

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
