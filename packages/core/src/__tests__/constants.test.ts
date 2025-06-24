import {
  DOCUMENT_TYPES,
  LOAN_PURPOSES,
  APPLICATION_STATUSES,
  LIXI_SCHEMA_VERSION,
  SUBMISSION_TYPES,
  REPAYMENT_TYPES,
  DOCUMENT_CATEGORIES,
  PERSON_TYPES,
  FREQUENCIES,
  AUSTRALIAN_STATES,
  SUPPORTED_FILE_TYPES,
  MAX_FILE_SIZE,
  API_ENDPOINTS,
  LENDER_CODES,
  ERROR_CODES,
  SUCCESS_MESSAGES,
} from "../constants";

describe("Constants", () => {
  test("should export LIXI_SCHEMA_VERSION", () => {
    expect(LIXI_SCHEMA_VERSION).toBe("2.6.86");
  });

  test("should export DOCUMENT_TYPES", () => {
    expect(DOCUMENT_TYPES).toBeDefined();
    expect(typeof DOCUMENT_TYPES).toBe("object");
    expect(DOCUMENT_TYPES.PAY_SLIP).toBe("PaySlip");
  });

  test("should export LOAN_PURPOSES", () => {
    expect(LOAN_PURPOSES).toBeDefined();
    expect(typeof LOAN_PURPOSES).toBe("object");
    expect(LOAN_PURPOSES.PURCHASE).toBe("Purchase");
  });

  test("should export APPLICATION_STATUSES", () => {
    expect(APPLICATION_STATUSES).toBeDefined();
    expect(typeof APPLICATION_STATUSES).toBe("object");
    expect(APPLICATION_STATUSES.SUBMITTED).toBe("Submitted");
  });

  test("should export SUBMISSION_TYPES", () => {
    expect(SUBMISSION_TYPES).toBeDefined();
    expect(SUBMISSION_TYPES.PROSPECT).toBe("Prospect");
    expect(SUBMISSION_TYPES.APPLICATION).toBe("Application");
  });

  test("should export REPAYMENT_TYPES", () => {
    expect(REPAYMENT_TYPES).toBeDefined();
    expect(REPAYMENT_TYPES.PRINCIPAL_AND_INTEREST).toBe("PrincipalAndInterest");
  });

  test("should export DOCUMENT_CATEGORIES", () => {
    expect(DOCUMENT_CATEGORIES).toBeDefined();
    expect(DOCUMENT_CATEGORIES.INCOME).toBe("Income");
  });

  test("should export PERSON_TYPES", () => {
    expect(PERSON_TYPES).toBeDefined();
    expect(PERSON_TYPES.INDIVIDUAL).toBe("Individual");
  });

  test("should export FREQUENCIES", () => {
    expect(FREQUENCIES).toBeDefined();
    expect(FREQUENCIES.WEEKLY).toBe("Weekly");
  });

  test("should export AUSTRALIAN_STATES", () => {
    expect(AUSTRALIAN_STATES).toBeDefined();
    expect(AUSTRALIAN_STATES.NSW).toBe("NSW");
  });

  test("should export SUPPORTED_FILE_TYPES", () => {
    expect(SUPPORTED_FILE_TYPES).toBeDefined();
    expect(Array.isArray(SUPPORTED_FILE_TYPES)).toBe(true);
    expect(SUPPORTED_FILE_TYPES).toContain("application/pdf");
  });

  test("should export MAX_FILE_SIZE", () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });

  test("should export API_ENDPOINTS", () => {
    expect(API_ENDPOINTS).toBeDefined();
    expect(API_ENDPOINTS.SUBMIT_PROSPECT).toBe("/api/submissions/prospect");
  });

  test("should export LENDER_CODES", () => {
    expect(LENDER_CODES).toBeDefined();
    expect(LENDER_CODES.CBA).toBe("CBA");
  });

  test("should export ERROR_CODES", () => {
    expect(ERROR_CODES).toBeDefined();
    expect(ERROR_CODES.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
  });

  test("should export SUCCESS_MESSAGES", () => {
    expect(SUCCESS_MESSAGES).toBeDefined();
    expect(SUCCESS_MESSAGES.PROSPECT_SUBMITTED).toBe(
      "Prospect submission successful",
    );
  });
});
