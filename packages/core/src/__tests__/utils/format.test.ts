import {
  formatCurrency,
  formatPercentage,
  formatLIXIDate,
  formatDisplayDate,
  getAnnualMultiplier,
  convertToAnnual,
  generateUniqueId,
  sanitizeFileName,
  getFileExtension,
  getMimeType,
  formatFileSize,
} from "../../utils/format";

describe("Format Utilities", () => {
  test("should format currency correctly", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(1234.56, "USD")).toContain("1,234.56");
  });

  test("should format percentage correctly", () => {
    expect(formatPercentage(0.1234)).toBe("12.34%");
    expect(formatPercentage(0.1234, 1)).toBe("12.3%");
    expect(formatPercentage(0)).toBe("0.00%");
    expect(formatPercentage(1)).toBe("100.00%");
  });

  test("should format LIXI date correctly", () => {
    const date = new Date("2023-01-01");
    expect(formatLIXIDate(date)).toBe("2023-01-01");
    expect(formatLIXIDate("2023-01-01")).toBe("2023-01-01");
  });

  test("should format display date correctly", () => {
    const date = new Date("2023-01-01");
    expect(formatDisplayDate(date)).toBe("01/01/2023");
  });

  test("should get annual multiplier correctly", () => {
    expect(getAnnualMultiplier("weekly")).toBe(52);
    expect(getAnnualMultiplier("fortnightly")).toBe(26);
    expect(getAnnualMultiplier("monthly")).toBe(12);
    expect(getAnnualMultiplier("annually")).toBe(1);
    expect(getAnnualMultiplier("unknown")).toBe(1);
    expect(getAnnualMultiplier("WEEKLY")).toBe(52); // Test case insensitive
  });

  test("should test all branches in getAnnualMultiplier", () => {
    // Test all specific cases
    expect(getAnnualMultiplier("weekly")).toBe(52);
    expect(getAnnualMultiplier("fortnightly")).toBe(26);
    expect(getAnnualMultiplier("monthly")).toBe(12);
    expect(getAnnualMultiplier("annually")).toBe(1);

    // Test the default case (line 85)
    expect(getAnnualMultiplier("unknown_frequency")).toBe(1);
    expect(getAnnualMultiplier("daily")).toBe(1);
    expect(getAnnualMultiplier("")).toBe(1);
  });

  test("should cover getAnnualMultiplier default branch", () => {
    // Test the default case branch specifically
    expect(getAnnualMultiplier("quarterly")).toBe(1);
    expect(getAnnualMultiplier("biannually")).toBe(1);
    expect(getAnnualMultiplier("random")).toBe(1);
    expect(getAnnualMultiplier("UNKNOWN")).toBe(1);
  });

  test("should convert to annual correctly", () => {
    expect(convertToAnnual(1000, "monthly")).toBe(12000);
    expect(convertToAnnual(500, "weekly")).toBe(26000);
    expect(convertToAnnual(0, "monthly")).toBe(0);
  });

  test("should generate unique ID", () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    expect(id1).not.toBe(id2);

    const prefixedId = generateUniqueId("test");
    expect(prefixedId).toContain("test-");

    const emptyPrefixId = generateUniqueId("");
    expect(emptyPrefixId.length).toBeGreaterThan(0);
  });

  test("should sanitize file name", () => {
    expect(sanitizeFileName("test file.pdf")).toBe("test_file.pdf");
    expect(sanitizeFileName("test__file")).toBe("test_file");
    expect(sanitizeFileName("_test_file_")).toBe("test_file");
    expect(sanitizeFileName("test@#$%file.pdf")).toBe("test_file.pdf");
  });

  test("should cover parts.pop() logic in getFileExtension", () => {
    // Test the specific line 85: parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';

    // Test when parts.length > 1 and pop() returns a value
    expect(getFileExtension("test.PDF")).toBe("pdf");
    expect(getFileExtension("file.DOCX")).toBe("docx");

    // Test when parts.length > 1 but pop() could return undefined (edge case)
    // This tests the || '' part of the expression
    expect(getFileExtension("test.")).toBe("");

    // Test when parts.length <= 1 (no extension)
    expect(getFileExtension("test")).toBe("");
    expect(getFileExtension("")).toBe("");
  });

  test("should get file extension", () => {
    expect(getFileExtension("test.pdf")).toBe("pdf");
    expect(getFileExtension("test.DOC")).toBe("doc");
    expect(getFileExtension("test")).toBe("");
    expect(getFileExtension("test.multiple.extensions.txt")).toBe("txt");
    expect(getFileExtension("")).toBe("");
  });

  test("should get MIME type", () => {
    expect(getMimeType("test.pdf")).toBe("application/pdf");
    expect(getMimeType("test.jpg")).toBe("image/jpeg");
    expect(getMimeType("test.jpeg")).toBe("image/jpeg");
    expect(getMimeType("test.png")).toBe("image/png");
    expect(getMimeType("test.doc")).toBe("application/msword");
    expect(getMimeType("test.docx")).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(getMimeType("test.xls")).toBe("application/vnd.ms-excel");
    expect(getMimeType("test.xlsx")).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    expect(getMimeType("test.txt")).toBe("text/plain");
    expect(getMimeType("test.csv")).toBe("text/csv");
    expect(getMimeType("test.gif")).toBe("image/gif");
    expect(getMimeType("test.unknown")).toBe("application/octet-stream");
    expect(getMimeType("test")).toBe("application/octet-stream");
  });

  test("should format file size", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1048576)).toBe("1 MB");
    expect(formatFileSize(1073741824)).toBe("1 GB");
    expect(formatFileSize(512)).toBe("512 Bytes");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  test("should handle invalid date strings", () => {
    // Test the catch block in formatLIXIDate and formatDisplayDate
    expect(() => formatLIXIDate("invalid-date")).toThrow();
    expect(() => formatDisplayDate("invalid-date")).toThrow();
  });

  test("should handle edge case in formatFileSize", () => {
    // Test the edge case where Math.log returns a value that needs proper handling
    expect(formatFileSize(1)).toBe("1 Bytes");
    expect(formatFileSize(1023)).toBe("1023 Bytes");
  });

  test("should handle very large file sizes", () => {
    // Test the edge case for very large files that might cause precision issues
    expect(formatFileSize(1099511627776)).toBe("1 TB"); // 1 TB
  });

  test("should handle array bounds in formatFileSize", () => {
    // Test with a very large number that would exceed array bounds
    const veryLargeNumber = Math.pow(1024, 10); // Exceeds TB
    const result = formatFileSize(veryLargeNumber);
    expect(result).toContain("TB"); // Now it should properly cap at TB
  });

  test("should handle negative file sizes", () => {
    // Test edge case with negative numbers
    expect(formatFileSize(-1)).toBe("0 Bytes");
  });

  test("should handle string date parsing edge case", () => {
    // Test the branch where parseISO is called with a string
    const dateString = "2023-12-25T10:30:00Z";
    expect(formatLIXIDate(dateString)).toBe("2023-12-25");
    expect(formatDisplayDate(dateString)).toBe("25/12/2023");
  });
});
