import request from "supertest";

describe("GrapesJS Server", () => {
  const originalEnv = process.env.NODE_ENV;
  let app: any;

  beforeEach(async () => {
    // Reset modules so envalid re-reads NODE_ENV
    jest.resetModules();
    // Set to development by default to bypass auth for most tests
    process.env.NODE_ENV = "development";
    // Re-import app after setting NODE_ENV
    app = (await import("../main")).default;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test("should respond to health check", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      service: "grapesjs-server",
    });
    expect(response.body.timestamp).toBeDefined();
  });

  test("should serve editor page", async () => {
    const response = await request(app).get("/editor");

    expect(response.status).toBe(200);
    expect(response.text).toContain("LIXIT Template Editor");
    expect(response.text).toContain("grapesjs");
  });

  test("should return 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "Not found",
    });
  });

  test("should require auth for templates API in production", async () => {
    // Reset modules and set production mode
    jest.resetModules();
    process.env.NODE_ENV = "production";
    app = (await import("../main")).default;

    const response = await request(app).get("/api/templates");

    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Authentication required");
  });

  test("should allow templates API in development", async () => {
    const response = await request(app).get("/api/templates");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: [],
    });
  });
});
