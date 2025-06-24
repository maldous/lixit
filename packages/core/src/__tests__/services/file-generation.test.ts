import {
  FileGenerationServiceImpl,
  fileGenerationService,
  JSONGenerator,
  ExcelGenerator,
  PDFGenerator,
} from "../../services/file-generation";
import { LIXIPackage, FileGenerationRequest } from "../../types/lixi";

describe("FileGenerationServiceImpl", () => {
  let service: FileGenerationServiceImpl;

  beforeEach(() => {
    service = new FileGenerationServiceImpl();
  });

  test("should generate JSON file", async () => {
    const lixiData = {} as LIXIPackage;
    const result = await service.generateJSON(lixiData, "test-submission");
    expect(result.type).toBe("JSON");
    expect(result.fileName).toContain(".json");
  });

  test("should generate Excel file", async () => {
    const lixiData = {} as LIXIPackage;
    const result = await service.generateExcel(lixiData, "test-submission");
    expect(result.type).toBe("Excel");
    expect(result.fileName).toContain(".xlsx");
  });

  test("should generate PDF file", async () => {
    const lixiData = {} as LIXIPackage;
    const result = await service.generatePDF(lixiData, "test-submission");
    expect(result.type).toBe("PDF");
    expect(result.fileName).toContain(".pdf");
  });

  test("should generate all files", async () => {
    const lixiData = {} as LIXIPackage;
    const request: FileGenerationRequest = {
      lixiData,
      submissionId: "test-submission",
      formats: ["JSON", "Excel", "PDF"],
      lenderCode: "TEST_LENDER",
    };
    const results = await service.generateAll(request);
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.type)).toEqual(["JSON", "Excel", "PDF"]);
  });
});

describe("JSONGenerator", () => {
  let generator: JSONGenerator;

  beforeEach(() => {
    generator = new JSONGenerator();
  });

  test("should generate JSON file with lender code", async () => {
    const lixiData = { test: "data" } as unknown as LIXIPackage;
    const result = await generator.generate(lixiData, "test-submission");
    expect(result.type).toBe("JSON");
    expect(result.mimeType).toBe("application/json");
    expect(result.fileName).toContain("test-submission");
  });
});

describe("ExcelGenerator", () => {
  let generator: ExcelGenerator;

  beforeEach(() => {
    generator = new ExcelGenerator();
  });

  test("should generate Excel file", async () => {
    const lixiData = {} as LIXIPackage;
    const result = await generator.generate(lixiData, "test-submission");
    expect(result.type).toBe("Excel");
    expect(result.mimeType).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    expect(result.fileSize).toBe(50000);
  });
});

describe("PDFGenerator", () => {
  let generator: PDFGenerator;

  beforeEach(() => {
    generator = new PDFGenerator();
  });

  test("should generate PDF file", async () => {
    const lixiData = {} as LIXIPackage;
    const result = await generator.generate(lixiData, "test-submission");
    expect(result.type).toBe("PDF");
    expect(result.mimeType).toBe("application/pdf");
    expect(result.fileSize).toBe(100000);
  });
});

describe("BaseFileGenerator", () => {
  test("should generate file name with lender code", () => {
    const generator = new JSONGenerator();
    const fileName = (
      generator as unknown as {
        generateFileName: (submissionId: string, lenderCode: string) => string;
      }
    ).generateFileName("test-submission", "TEST_LENDER");
    expect(fileName).toContain("TEST_LENDER-");
  });
});

describe("fileGenerationService singleton", () => {
  test("should be instance of FileGenerationServiceImpl", () => {
    expect(fileGenerationService).toBeInstanceOf(FileGenerationServiceImpl);
  });
});
