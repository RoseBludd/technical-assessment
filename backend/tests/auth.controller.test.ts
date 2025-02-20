import "../__mocks__/typeorm";
import app from "../src/server";
import request from "supertest";

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("/login should trigger validation", async () => {
    const result = await request(app)
      .post("/auth/login")
      .send({ email: "invalid-email", password: "dumb password" });

    expect(result.body.message).toContain("Validation failed");
    expect(result.statusCode).toEqual(400);
  });
});
